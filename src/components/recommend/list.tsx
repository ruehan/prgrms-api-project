import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Performance {
  mt20id: string
  prfnm: string
  prfpdfrom: string
  prfpdto: string
  fcltynm: string
  poster: string
  genrenm: string
  prfstate: string
  openrun: string
  area: string
}

interface PerformanceListProps {
  performances: {
    root: {
      [genre: string]: Performance[]
    }
  }
}

const PerformanceList: React.FC<PerformanceListProps> = ({ performances }) => {
  const scrollLeft = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  if (!performances.root || Object.keys(performances.root).length === 0) {
    return <p className="text-center text-lg">No performances available.</p>
  }

  return (
    <div className="max-w-[1440px] space-y-8 px-4 sm:px-6 lg:px-8">
      {Object.entries(performances.root).map(([genre, shows]) => (
        <div key={genre} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold sm:text-2xl">{genre}</h2>
          <div className="relative">
            <button
              onClick={() => scrollLeft(`carousel-${genre}`)}
              className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md sm:block"
            >
              <ChevronLeft size={24} />
            </button>
            <div
              id={`carousel-${genre}`}
              className="hide-scrollbar flex space-x-4 overflow-x-auto pb-4"
            >
              {Array.isArray(shows) && shows.length > 0 ? (
                shows.map((show) => (
                  <div key={show.mt20id} className="w-40 flex-none sm:w-48 md:w-56 lg:w-64">
                    <img
                      src={show.poster}
                      alt={show.prfnm}
                      className="h-56 w-full rounded-lg object-cover shadow-md sm:h-64 md:h-72 lg:h-80"
                    />
                    <h3 className="mt-2 text-sm font-semibold sm:text-base">{show.prfnm}</h3>
                    <p className="text-xs text-gray-600 sm:text-sm">{show.fcltynm}</p>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {show.prfpdfrom} - {show.prfpdto}
                    </p>
                  </div>
                ))
              ) : (
                <p className="w-full text-center">No shows available for this genre.</p>
              )}
            </div>
            <button
              onClick={() => scrollRight(`carousel-${genre}`)}
              className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md sm:block"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PerformanceList
