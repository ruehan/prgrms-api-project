import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../types'

const SubPage: React.FC = () => {
  const greeting = useSelector((state: RootState) => state.greeting.message)

  return (
    <div>
      <h1>{greeting + ' 서브 페이지 입니다.'}</h1>
    </div>
  )
}

export default SubPage
