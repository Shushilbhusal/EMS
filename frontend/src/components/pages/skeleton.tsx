import React from 'react';

interface SimpleTableSkeletonProps {
  rows?: number;
  columns?: number;
}

const SimpleTableSkeleton: React.FC<SimpleTableSkeletonProps> = ({
  rows = 6,
  columns = 4,
}) => {
  return (
    <div className="animate-pulse">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 bg-gray-50 px-6 py-3">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={`header-${index}`} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
        
        {/* Body */}
        <div className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div 
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`h-4 bg-gray-200 rounded ${
                      colIndex === 0 ? 'w-3/4' : 
                      colIndex === columns - 1 ? 'w-1/2' : 
                      'w-full'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleTableSkeleton;