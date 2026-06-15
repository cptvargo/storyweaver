import { useEffect, useState } from 'react'

export default function RememberToast({ message, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 50)
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 2600)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [onDone])

  return (
    <div className={`remember-toast${visible ? ' remember-toast--visible' : ''}`}>
      <span className="remember-toast__dot" />
      <span className="remember-toast__text">{message} will remember this.</span>
    </div>
  )
}
