import { useState } from 'react'
import logo from '../assets/images/logo2.png'

const links = [
  { label: 'The event', to: '#event' },
  { label: 'Dress', to: '#dress-code' },
  { label: 'Venue', to: '#venue' },
  { label: 'Hosts', to: '#hosts' },
  { label: 'Lineup', to: '#performers' },
  { label: 'Media', to: '#media' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <nav aria-label="Main navigation" className="site-nav">
        <a aria-label="HLB Event home" className="site-brand" href="#top" onClick={() => setMenuOpen(false)}>
          <img alt="HLB Mann Judd" src={logo} />
        </a>
        <button
          aria-controls="site-navigation-links"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={`site-menu-toggle${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`site-nav-links${menuOpen ? ' is-open' : ''}`} id="site-navigation-links">
          {links.map(({ label, to }) => (
            <a key={to} href={to} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar