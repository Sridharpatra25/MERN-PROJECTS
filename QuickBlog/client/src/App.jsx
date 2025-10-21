import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import NavBar from './components/NavBar'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path = "/" element={<Home />}/>
        <Route path = "/blog" element={<Blog />}/>
      </Routes>
      <NavBar></NavBar>
    </div>
  )
}

export default App