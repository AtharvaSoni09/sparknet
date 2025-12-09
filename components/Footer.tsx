import React from 'react';
import { Github, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center space-y-8">
        <div className="text-center">
          <span className="text-xl font-bold tracking-tight text-white">
            Spark<span className="text-brand-orange">Net</span>
          </span>
          <p className="text-gray-500 text-sm mt-2">
            Stopping fires before they stop us.
          </p>
        </div>

        <div className="flex space-x-6">
          <a href="https://github.com/yashkher-123/fire" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.instagram.com/sparknetai?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
        
        <div className="text-gray-500 text-xs">
          © {new Date().getFullYear()} SparkNet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;