import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, BarChart2, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResultPage({ data, onTryAgain }) {
  if (!data) return null;

  const yieldValue = data.prediction;
  
  let status = 'Moderate';
  let StatusIcon = AlertCircle;
  let statusColor = 'text-amber-600 dark:text-amber-500';

  if (yieldValue > 50000) {
    status = 'Optimal';
    StatusIcon = CheckCircle2;
    statusColor = 'text-emerald-600 dark:text-emerald-500';
  } else if (yieldValue < 20000) {
    status = 'Low';
    statusColor = 'text-red-600 dark:text-red-500';
  }

  const formatText = (text) => {
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    return paragraphs.map((p, i) => {
      let content = p.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');
      
      if (content.startsWith('* ') || content.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-2 text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: content.substring(2)}} />;
      }
      
      if (/^\d+\./.test(content)) {
        return <h4 key={i} className="font-semibold text-[15px] mt-5 mb-2 text-gray-900 dark:text-white border-b border-gray-100 dark:border-[#262626] pb-1" dangerouslySetInnerHTML={{__html: content}} />;
      }
      
      return <p key={i} className="mb-3 text-gray-600 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{__html: content}} />;
    });
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onTryAgain}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            New Prediction
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Prediction ID: #{Math.random().toString(36).substr(2, 8).toUpperCase()}
          </div>
        </div>

        {/* Highlighted Result Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="saas-card p-6 md:p-8 border-l-4 border-l-emerald-500 bg-white dark:bg-[#111111] flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Estimated Production Yield</span>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] ${statusColor}`}>
                <StatusIcon size={12} />
                {status}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {Math.round(yieldValue).toLocaleString()}
              </h1>
              <span className="text-xl font-medium text-gray-500 dark:text-gray-400">hg/ha</span>
            </div>
          </div>
          
          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Model Precision: Highly Confident</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Based on latest climate variables</p>
          </div>
        </motion.div>

        {/* 2 Clean Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-6">
          
          {/* Card 1: Prediction Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="saas-card p-6 min-h-[320px] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-[#262626] pb-4">
              <Target size={18} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Context Summary</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center text-sm">
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                This projection is specifically tailored based on the region and crop specified. The model utilizes historical agricultural patterns to estimate this baseline.
              </p>
              
              <ul className="space-y-4">
                <li className="flex justify-between items-center bg-gray-50 dark:bg-[#171717] px-3 py-2 rounded-md">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-900 dark:text-white">Ensemble ML</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50 dark:bg-[#171717] px-3 py-2 rounded-md">
                  <span className="text-gray-500">Top Influencer</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {data.top_features[0]?.feature.replace('Item_', '').replace('Area_', '')}
                  </span>
                </li>
                <li className="flex justify-between items-center bg-gray-50 dark:bg-[#171717] px-3 py-2 rounded-md">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium ${statusColor}`}>{status}</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2: Key Factors (SHAP) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="saas-card p-6 min-h-[320px] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-[#262626] pb-4">
              <BarChart2 size={18} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Driver Analysis</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-6">
              {data.top_features.map((feat, idx) => {
                const label = feat.feature.replace('Item_', 'Crop: ').replace('Area_', 'Location: ');
                const maxImp = Math.max(...data.top_features.map(f => Math.abs(f.importance)));
                const pct = Math.min(100, Math.abs(feat.importance) / maxImp * 100);
                
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{label}</span>
                      <span className="text-gray-400">Impact: High</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-[#262626] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + idx*0.1 }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Card 3: AI Explanation (Full Width) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="saas-card p-8 flex flex-col bg-white dark:bg-[#111111] shadow-md border-t-emerald-500/30 border-t-4"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-[#262626] pb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <MessageSquare size={22} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Detailed AI Advisor Insights</h3>
          </div>
          
          <div className="text-[15px] leading-relaxed">
            <div className="prose prose-emerald dark:prose-invert max-w-none">
              {formatText(data.ai_explanation)}
            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
      `}} />
    </div>
  );
}
