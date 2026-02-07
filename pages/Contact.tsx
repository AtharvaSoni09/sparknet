import React from 'react';
import { Mail } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Contact: React.FC = () => {
  const contactEmails = [
    'atharvasoni08@gmail.com',
    'yashpkher@gmail.com'
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 min-h-[70vh] flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Get in touch</h1>
        <p className="text-xl text-gray-400">
          We want to hear from you. Reach out to us directly via email.
        </p>
      </div>

      <GlassCard className="relative overflow-hidden p-8 md:p-12">
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-brand-orange/20 text-brand-orange rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Email Us</h3>
            <p className="text-gray-400 mb-8 max-w-md">
              Whether you have questions, feedback, or want to collaborate, we're just an email away.
            </p>

            <div className="grid gap-4 w-full max-w-md">
              {contactEmails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-orange/50 transition-all group"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">{email}</span>
                  <div className="text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity">
                    <Mail className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          SparkNet &copy; {new Date().getFullYear()} - Working together for a safer future.
        </p>
      </div>
    </div>
  );
};

export default Contact;