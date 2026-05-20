import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StorySetup from './pages/StorySetup'
import Library from './pages/Library'
import Reader from './pages/Reader'
import './App.css'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<StorySetup />} />
        <Route path="/library" element={<Library />} />
        <Route path="/reader" element={<Reader />} />
      </Routes>
    </BrowserRouter>
  )
}
