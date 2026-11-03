import { useEffect, useRef, useState } from 'react'
import Countdown from '../components/Countdown'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import PerformerSection from '../components/PerformerSection'
import abbaImage from '../assets/images/abba.jpg'
import abbaTrack from '../assets/videos/ABBA.mp4'
import abbaGimmeTrack from '../assets/videos/Gimme.mp4'
import abbaMammaTrack from '../assets/videos/Mamma.mp4'
import vstMagsayawanTrack from '../assets/videos/Magsayawan.mp4'
import vstRockTrack from '../assets/videos/Rock.mp4'
import vstAwitinTrack from '../assets/videos/Awitin.mp4'
import hotdogBonggaTrack from '../assets/videos/Bongga.mp4'
import hotdogManilaTrack from '../assets/videos/Manila.mp4'
import hotdogAnnieTrack from '../assets/videos/Annie.mp4'
import discoBallImage from '../assets/images/ball 2.png'
import booksImage from '../assets/images/books.png'
import cassetteImage from '../assets/images/caset.png'
import floorplanImage from '../assets/images/floorplan.png'
import hotdogImage from '../assets/images/hotdog.jpg'
import menImage from '../assets/images/men.png'
import venueImage from '../assets/images/thefav.png'
import vinylImage from '../assets/images/vinyl.png'
import vstImage from '../assets/images/vst.jpg'
import womenImage from '../assets/images/women.png'
import VenueFlipCard from '../components/VenueFlipCard'
import teaserVideo from '../assets/videos/teaser.mp4'
import homeImage from '../assets/images/home2.jpg'

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
            src={homeImage}
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
          <div className="venue-extras" data-scroll-reveal>
            <div className="venue-gallery">
              <div className="venue-extra-heading">
                <p className="eyebrow">A little preview</p>
                <h2>Event <em>Place</em></h2>
                <p className="venue-flip-instruction">Flip a card for details.</p>
              </div>
              <div className="venue-gallery-images">
                <VenueFlipCard
                  image={venueImage}
                  imageAlt="The Vermillion Events"
                  imageFit="cover"
                  title="The Vermillion Events"
                  note="Vermillion Events creates memorable experiences through thoughtfully planned events, bringing people together through creativity, entertainment, and celebration."
                />
                <VenueFlipCard
                  image={floorplanImage}
                  imageAlt="Floor plan showing Grand Hall 1, Grand Hall 2, the pre-function hall, board room, and parking"
                  title="Floor plan"
                  note="Grand Hall 1 is at the lower-left of the plan. The pre-function hall is just above it, with parking shown on the right."
                />
              </div>
            </div>
            <div className="venue-map-section">
              <div className="venue-extra-heading">
                <p className="eyebrow">Map preview</p>
                <h2>Find your <em>way.</em></h2>
              </div>
              <iframe
                aria-label="Google Maps preview of M1 Tower in Makati; event details to be announced"
                className="venue-map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7723.436890338446!2d121.0168886917272!3d14.55808679369286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c908771a70a1%3A0x46d538a8d449a64b!2sM1%20Tower!5e0!3m2!1sen!2sph!4v1791389186944!5m2!1sen!2sph"
                title="M1 Tower map preview"
              />
              <dl className="venue-map-details">
                <div>
                  <dt>Address</dt>
                  <dd>M1 Tower, Dela Costa St. Salcedo Village Makati City</dd>
                </div>
                <div>
                  <dt>Parking information</dt>
                  <dd>8th Floor Parking</dd>
                </div>
                <div>
                  <dt>ETA from Emapta</dt>
                  <dd>15–20 mins walk, 10 mins ride</dd>
                </div>
              </dl>
              <a
                className="venue-directions-link"
                href="https://www.google.com/maps/dir/?api=1&destination=M1+Tower%2C+Makati+City%2C+Philippines"
                rel="noreferrer"
                target="_blank"
              >
                Get Directions <span aria-hidden="true">↗</span>
              </a>
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
            <p>Meet the artists bringing the seventies sound to the dance floor. Tap a record to listen.</p>
          </div>
          <div data-scroll-reveal>
            <PerformerSection performers={[
              {
                audioFiles: [abbaTrack, abbaGimmeTrack, abbaMammaTrack, '/music/abba-3.mp4'],
                audioFileNames: ['ABBA.mp4', 'Gimme.mp4', 'Mamma.mp4', 'abba-3.mp4'],
                image: abbaImage,
                imageAlt: 'ABBA',
                name: 'ABBA',
                trackTitles: ['Dancing Queen', 'Gimme! Gimme! Gimme!', 'Mamma Mia'],
              },
              {
                audioFiles: [vstMagsayawanTrack, vstRockTrack, vstAwitinTrack, '/music/vst-3.mp4'],
                audioFileNames: ['Magsayawan.mp4', 'Rock.mp4', 'Awitin.mp4', 'vst-3.mp4'],
                image: vstImage,
                imageAlt: 'VST',
                name: 'VST',
                trackTitles: ['Magsayawan', 'Rock Baby Rock', 'Awitin Mo at Isasayaw Ko'],
              },
              {
                audioFiles: [hotdogBonggaTrack, hotdogManilaTrack, hotdogAnnieTrack, '/music/hotdog-3.mp4'],
                audioFileNames: ['Bongga.mp4', 'Manila.mp4', 'Annie.mp4', 'hotdog-3.mp4'],
                image: hotdogImage,
                imageAlt: 'Hotdog',
                name: 'Hotdog',
                trackTitles: ['Bongga Ka Day', 'Manila', 'Annie Batungbakal'],
              },
            ]} />
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