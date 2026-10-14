import { useEffect, useRef, useState } from 'react'
import Countdown from '../components/Countdown'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import discoBallImage from '../assets/images/ball 2.png'
import booksImage from '../assets/images/books.png'
import cassetteImage from '../assets/images/caset.png'
import menImage from '../assets/images/men.png'
import vinylImage from '../assets/images/vinyl.png'
import womenImage from '../assets/images/women.png'
import teaserVideo from '../assets/videos/teaser.mp4'

const eventDate = new Date('2026-12-04T18:00:00+08:00')
type DressStyle = 'men' | 'women'
type TvMode = 'off' | 'static' | 'playing' | 'paused' | 'error'

const menOutfitImages = Object.entries(
  import.meta.glob<string>('../assets/images/LM*.png', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
).sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))

const womenOutfitImages = Object.entries(
  import.meta.glob<string>('../assets/images/LW*.png', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
).sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))

function Home() {
  const [dressStyle, setDressStyle] = useState<DressStyle | null>(null)
  const [tvMode, setTvMode] = useState<TvMode>('off')
  const [isLoading, setIsLoading] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const tvVideoRef = useRef<HTMLVideoElement>(null)
  const isTuningRef = useRef(false)
  const dressSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = window.setTimeout(() => setIsLoading(false), 850)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const section = dressSectionRef.current
    if (!section || !window.matchMedia('(pointer: fine)').matches) return

    const updateSpotlight = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect()
      section.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`)
      section.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`)
    }
    const resetSpotlight = () => {
      section.style.removeProperty('--spotlight-x')
      section.style.removeProperty('--spotlight-y')
    }

    section.addEventListener('pointermove', updateSpotlight)
    section.addEventListener('pointerleave', resetSpotlight)
    return () => {
      section.removeEventListener('pointermove', updateSpotlight)
      section.removeEventListener('pointerleave', resetSpotlight)
    }
  }, [])

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('[data-scroll-reveal]')
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-revealed'))
      return
    }

    document.documentElement.classList.add('supports-scroll-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('supports-scroll-reveal')
    }
  }, [])

  useEffect(() => {
    if (tvMode !== 'static') return

    const timer = window.setTimeout(() => {
      const video = tvVideoRef.current
      isTuningRef.current = false
      if (video) {
        video.currentTime = 0
        video.muted = false
      }
      setTvMode('playing')
    }, 1600)
    return () => window.clearTimeout(timer)
  }, [tvMode])

  const handleTvButtonClick = () => {
    if (tvMode === 'static') return

    const video = tvVideoRef.current
    if (!video) return

    if (tvMode === 'off' || tvMode === 'error') {
      video.currentTime = 0
      video.muted = true
      isTuningRef.current = true
      setTvMode('static')
      void video.play().catch(() => {
        isTuningRef.current = false
        setTvMode('error')
      })
      return
    }

    if (video.paused) {
      void video.play()
        .then(() => setTvMode('playing'))
        .catch(() => setTvMode('error'))
      return
    }

    video.pause()
    setTvMode('paused')
  }

  return (
    <div className="event-site">
      {isLoading && (
        <div aria-live="polite" className="vinyl-loader" role="status">
          <span aria-hidden="true" className="loading-record">
            <span />
          </span>
          <span>Warming up the classics...</span>
        </div>
      )}
      <Navbar />
      <main>
        <section aria-labelledby="hero-title" className="event-hero" id="top">
          <img
            alt="A crowd gathered beneath the lights at a live music event"
            className="event-hero-image"
            fetchPriority="high"
            src="src/assets/images/home2.jpg"
          />
          <div aria-hidden="true" className="event-hero-shade" />
          <div className="event-hero-content">
            <p className="eyebrow hero-eyebrow">An HLB event</p>
            <h1 id="hero-title">
              A Night in the 70s:<span className="hero-title">Groovin' All Night!</span>
            </h1>
            <div className="hero-countdown-wrap">
              <p className="countdown-intro">Counting down to the big night · Manila time</p>
              <Countdown targetDate={eventDate.toISOString()} />
            </div>
            <a className="hero-link" href="#event">Explore the event <span aria-hidden="true">↘</span></a>
          </div>
          <p className="hero-caption">A night worth remembering · HLB Event</p>
        </section>

        <section aria-labelledby="event-title" className="event-overview page-section" id="event">
          <div className="section-kicker"><span>01</span><span>The gathering</span></div>
          <div className="event-tv-wrap" data-scroll-reveal>
            <div className="event-tv-heading">
              <p className="eyebrow">A little something from the archives</p>
              <h3>Turn on the <em>oldies.</em></h3>
              <p>Press the button to play and pause.</p>
            </div>
            <div className="event-tv">
              <div className="event-tv-set">
                <div
                  aria-label="Retro TV screen"
                  aria-live="polite"
                  className={`event-tv-screen is-${tvMode}`}
                >
                  <video
                    className="event-tv-video"
                    controls={tvMode === 'playing' || tvMode === 'paused'}
                    onError={() => {
                      isTuningRef.current = false
                      setTvMode('error')
                    }}
                    onPause={() => {
                      if (!isTuningRef.current) setTvMode('paused')
                    }}
                    onPlay={() => {
                      if (!isTuningRef.current) setTvMode('playing')
                    }}
                    playsInline
                    preload="metadata"
                    ref={tvVideoRef}
                    src={teaserVideo}
                  >
                    Your browser does not support embedded videos.
                  </video>
                  {tvMode === 'off' && (
                    <div className="event-tv-message">
                      <span>HLB BROADCAST</span>
                      <strong>Stand by</strong>
                    </div>
                  )}
                  {tvMode === 'static' && (
                    <div aria-label="Tuning signal static" className="event-tv-static">
                      <span>TUNING IN...</span>
                    </div>
                  )}
                  {tvMode === 'error' && (
                    <div className="event-tv-message event-tv-error" role="status">
                      <strong>Broadcast unavailable</strong>
                      <span>Could not play the teaser video. Press Try again.</span>
                    </div>
                  )}
                  <div aria-hidden="true" className="event-tv-scanlines" />
                </div>
                <div className="event-tv-controls">
                  <span className="event-tv-brand">HLB</span>
                  <span aria-hidden="true" className="event-tv-knob" />
                  <span aria-hidden="true" className="event-tv-knob event-tv-knob-small" />
                  <span aria-hidden="true" className="event-tv-speaker" />
                  <button
                    className="event-tv-button"
                    disabled={tvMode === 'static'}
                    onClick={handleTvButtonClick}
                    type="button"
                  >
                    {tvMode === 'static'
                      ? 'Tuning...'
                      : tvMode === 'playing'
                        ? 'Pause video'
                        : tvMode === 'paused'
                          ? 'Play video'
                          : tvMode === 'error'
                            ? 'Try again'
                            : 'Power / play'}
                  </button>
                </div>
              </div>
              <div aria-hidden="true" className="event-tv-feet">
                <span />
                <span />
              </div>
            </div>
            <p className="event-tv-caption">Your video will play after a moment of classic TV static.</p>
          </div>
        </section>

        <section aria-labelledby="dress-title" className="dress-section page-section" ref={dressSectionRef}>
          <div aria-hidden="true" className="dress-spotlight" />
          <div className="dress-content">
            <img alt="" aria-hidden="true" className="dress-disco-ball" src={discoBallImage} />
            <div className="section-kicker" id="dress-code"><span>02</span><span>Come as you are</span></div>
            <p className="eyebrow">The dress code</p>
            <h2 id="dress-title">Choose<br />your <em>outfit.</em></h2>
            <p>A little 70s-inspired outfit guidance.</p>
            <div aria-label="Choose a dress style" className="dress-choices" data-scroll-reveal>
              {(['men', 'women'] as const).map((style) => (
                <button
                  aria-pressed={dressStyle === style}
                  className={`dress-choice${dressStyle === style ? ' is-selected' : ''}`}
                  key={style}
                  onClick={() => setDressStyle(style)}
                  type="button"
                >
                  <img
                    alt=""
                    aria-hidden="true"
                    className={`dress-choice-image dress-choice-image-${style}`}
                    src={style === 'men' ? menImage : womenImage}
                  />
                  <span className="dress-choice-label">
                    {style === 'men' ? 'Men' : 'Women'}
                  </span>
                  <span className="dress-choice-hint">Click to browse outfit ideas</span>
                  <span aria-hidden="true" className="dress-choice-icon">{dressStyle === style ? '✓' : '↗'}</span>
                </button>
              ))}
            </div>
            {dressStyle && (
              <div
                aria-label={`${dressStyle === 'men' ? "Men's" : "Women's"} outfit picture previews`}
                className="outfit-gallery"
                key={dressStyle}
              >
                <div className="outfit-gallery-heading">
                  <h3>{dressStyle === 'men' ? "Men's" : "Women's"} outfit ideas</h3>
                  <p>Style index / 10 looks</p>
                </div>
                <div className="outfit-gallery-grid">
                  {(dressStyle === 'men' ? menOutfitImages : womenOutfitImages).map(
                    ([path, image], index) => (
                    <figure className={`outfit-preview outfit-preview-${index + 1}`} key={path}>
                      <img
                        alt={`${dressStyle === 'men' ? "Men's" : "Women's"} outfit idea ${index + 1}`}
                        src={image}
                      />
                      <figcaption>
                        <span className="outfit-number">{String(index + 1).padStart(2, '0')}</span>
                        <span>Outfit {index + 1}</span>
                      </figcaption>
                    </figure>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
          <span aria-hidden="true" className="dress-mark">HLB</span>
        </section>

        <section aria-labelledby="venue-title" className="venue-section page-section" id="venue">
          <div className="section-kicker"><span>03</span><span>Find your way</span></div>
          <div className="venue-heading">
            <div>
              <p className="eyebrow">Location details</p>
              <h2 id="venue-title">The<em> Venue.</em></h2>
            </div>
          </div>
          <div className="details-coming-soon venue-broadcast" data-scroll-reveal>
            <div aria-label="The location is still under wraps" className="venue-broadcast-screen" role="img">
              <div aria-hidden="true" className="venue-broadcast-static" />
              <div aria-hidden="true" className="venue-signal-line"><span /></div>
              <strong>THE LOCATION IS STILL UNDER WRAPS.</strong>
            </div>
            <div className="venue-broadcast-footer">
              <span className="details-status"><span aria-hidden="true" className="venue-signal-indicator" />SIGNAL PENDING</span>
              <p>Tuning in... confirmed address and travel information will be announced soon.</p>
            </div>
          </div>
         
        </section>

        <section aria-labelledby="hosts-title" className="people-section page-section" data-scroll-reveal id="hosts">
          <div className="section-kicker"><span>04</span><span>The people</span></div>
          <div className="people-heading">
            <div><h2 id="hosts-title">Your<em> Hosts</em></h2></div>
            <p>Host details aren’t available yet. Check back for an announcement.</p>
          </div>
          <div aria-label="Host portraits" className="host-portrait-grid">
            {['HOST 01', 'HOST 02'].map((host) => (
              <article
                aria-label={`${host}: coming soon`}
                className="host-portrait-card"
                data-scroll-reveal
                key={host}
              >
                <div aria-hidden="true" className="host-portrait-frame">
                  <svg aria-hidden="true" className="host-silhouette" viewBox="0 0 180 220">
                    <circle cx="90" cy="70" r="36" />
                    <path d="M22 220c2-52 29-82 68-82s66 30 68 82H22Z" />
                    <path d="M54 63c3-33 21-48 40-48 21 0 34 18 34 43-11-5-19-15-23-25-10 16-28 26-51 30Z" />
                  </svg>
                  <span className="host-coming-soon">COMING SOON</span>
                  <span className="host-portrait-index">{host}</span>
                </div>
                <div className="host-portrait-caption">
                  <span>THE PEOPLE BEHIND THE MIC</span>
                  <strong>NAME TO BE ANNOUNCED</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="performers-title" className="lineup-section page-section" data-scroll-reveal id="performers">
          <div className="section-kicker"><span>05</span><span>On the bill</span></div>
          <div className="lineup-heading">
                     <h2 id="performers-title">The<em> Performers</em></h2>
            <p>Performer details aren’t available yet. Check back for an announcement.</p>
          </div>
          <div className="lineup-poster" data-scroll-reveal>
            <div className="lineup-poster-heading">
              <span>HLB PRESENTS · SIDE A / SIDE B</span>
              <strong>THE ARTISTS WILL BE REVEALED SOON.</strong>
            </div>
            <div className="lineup-feature-slot">
              <span className="lineup-slot-number">SIDE A — 01</span>
              <svg aria-hidden="true" className="lineup-microphone" viewBox="0 0 48 64">
                <path d="M24 5a9 9 0 0 0-9 9v15a9 9 0 0 0 18 0V14a9 9 0 0 0-9-9ZM8 27v3a16 16 0 0 0 32 0v-3M24 46v12m-9 0h18" />
              </svg>
              <span className="lineup-slot-label">ARTIST LINEUP COMING SOON</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="media-title" className="media-section page-section" data-scroll-reveal id="media">
          <div className="media-image-wrap">
            <div aria-label="Seventies music and listening collage" className="retro-image-collage">
              <figure>
                <img alt="A stack of classic rock records" loading="lazy" src={booksImage} />
                <figcaption>The records</figcaption>
              </figure>
              <figure>
                <img alt="A vintage cassette tape" loading="lazy" src={cassetteImage} />
                <figcaption>The mixtape</figcaption>
              </figure>
              <figure>
                <img alt="A glowing vinyl record sign" loading="lazy" src={vinylImage} />
                <figcaption>The groove</figcaption>
              </figure>
            </div>
            <div aria-hidden="true" className="media-light-sweep" />
            <div className="media-developing-label">
              <svg aria-hidden="true" viewBox="0 0 24 20">
                <path d="M3 6h4l2-3h6l2 3h4v11H3z" />
                <circle cx="12" cy="11.5" r="3.5" />
              </svg>
              <span>DEVELOPING...</span>
            </div>
            <div className="media-caption"><span>06 / A first look</span><span>More to come</span></div>
          </div>
          <div className="media-content">
            <div className="media-heading">
              <p className="eyebrow">Photos &amp; updates</p>
              <h2 id="media-title">The event<br /><em>in pictures.</em></h2>
            </div><br></br>
            <div className="details-coming-soon media-coming-soon">
              <span className="details-status">Not available yet</span>
              <h3>THE ARCHIVES ARE STILL DEVELOPING.</h3>
              <p>Photos and updates will be revealed as the big night gets closer.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="closing-title" className="closing-section">
          <p className="eyebrow">Save a little space</p>
          <h2 id="closing-title">See you on the<br /><em>dance floor!</em></h2>
        </section>
      </main>
      <Footer />
      <a aria-label="Back to top" className="back-to-top" href="#top">
        <svg aria-hidden="true" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="21" />
          <circle cx="24" cy="24" r="15" />
          <circle cx="24" cy="24" r="8" />
          <circle className="record-label" cx="24" cy="24" r="3" />
        </svg>
        <span aria-hidden="true">↑</span>
      </a>
    </div>
  )
}

export default Home