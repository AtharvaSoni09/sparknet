import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface PredictionResult {
  prediction_log: number;
  prediction_acres: number;
}

interface LimeExplanation {
  feature: string;
  weight: number;
}

interface ExplainResult extends PredictionResult {
  lime_explanation: LimeExplanation[];
  input_features: Record<string, number>;
  sensitivities?: Record<string, {gradient_log_scale: number}>;
}

interface SensitivityResult extends PredictionResult {
  sensitivities: Record<string, {gradient_log_scale: number}>;
}

const emptyFeatures = {
  temp_max_F: '',
  humidity_pct: '',
  windspeed_mph: '',
  precip_in: '',
  ndvi: '',
  pop_density: '',
  slope: '',
};

const Product: React.FC = () => {
  const [features, setFeatures] = useState<any>(emptyFeatures);
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [sensitivityData, setSensitivityData] = useState<SensitivityResult | null>(null);
  const [gptRecommendations, setGptRecommendations] = useState<string>('');
  const [gptLoading, setGptLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>('');

  // Keep API server alive with periodic health checks
  useEffect(() => {
    const healthCheck = async () => {
      try {
        const API_URL = import.meta.env?.VITE_API_URL || 'https://sparknet-fire-potential-mvp.onrender.com/explain';
        // Simple GET request to keep server awake - use base URL
        const baseUrl = API_URL.replace('/explain', '');
        await fetch(baseUrl, { method: 'HEAD' });
        console.log('Health check: API server kept alive');
      } catch (err) {
        console.log('Health check failed (expected if server is sleeping):', err);
      }
    };

    // Check every 30 seconds (30000 ms)
    const interval = setInterval(healthCheck, 30000);
    
    // Initial check on component mount
    healthCheck();

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeatures({ ...features, [name]: value });
  };

  const getGPTRecommendations = async (sensitivityData: SensitivityResult) => {
    try {
      setGptLoading(true);
      
      // Debug: Check if API key is available
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      console.log('API Key available:', !!apiKey);
      console.log('API Key starts with:', apiKey?.substring(0, 10) + '...');
      
      if (!apiKey) {
        throw new Error('OpenAI API key not found in environment variables');
      }
      
      const sensitivities = sensitivityData.sensitivities;
      const sortedFeatures = Object.entries(sensitivities)
        .sort(([,a], [,b]) => Math.abs(b.gradient_log_scale) - Math.abs(a.gradient_log_scale))
        .map(([feature, data]) => ({
          feature: feature.replace(/_/g, ' '),
          sensitivity: data.gradient_log_scale,
          impact: data.gradient_log_scale > 0 ? 'increases' : 'decreases'
        }));

      const prompt = `Based on this wildfire sensitivity analysis, provide specific firefighting recommendations:

RAW SENSITIVITY DATA (Complete Dataset):
${Object.entries(sensitivities).map(([feature, data]) => `${feature}: ${data.gradient_log_scale.toFixed(6)}`).join('\n')}

Top affecting features (by sensitivity magnitude):
${sortedFeatures.map(f => `• ${f.feature}: ${f.impact} fire risk (sensitivity: ${f.sensitivity.toFixed(4)})`).join('\n')}

Current prediction: ${sensitivityData.prediction_acres.toFixed(2)} acres

IMPORTANT: Analyze ALL raw sensitivity data above. Each feature's gradient_log_scale value shows exactly how much it impacts fire prediction. Positive values increase fire risk, negative values decrease it.

Provide actionable recommendations for firefighters based on which features most impact fire risk. Focus on:
1. Techniques to reduce high-risk factors
2. Strategies for low-risk factors 
3. Environmental management suggestions
4. Safety protocols

FORMAT REQUIREMENTS:
- Put each complete recommendation on a NEW LINE
- Start each line with a number (1., 2., 3., etc.)
- Keep each recommendation concise but complete
- Maximum 6 recommendations
- Each recommendation should be one complete thought
- Each recomendation should be on the same line. Then, for the next reccomendation, it should be on a NEW LINE.
- GIVE SPECIFIC AND ACTIONABLE RECCOMENDATIONS. DONT BE VAGUE.
- MAKE SURE EACH RECCOMENDATION HAS SPECIFIC FEATURE REFERENCED AFTER THE BASE RECOMMENDATION. in other words, add the feature's raw sensitivity data AFTER

More instructions:
- ensure that recommendations are actionable and specific
- ensure that recommendations are based on raw sensitivity data provided
- ensure that reccomendations are POSSIBLE in a TIMELY MANNER
- REFERENCE SPECIFIC DATA FROM SENS FROM THE RAW SENSITIVITY DATA PROVIDED IN YOUR RECS
        - (add to end of recommendation)
- examples below are ONLY examples.if they break any of these rules, dont use it.
Example format:
1. Deploy water retardant in high humidity areas to reduce fire spread (humidity_pct: -0.446194).
2. Create fire breaks in regions with high wind speeds. (wind_mph: 0.324567)
3. Use controlled burns to manage vegetation density in high NDVI areas. (ndvi: 0.234567)`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        })
      });

      console.log('OpenAI Response Status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API Error Response:', errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      const recommendation = data.choices[0]?.message?.content || 'No recommendations available';
      setGptRecommendations(recommendation);
    } catch (err) {
      console.error('GPT API error:', err);
      setGptRecommendations('Failed to get AI recommendations.');
    } finally {
      setGptLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSensitivityData(null);
    setLoadingStage('Preparing prediction data...');
    
    try {
      // Convert all feature values to numbers before sending
      const numericFeatures = Object.fromEntries(
        Object.entries(features).map(([k, v]) => [k, v === '' ? null : Number(v)])
      );
      
      setLoadingStage('Connecting to AI model...');
      
      // Use environment-aware API URL
      const API_URL = import.meta.env?.VITE_API_URL || 'https://sparknet-fire-potential-mvp.onrender.com/explain';
      console.log('Using API URL:', API_URL);
      
      setLoadingStage('Analyzing environmental factors...');
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericFeatures),
      });
      
      console.log('Prediction API Response Status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Prediction API Error Response:', errorData);
        throw new Error(`Prediction API error: ${res.status} - ${errorData}`);
      }
      const data = await res.json();
      setResult(data);
      
      // Also get sensitivity data
      setLoadingStage('Getting recommendations...');
      const sensitivityUrl = API_URL.replace('/explain', '/sensitivity');
      const sensitivityRes = await fetch(sensitivityUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericFeatures),
      });
      
      if (sensitivityRes.ok) {
        const sensitivityData = await sensitivityRes.json();
        setSensitivityData(sensitivityData);
        
        // Get ChatGPT recommendations
        setLoadingStage('Getting AI recommendations...');
        await getGPTRecommendations(sensitivityData);
      }
      
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction.');
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">Wildfire Severity Prediction</h1>
      <GlassCard className="mb-8 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="text-sm font-semibold mb-1 capitalize text-gray-200">
                {key.replace(/_/g, ' ')}
                {key === 'pop_density' && (
                  <span className="text-xs text-gray-400 ml-1">(people/square km)</span>
                )}
                {key === 'slope' && (
                  <span className="text-xs text-gray-400 ml-1">(rise/run * 100)</span>
                )}
                {key === 'ndvi' && (
                  <span className="text-xs text-gray-400 ml-1">(0-6000: vegetation index, low=less fuel, high=more fuel)</span>
                )}
                {key === 'windspeed_mph' && (
                  <span className="text-xs text-gray-400 ml-1">(wind speed in miles per hour)</span>
                )}
                {key === 'temp_max_F' && (
                  <span className="text-xs text-gray-400 ml-1">(maximum temperature in Fahrenheit)</span>
                )}
                {key === 'humidity_pct' && (
                  <span className="text-xs text-gray-400 ml-1">(relative humidity percentage)</span>
                )}
                {key === 'precip_in' && (
                  <span className="text-xs text-gray-400 ml-1">(precipitation in inches)</span>
                )}
              </label>
              <input
                type="number"
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                required
              />
            </div>
          ))}
          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                'Predict Fire Size'
              )}
            </button>
          </div>
        </form>
        {error && <div className="text-red-400 mt-4 text-center">{error}</div>}
      </GlassCard>

      {loading && (
        <GlassCard className="p-6 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2 text-brand-orange">Analyzing Wildfire Risk</h3>
            <p className="text-gray-300 mb-4">{loadingStage}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
                <span>Processing environmental data...</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse delay-75"></div>
                <span>Running AI predictions...</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse delay-150"></div>
                <span>Generating feature importance...</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">This usually takes 6-7 seconds for detailed analysis</p>
          </div>
        </GlassCard>
      )}

      {result && (
        <GlassCard className="p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-2 text-brand-orange">Prediction</h2>
          <div className="text-lg mb-4">Estimated Fire Size: <span className="font-bold text-orange-300">{result.prediction_acres.toFixed(2)} acres</span></div>
          
          {/* Feature Importance */}
          <div className="bg-white/5 rounded-lg border border-white/20 p-4">
            <h3 className="text-xl font-semibold mb-2 mt-6">Feature Importance (LIME)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={result.lime_explanation.filter(item => !item.feature.includes('precip'))} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="feature" 
                tick={{ fill: '#fff', fontSize: 12 }} 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tickFormatter={(value: string) => {
                  console.log('Original value:', value);
                  console.log('Split on space:', value.split(' '));
                  console.log('Split on >=:', value.split(/[<>=]/));
                  console.log('Split on (:', value.split('('));
                  
                  // Map to clean feature names
                  const featureMap: Record<string, string> = {
                    'temp_max_F': 'temp max F',
                    'humidity_pct': 'humidity pct',
                    'windspeed_mph': 'windspeed mph',
                    'precip_in': 'precip in',
                    'ndvi': 'ndvi',
                    'pop_density': 'pop density',
                    'slope': 'slope'
                  };
                  
                  // Try multiple extraction methods
                  let cleanName = '';
                  
                  // Method 1: Split on comparison operators
                  if (value.includes('<') || value.includes('>') || value.includes('=')) {
                    // Extract feature name from middle of string
                    const match = value.match(/([a-zA-Z_]+)(?=\s*[<>=])/);
                    if (match) {
                      cleanName = match[1];
                    } else {
                      // Fallback: split and get middle part
                      const parts = value.split(/[<>=]/);
                      cleanName = parts[1] || parts[0];
                    }
                    console.log('Method 1 - Comparison split:', cleanName);
                  } 
                  // Method 2: Split on parenthesis
                  else if (value.includes('(')) {
                    cleanName = value.split('(')[0];
                    console.log('Method 2 - Parenthesis split:', cleanName);
                  }
                  // Method 3: Split on space
                  else if (value.includes(' ')) {
                    cleanName = value.split(' ')[0];
                    console.log('Method 3 - Space split:', cleanName);
                  }
                  // Method 4: Use mapping
                  else {
                    cleanName = featureMap[value] || value;
                    console.log('Method 4 - Mapping:', cleanName);
                  }
                  
                  // Final cleanup
                  cleanName = cleanName.replace(/[^a-zA-Z_]/g, '');
                  console.log('Final cleaned name:', cleanName);
                  return cleanName;
                }}
              />
              <YAxis tick={{ fill: '#fff' }} />
              <Tooltip 
                formatter={(value: number) => value.toFixed(4)} 
                contentStyle={{ backgroundColor: '#333', border: 'none' }}
                labelFormatter={(label: string) => {
                  console.log('Tooltip label:', label);
                  
                  // Use same logic as X-axis
                  let cleanName: string;
                  
                  if (label.includes('<') || label.includes('>') || label.includes('=')) {
                    const parts = label.split(/[<>=]/);
                    cleanName = parts[0];
                  } else if (label.includes('(')) {
                    cleanName = label.split('(')[0];
                  } else if (label.includes(' ')) {
                    cleanName = label.split(' ')[0];
                  } else {
                    const featureMap: Record<string, string> = {
                      'temp_max_F': 'temp max F',
                      'humidity_pct': 'humidity pct',
                      'windspeed_mph': 'windspeed mph',
                      'precip_in': 'precip in',
                      'ndvi': 'ndvi',
                      'pop_density': 'pop density',
                      'slope': 'slope'
                    };
                    
                    let baseName = label.split(/[<>=]/)[0];
                    baseName = baseName.split('(')[0];
                    cleanName = featureMap[baseName] || baseName.replace(/[^a-zA-Z_]/g, '');
                  }
                  
                  console.log('Tooltip cleaned name:', cleanName);
                  return cleanName;
                }}
              />
              <Bar dataKey="weight" name="Feature Impact">
                {result.lime_explanation.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.weight >= 0 ? '#10b981' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
          
          {/* Sensitivity Analysis (SIDE) */}
          {sensitivityData && (
            <div className="bg-white/5 rounded-lg border border-white/20 p-4 mt-6">
              <h3 className="text-xl font-semibold mb-2">Sensitivity Analysis (SIDE)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={Object.entries(sensitivityData.sensitivities)
                    .filter(([feature]) => !feature.includes('precip'))
                    .map(([feature, data]) => ({
                    feature: feature.replace(/_/g, ' '),
                    sensitivity: (data as any).gradient_log_scale
                  }))} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="feature" 
                    tick={{ fill: '#fff', fontSize: 12 }} 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                  />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(4)} 
                    contentStyle={{ backgroundColor: '#333', border: 'none' }}
                  />
                  <Bar dataKey="sensitivity" name="Sensitivity Impact">
                    {Object.entries(sensitivityData.sensitivities).map(([feature, data]) => (
                      <Cell 
                        key={`cell-${feature}`} 
                        fill={(data as any).gradient_log_scale >= 0 ? '#ef4444' : '#3b82f6'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {/* GPT Recommendations */}
          {(gptRecommendations || gptLoading) && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/20">
              <h3 className="text-lg font-semibold mb-4 text-brand-orange">Recommendations</h3>
              
              {gptLoading ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                    <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-white/10 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                    <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-white/10 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                    <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-white/10 rounded animate-pulse w-4/5"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    // Parse recommendations more intelligently
                    const lines = gptRecommendations.split('\n');
                    const recommendations = [];
                    let currentRecommendation = '';
                    
                    for (const line of lines) {
                      const trimmedLine = line.trim();
                      
                      // Check if this is a new recommendation (starts with number/bullet)
                      if (/^\d+\.|•|[-*]/.test(trimmedLine)) {
                        // Save previous recommendation if exists
                        if (currentRecommendation.trim()) {
                          recommendations.push(currentRecommendation.trim());
                        }
                        // Start new recommendation (remove bullet/number)
                        currentRecommendation = trimmedLine.replace(/^\d+\.|•|[-*]\s*/, '');
                      } else if (trimmedLine.length > 0) {
                        // Continue current recommendation
                        currentRecommendation += ' ' + trimmedLine;
                      }
                    }
                    
                    // Add last recommendation
                    if (currentRecommendation.trim()) {
                      recommendations.push(currentRecommendation.trim());
                    }
                    
                    return recommendations.map((recommendation, index) => (
                      <div key={index} className="p-3 bg-white/10 rounded-lg border-l-4 border-brand-orange">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};

export default Product;
