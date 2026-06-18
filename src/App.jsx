import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import Home from './pages/Home'
import StorySetup from './pages/StorySetup'
import Library from './pages/Library'
import Reader from './pages/Reader'
import './App.css'

export default function App() {
  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() { updateServiceWorker(true) },
  })

  // iOS PWA: resumed apps don't trigger SW update checks automatically.
  // Force a check every time the page becomes visible so stale content clears.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => reg.update())
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

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
