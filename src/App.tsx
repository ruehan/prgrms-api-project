import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import MainPage from './components/MainPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SubPage from './components/SubPage'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/sub" element={<SubPage />}></Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
