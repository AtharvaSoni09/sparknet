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
}

// Extend ImportMeta interface for Vite env vars
interface ImportMetaEnv {
  VITE_API_URL?: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

// Extend the global ImportMeta interface
declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
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
      
      setLoadingStage('Generating LIME explanations...');
      
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResult(data);
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
          <h3 className="text-xl font-semibold mb-2 mt-6">Feature Importance (LIME)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={result.lime_explanation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        </GlassCard>
      )}
    </div>
  );
};

export default Product;
