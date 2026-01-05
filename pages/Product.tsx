import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeatures({ ...features, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Convert all feature values to numbers before sending
      const numericFeatures = Object.fromEntries(
        Object.entries(features).map(([k, v]) => [k, v === '' ? null : Number(v)])
      );
      const res = await fetch('http://127.0.0.1:8000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericFeatures),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">Wildfire Severity Prediction</h1>
      <GlassCard className="mb-8 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="text-sm font-semibold mb-1 capitalize text-gray-200">{key.replace(/_/g, ' ')}</label>
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
              className="px-8 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Predicting...' : 'Predict Fire Size'}
            </button>
          </div>
        </form>
        {error && <div className="text-red-400 mt-4 text-center">{error}</div>}
      </GlassCard>

      {result && (
        <GlassCard className="p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-2 text-brand-orange">Prediction</h2>
          <div className="text-lg mb-4">Estimated Fire Size: <span className="font-bold text-orange-300">{result.prediction_acres.toFixed(2)} acres</span></div>
          <h3 className="text-xl font-semibold mb-2 mt-6">Feature Importance (LIME)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={result.lime_explanation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="feature" tick={{ fill: '#fff' }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#fff' }} />
              <Tooltip formatter={(value: number) => value.toFixed(4)} contentStyle={{ backgroundColor: '#333', border: 'none' }} />
              <Bar dataKey="weight" fill="#fb923c" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}
    </div>
  );
};

export default Product;
