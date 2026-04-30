// Wraps every page with consistent padding and max-width
export default function PageShell({ children, centered = false }) {
  return (
    <div className={`page-shell${centered ? ' page-shell--centered' : ''}`}>
      {children}
    </div>
  )
}
