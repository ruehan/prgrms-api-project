import React from 'react'
import { Performance } from '../nearby/page'

interface RecommendationListProps {
  shows: Performance[]
}

const RecommendationList: React.FC<RecommendationListProps> = ({ shows }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {shows.map((show) => (
        <div key={show.mt20id} className="rounded-lg border p-4">
          <img src={show.poster} alt={show.prfnm} className="h-64 w-full object-cover" />
          <h2 className="mt-2 font-bold">{show.prfnm}</h2>
          <p>장르: {show.genrenm}</p>
          <p>
            기간: {show.prfpdfrom} - {show.prfpdto}
          </p>
        </div>
      ))}
    </div>
  )
}

export default RecommendationList
