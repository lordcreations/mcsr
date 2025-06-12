'use client';

export const StateSidebar = ({ selectedStateName }: { selectedStateName: string }) => {
  return (
    <div className="w-90 bg-gray-800 text-white p-4">
          <div className="space-y-6">
            <div className="flex justify-center items-center text-3xl font-bold">
              <p className="text-4xl font-bold text-center" id="estado">{selectedStateName}</p>
            </div>
  
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <button className="w-24 p-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors" id="rsgBtn">RSG</button>
                <button className="w-24 p-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors" id="ssgBtn">SSG</button>
                <button className="w-24 p-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors" id="rankedBtn">RANKED</button>
              </div>
  
              <div className="flex justify-center gap-8" id="verDiv">
                <button className="w-20 p-1.5 bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors" id="1.7Btn">Pre 1.9</button>
                <button className="w-20 p-1.5 bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors" id="1.14Btn">1.13-1.15</button>
                <button className="w-20 p-1.5 bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors" id="1.16Btn">1.16+</button>
              </div>
  
              <div className="space-y-2" id="tbl-data">
                <hr className="border-gray-700" />
              </div>
            </div>
          </div>
        </div>
  );
};
