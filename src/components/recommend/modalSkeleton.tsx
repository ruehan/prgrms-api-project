import React from 'react'

interface SkeletonUIProps {
  count?: number
}

const SkeletonUI: React.FC<SkeletonUIProps> = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-lg bg-white shadow-md">
          <div className="h-48 w-full bg-gray-300"></div>
          <div className="p-4">
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 rounded bg-gray-300"></div>
          </div>
          <div className="bg-gray-100 px-4 py-2">
            <div className="h-6 w-16 rounded bg-gray-300"></div>
          </div>
        </div>
      ))}
    </>
  )
}

export default SkeletonUI
