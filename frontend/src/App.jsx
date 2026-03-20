import React, { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import LandingPage from './pages/LandingPage';
import InputForm from './pages/InputForm';
import ResultPage from './pages/ResultPage';
import { Sprout } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [resultData, setResultData] = useState(null);

  const navigateTo = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#262626]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigateTo('landing')}
          >
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-md text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Sprout size={18} />
            </div>
            <span className="font-semibold tracking-tight text-gray-900 dark:text-white">YieldAI</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('landing')} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Documentation</button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col flex-grow">
        {currentPage === 'landing' && <LandingPage onTryMe={() => navigateTo('form')} />}
        
        {currentPage === 'form' && (
          <InputForm 
            onSuccess={(data) => {
              setResultData(data);
              navigateTo('result');
            }} 
            onBack={() => navigateTo('landing')}
          />
        )}
        
        {currentPage === 'result' && (
          <ResultPage 
            data={resultData} 
            onTryAgain={() => navigateTo('form')} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-[#262626] mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} YieldAI Setup. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
