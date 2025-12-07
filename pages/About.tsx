import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import GlassCard from '../components/GlassCard';
import { Database, Code2, Cpu } from 'lucide-react';

const About: React.FC = () => {
  // Real SHAP impact data from the model
  const featureData = [
    { name: 'Wind Speed', importance: 92 },
    { name: 'Humidity', importance: 88 },
    { name: 'Pop Density', importance: 82 },
    { name: 'Precipitation', importance: 50 },
    { name: 'Vegetation (NDVI)', importance: 45 },
    { name: 'Temperature', importance: 10 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-white/10 p-2 rounded shadow-xl text-xs">
          <p className="text-white font-bold">{label}</p>
          <p className="text-brand-orange">Impact: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 space-y-24">
      {/* Header */}
      <section className="text-center pt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Inside the Technology</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          We believe in transparency. Here's how SparkNet uses data to save lives.
        </p>
      </section>

      {/* Tech Stack & Data */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard>
            <div className="flex items-center mb-6">
                <Database className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Data Sources</h2>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Our model aggregates data from trusted scientific sources to ensure reliability. 
                Accuracy relies on high-quality, region-specific inputs.
            </p>
            <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Wildfires</span>
                    <span className="text-gray-500">Kaggle / 188M US Wildfires</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Weather</span>
                    <span className="text-gray-500">Open-Meteo API</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Vegetation (NDVI)</span>
                    <span className="text-gray-500">NASA EarthData</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Topography</span>
                    <span className="text-gray-500">OpenTopography</span>
                </li>
                 <li className="flex justify-between pt-2">
                    <span>Population</span>
                    <span className="text-gray-500">WorldPop</span>
                </li>
            </ul>
        </GlassCard>

        <GlassCard>
            <div className="flex items-center mb-6">
                <Code2 className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">The Tech Stack</h2>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Built with Python and deployed via scalable cloud infrastructure. We prioritize interpretability using SHAP and LIME tools.
            </p>
            <div className="flex flex-wrap gap-2">
                {['Python', 'TensorFlow', 'Keras', 'Scikit-Learn', 'Pandas', 'NumPy', 'Seaborn', 'SMOGN', 'React'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                        {tech}
                    </span>
                ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-brand-orange" />
                    Model Architecture
                </h4>
                <p className="text-xs text-gray-400">
                    Deep learning neural network optimized for tabular environmental data, utilizing SMOGN for synthetic minority over-sampling to handle rare, extreme fire events.
                </p>
            </div>
        </GlassCard>
      </section>

      {/* Model Performance Section */}
      <section>
        <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-4">Understandable AI</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                    Complex models can be "black boxes". We use LIME (Local Interpretable Model-agnostic Explanations) to ensure Fire Authorities understand exactly why our model makes specific predictions.
                </p>
                <p className="text-gray-400 mb-6 leading-relaxed">
                    For example, when our model analyzes a location with 20 mph winds and 10% humidity, it predicts a fire could grow to <span className="text-brand-orange font-semibold">245.31 acres</span>. Green bars show factors that increase fire size (wind, low humidity), while red bars show factors that reduce it (high population density leads to faster detection).
                </p>
                <p className="text-gray-400 leading-relaxed text-sm text-gray-500">
                    This transparency builds trust with firefighters and emergency managers who need to understand the reasoning behind critical predictions.
                </p>
            </div>
            <div className="md:w-1/2 w-full">
                <GlassCard className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Example Prediction</h3>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <p className="text-xs text-gray-400 mb-2">Explanation - Predicted Score: 2.39</p>
                            <p className="text-2xl font-bold text-brand-orange">245.31 acres</p>
                            <p className="text-xs text-gray-500 mt-2">Predicted fire size for given conditions</p>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Input Values</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-800/50 rounded p-2">
                                <p className="text-gray-500">Max Temp</p>
                                <p className="text-white font-semibold">90.0°F</p>
                            </div>
                            <div className="bg-slate-800/50 rounded p-2">
                                <p className="text-gray-500">Humidity</p>
                                <p className="text-white font-semibold">10.0%</p>
                            </div>
                            <div className="bg-slate-800/50 rounded p-2">
                                <p className="text-gray-500">Precipitation</p>
                                <p className="text-white font-semibold">1.0 in</p>
                            </div>
                            <div className="bg-slate-800/50 rounded p-2">
                                <p className="text-gray-500">Wind Speed</p>
                                <p className="text-white font-semibold">20.0 mph</p>
                            </div>
                            <div className="bg-slate-800/50 rounded p-2">
                                <p className="text-gray-500">Vegetation</p>
                                <p className="text-white font-semibold">3000.0</p>
                            </div>
                            <div className="bg-slate-800/50 rounded p-2">
                                <p className="text-gray-500">Pop Density</p>
                                <p className="text-white font-semibold">400.0</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Feature Contribution (LIME Impact)</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-green-500/60 rounded"></div>
                                <span className="text-gray-400">Wind Speed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 bg-green-500/60 rounded"></div>
                                <span className="text-gray-400">Humidity</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-red-500/60 rounded"></div>
                                <span className="text-gray-400">Pop Density</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-1.5 bg-green-500/60 rounded"></div>
                                <span className="text-gray-400">Precipitation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-1.5 bg-red-500/60 rounded"></div>
                                <span className="text-gray-400">Vegetation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500/60 rounded"></div>
                                <span className="text-gray-400">Temperature</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1.5 bg-green-500/60 rounded"></div>
                                <span className="text-gray-400">Slope</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs mt-3">Green = increases fire size | Red = decreases fire size</p>
                    </div>
                </GlassCard>
            </div>
        </div>
      </section>

      {/* Story / Lessons */}
      <section className="bg-gradient-to-br from-brand-orange/10 to-transparent p-1 rounded-3xl">
        <div className="bg-slate-900 rounded-[22px] p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">What Went Well</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Data aggregation was seamless thanks to NASA and UC San Diego. We successfully shifted from raw acreage prediction to a "Magnitude Scale" (1-6), similar to earthquakes, allowing better prediction of rare, catastrophic events.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-red-400 mb-4">Challenges Overcome</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Early models focused too much on pure accuracy, failing on edge cases. We pivoted to robustness and interpretability. We also implemented strict data organization protocols after initial struggles with file management.
                    </p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;