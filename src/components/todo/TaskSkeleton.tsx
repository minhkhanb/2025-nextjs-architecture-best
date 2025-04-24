'use client';

import React from 'react';

interface TaskSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

const TaskSkeleton: React.FC<TaskSkeletonProps> = ({
  count = 6,
  viewMode = 'grid',
}) => {
  return (
    <div
      className={`grid gap-4 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1'
      }`}
    >
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border shadow-sm p-4 animate-pulse"
          >
            {/* Title skeleton */}
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                {/* Description skeleton */}
                <div className="mt-2 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              {/* Status badge skeleton */}
              <div className="w-20 h-6 bg-gray-200 rounded-md"></div>
            </div>

            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-1 mt-3 mb-1">
              <div className="w-16 h-5 bg-gray-200 rounded"></div>
              <div className="w-20 h-5 bg-gray-200 rounded"></div>
            </div>

            {/* Info footer skeleton */}
            <div className="flex justify-between items-center mt-4">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Actions skeleton */}
            <div className="border-t mt-4 pt-2 flex justify-between items-center">
              <div className="w-32 h-8 bg-gray-200 rounded"></div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TaskSkeleton;
