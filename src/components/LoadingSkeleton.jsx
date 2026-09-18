import React from 'react';

export const LoadingSkeleton = ({
  count = 6,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5
        md:grid-cols-2
        lg:grid-cols-3
      "
      role="status"
      aria-label="Loading opportunities"
      aria-busy="true"
    >
      <span className="sr-only">
        Loading opportunities...
      </span>

      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            rounded-xl
            border border-gray-200
            bg-white
            p-6
            animate-pulse
          "
          aria-hidden="true"
        >
          <div className="flex justify-between gap-4">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="h-5 w-20 rounded-full bg-gray-200" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-5">
            <div>
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-16 rounded bg-gray-200" />
            </div>

            <div>
              <div className="h-3 w-12 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-12 rounded bg-gray-200" />
            </div>

            <div>
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-28 rounded bg-gray-200" />
            </div>

            <div>
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">
            <div className="ml-auto h-8 w-20 rounded-lg bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};