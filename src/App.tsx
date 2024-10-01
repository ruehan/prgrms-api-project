import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import MainPage from './components/mainpage/page'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SearchPage from './components/search/page'
import { QueryClient, QueryClientProvider } from 'react-query'
import MenuBar from './components/global/menubar'
import 'leaflet/dist/leaflet.css'
import NearbyPerformanceFacilities from './components/nearby/page'
import RecommendedShows from './components/recommend/page'
import { AuthProvider } from './components/recommend/AuthContext'
import PerformanceDetailPage from './components/info/page'

const App: React.FC = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Provider store={store}>
          <Router>
            <MenuBar />
            <Routes>
              <Route path="/" element={<MainPage />}></Route>
              <Route path="/search" element={<SearchPage />}></Route>
              <Route path="/nearby" element={<NearbyPerformanceFacilities />}></Route>
              <Route path="/recommend" element={<RecommendedShows />}></Route>
              <Route path="/performance/:mt20id" element={<PerformanceDetailPage />}></Route>
            </Routes>
          </Router>
        </Provider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
