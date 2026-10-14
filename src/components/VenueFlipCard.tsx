import { useRef, useState } from 'react'

type VenueFlipCardProps = {
  image: string
  imageAlt: string
  title: string
  note: string
}

function VenueFlipCard({ image, imageAlt, title, note }: VenueFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const lightboxRef = useRef<HTMLDialogElement>(null)

  return (
    <div className="venue-flip-card-wrap">
      <button
        aria-label={isFlipped ? `Show ${title} image` : `Show notes about ${title}`}
        aria-pressed={isFlipped}
        className={`venue-flip-card${isFlipped ? ' is-flipped' : ''}`}
        onClick={() => setIsFlipped((flipped) => !flipped)}
        type="button"
      >
        <span className="venue-flip-inner">
          <span aria-hidden={isFlipped} className="venue-flip-face venue-flip-front">
            <img alt={imageAlt} loading="lazy" src={image} />
            <span className="venue-flip-hint">Flip for details <span aria-hidden="true">↻</span></span>
          </span>
          <span aria-hidden={!isFlipped} className="venue-flip-face venue-flip-back">
            <span className="venue-flip-back-kicker">{title}</span>
            <span className="venue-flip-note">{note}</span>
            <span className="venue-flip-back-hint">Tap to return <span aria-hidden="true">↻</span></span>
          </span>
        </span>
      </button>
      <button
        aria-label={`View ${title} image full size`}
        className="venue-image-zoom"
        onClick={() => lightboxRef.current?.showModal()}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </button>
      <dialog aria-label={`${title} full-size image`} className="venue-image-lightbox" ref={lightboxRef}>
        <div className="venue-image-lightbox-content">
          <button
            aria-label="Close full-size image"
            className="venue-image-lightbox-close"
            onClick={() => lightboxRef.current?.close()}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
          <img alt={imageAlt} src={image} />
          <p>{title}</p>
        </div>
      </dialog>
    </div>
  )
}

export default VenueFlipCard