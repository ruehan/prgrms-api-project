import React from 'react'
import BestPerformances from './performances'
import MainBanner from './banner'
import ArtForestBanner from './artbanner'
import GenreRecommendations from './recommend'
import TicketOpen from './ticketopen'

const MainPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <main className="w-full">
        <MainBanner />
        <div className="flex w-screen flex-col items-center py-8">
          <BestPerformances />
          <TicketOpen />
          <ArtForestBanner />
          <GenreRecommendations />
        </div>
      </main>
    </div>
  )
}

export default MainPage
