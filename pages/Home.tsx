import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, MapPin, Activity, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-24 pb-12">
      {/* Development Disclaimer */}
      <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg mx-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-yellow-200">
            <span className="font-semibold">⚠️ Early Development:</span> SparkNet is currently under active development. Our model predictions are <span className="font-semibold">not guaranteed</span> and may not yet be adequately representative of real wildfire risks and severity. This tool is for informational purposes only and should not be relied upon for emergency decisions. Always consult official fire authorities and meteorological agencies.
          </p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative px-6 pt-4 md:pt-6 lg:pt-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange text-xs font-medium mb-6 animate-fade-in-up">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Now monitoring Southern California
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          Stopping fires <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
            before they stop us.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          SparkNet uses advanced AI and satellite data to predict wildfire severity in Southern California, empowering communities and firefighters with actionable foresight.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="px-8 py-4 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            Get Early Access
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
          >
            How It Works <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Problem Section (Stats) */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="text-center group hover:bg-white/10 transition-all duration-300">
            <div className="mb-4 inline-flex p-3 rounded-full bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">57,000+</h3>
            <p className="text-gray-400">Acres burned in recent LA fires</p>
          </GlassCard>
          
          <GlassCard className="text-center group hover:bg-white/10 transition-all duration-300">
             <div className="mb-4 inline-flex p-3 rounded-full bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">200k+</h3>
            <p className="text-gray-400">People forced to evacuate</p>
          </GlassCard>

          <GlassCard className="text-center group hover:bg-white/10 transition-all duration-300">
             <div className="mb-4 inline-flex p-3 rounded-full bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">$135B</h3>
            <p className="text-gray-400">Economic loss due to unpreparedness</p>
          </GlassCard>
        </div>
      </section>

      {/* Unique Value Proposition */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why existing solutions <span className="text-red-500">fail</span> the public.
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                  <span className="text-xl font-bold text-gray-400">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Hidden Behind Paywalls</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Advanced predictive models exist, but they are often restricted to government agencies or paying corporate clients, leaving citizens in the dark.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                  <span className="text-xl font-bold text-gray-400">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Too General, Too Late</h4>
                  <p className="text-gray-400 leading-relaxed">
                    National models generalize terrain data. SparkNet is trained specifically on SoCal's unique topography and weather patterns for hyper-local accuracy.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                  <span className="text-xl font-bold text-gray-400">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Black Box Predictions Kill Trust</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Most models don't explain their reasoning. SparkNet uses LIME and SHAP to show exactly which factors (wind, humidity, vegetation) drive each prediction, building trust with fire authorities.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
             <GlassCard className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-brand-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">The SparkNet Advantage</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      <span className="text-gray-200">Localized training on SoCal fire history</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      <span className="text-gray-200">Real-time satellite data integration</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      <span className="text-gray-200">Explainable AI (White-box predictions)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      <span className="text-gray-200">Accessible to the general public</span>
                    </li>
                  </ul>
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="italic text-gray-400 text-sm">
                      "Bridging the gap between civilians and firefighters."
                    </p>
                  </div>
                </div>
             </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 text-center max-w-4xl mx-auto mt-12">
        <GlassCard className="p-12 border-brand-orange/30 bg-gradient-to-b from-slate-900 to-slate-900/50">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to stay ahead of the flames?</h2>
          <p className="text-gray-400 mb-8">
            Join our waitlist to get notified when SparkNet launches in your area.
          </p>
          <Link
             to="/contact"
             className="inline-block px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Involved
          </Link>
        </GlassCard>
      </section>
    </div>
  );
};

export default Home;