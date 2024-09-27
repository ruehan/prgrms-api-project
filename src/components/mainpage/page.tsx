import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../types'

const MainPage: React.FC = () => {
  const greeting = useSelector((state: RootState) => state.greeting.message)

  return (
    <div className="mt-[80px] w-full px-4 sm:px-6 md:mt-[120px] lg:mt-[162px] lg:px-8">
      <h1>{greeting + ' 메인 페이지 입니다.'}</h1>
    </div>
  )
}

export default MainPage
