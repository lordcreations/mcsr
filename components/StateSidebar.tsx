'use client';

export const StateSidebar = ({ selectedStateName }: { selectedStateName: string }) => {
  const handleCategoryClick = (category: string) => {
    console.log(`Categoria: ${category}`);
  };

  const handleVersionClick = (version: string) => {
    console.log(`Versao: ${version}`);
  };
  return (
    <div className="w-90 bg-gray-800 text-white p-4">
          <div className="space-y-6">
            <div className="flex justify-center items-center text-3xl font-bold">
              <p className="text-4xl font-bold text-center" id="estado">{selectedStateName}</p>
            </div>
  
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => handleCategoryClick('rsg')}
                  className="w-24 p-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  RSG
                </button>
                <button 
                  onClick={() => handleCategoryClick('ssg')}
                  className="w-24 p-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  SSG
                </button>
                <button 
                  onClick={() => handleCategoryClick('ranked')}
                  className="w-24 p-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  RANKED
                </button>
              </div>
  
              <div className="flex justify-center gap-8" id="verDiv">
                <button 
                  onClick={() => handleVersionClick('1.7')}
                  className="w-20 p-1.5 bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Pre 1.9
                </button>
                <button 
                  onClick={() => handleVersionClick('1.14')}
                  className="w-20 p-1.5 bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  1.13-1.15
                </button>
                <button 
                  onClick={() => handleVersionClick('1.16')}
                  className="w-20 p-1.5 bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  1.16+
                </button>
              </div>
  
              <div className="space-y-2" id="tbl-data">
                <hr className="border-gray-700" />
              </div>
            </div>
          </div>
        </div>
  );
};
