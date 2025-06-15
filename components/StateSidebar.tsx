'use client';
import { useState } from 'react';
import { RunCard } from './RunCard';
import { getFilteredRuns, type RunCategory, type RunVersion, type Run } from '@/lib/mockRuns';

export const StateSidebar = ({ selectedStateName }: { selectedStateName: string }) => {
  const [selectedCategory, setSelectedCategory] = useState<RunCategory | null>(null);

  const handleCategoryClick = (category: RunCategory) => {
    setSelectedCategory(prev => prev === category ? null : category);
  };

  const filteredRuns = getFilteredRuns(selectedCategory, null, selectedStateName);

  const isCategoryActive = (category: RunCategory) => selectedCategory === category;

  return (
    <div className="w-90 bg-gray-800 text-white p-4">
      <div className="space-y-6">
        <div className="flex justify-center items-center text-3xl font-bold">
          <p className="text-4xl font-bold text-center" id="estado">{selectedStateName}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center gap-8">
            <button 
              onClick={() => handleCategoryClick('rsg')}
              className={`w-32 p-3 rounded-lg transition-colors text-lg font-medium ${
                isCategoryActive('rsg') 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-800 hover:bg-blue-700'
              }`}
            >
              RSG
            </button>
            <button 
              onClick={() => handleCategoryClick('ranked')}
              className={`w-32 p-3 rounded-lg transition-colors text-lg font-medium ${
                isCategoryActive('ranked') 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-800 hover:bg-blue-700'
              }`}
            >
              RANKED
            </button>
          </div>

          <div className="space-y-2 mt-4" id="runs-container">
            <hr className="border-gray-700" />
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2">
              {filteredRuns.length > 0 ? (
                filteredRuns.map((run: Run, index: number) => (
                  <RunCard key={run.id} run={run} index={index} />
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No runs :(</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateSidebar;
