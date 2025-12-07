import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('citizen');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Submit to Google Apps Script
      const response = await fetch('https://script.google.com/macros/s/AKfycbxX7ibS1fZJz_NvMLohdvyOl2B2hjL2aE8kgX_cW43Qjs-XLJB6Qyg5CLvHbekiocS7/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          email,
          userType,
          message,
          timestamp: new Date().toISOString(),
        }),
      });

      // With no-cors, we can't check response.ok, so we assume success if no error thrown
      setStatus('success');
      setEmail('');
      setMessage('');
      setUserType('citizen');
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 min-h-[70vh] flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Get in touch</h1>
        <p className="text-xl text-gray-400">
          Whether you're a citizen, firefighter, or researcher, we want to hear from you.
        </p>
      </div>

      <GlassCard className="relative overflow-hidden">
        {status === 'success' ? (
          <div className="py-16 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
            <p className="text-gray-400">Thank you for joining the fight against wildfires.</p>
            <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-sm text-brand-orange hover:text-orange-400 underline"
            >
                Register another email
            </button>
          </div>
        ) : status === 'error' ? (
          <div className="py-16 text-center animate-fade-in">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Something went wrong</h3>
            <p className="text-gray-400">Please try again or email us at mail.sparknet@gmail.com</p>
            <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-sm text-brand-orange hover:text-orange-400 underline"
            >
                Try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg leading-5 bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition duration-150 ease-in-out sm:text-sm backdrop-blur-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                I am a...
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Citizen', 'Firefighter', 'Researcher'].map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setUserType(type.toLowerCase())}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                            userType === type.toLowerCase()
                                ? 'bg-brand-orange text-white shadow-lg shadow-orange-500/20'
                                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                        }`}
                    >
                        {type}
                    </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message (Optional)
                </label>
                <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="block w-full p-3 border border-white/10 rounded-lg leading-5 bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition duration-150 ease-in-out sm:text-sm backdrop-blur-sm"
                    placeholder="Tell us why you are interested..."
                ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange shadow-lg transform transition hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Join the Waitlist'
              )}
            </button>
          </form>
        )}
      </GlassCard>
      
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
            Contact us directly at <a href="mailto:mail.sparknet@gmail.com" className="text-brand-orange hover:underline">mail.sparknet@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default Contact;