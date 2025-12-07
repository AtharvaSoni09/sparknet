import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold tracking-tight text-white">
            Spark<span className="text-brand-orange">Net</span>
          </span>
          <p className="text-gray-500 text-sm mt-2">
            Stopping fires before they stop us.
          </p>
        </div>

        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
        
        <div className="mt-4 md:mt-0 text-gray-500 text-xs">
          © {new Date().getFullYear()} SparkNet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;