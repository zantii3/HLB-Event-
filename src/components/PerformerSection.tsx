import { useRef, useState } from 'react'

type Performer = {
  image: string
  imageAlt: string
  name: string
  members?: { image: string; imageAlt: string }[]
  audioFiles: string[]
  audioFileNames: string[]
  trackTitles?: string[]
}

type PerformerSectionProps = {
  performers: Performer[]
}

function PerformerSection({ performers }: PerformerSectionProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const loadedTrackKeyRef = useRef<string | null>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null)
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAudioError, setHasAudioError] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<Performer | null>(null)
  const [flippedMembers, setFlippedMembers] = useState<Set<number>>(() => new Set())

  const tracks = selectedPerformer
    ? [1, 2, 3].map((number) => ({
        number,
      title:
        selectedPerformer.trackTitles?.[number - 1] ??
        `Track ${String(number).padStart(2, '0')}`,
      audioSrc: selectedPerformer.audioFiles[number - 1],
      audioFileName: selectedPerformer.audioFileNames[number - 1],
    }))
    : []
  const activeTrack = tracks[selectedTrack]

  const openPicker = (performer: Performer) => {
    audioRef.current?.pause()
    setSelectedMembers(null)
    setFlippedMembers(new Set())
    setSelectedPerformer(performer)
    setSelectedTrack(0)
    setHasAudioError(false)
    setIsPickerOpen(true)
  }

  const closePicker = () => {
    audioRef.current?.pause()
    setIsPickerOpen(false)
  }

  const openMembers = (performer: Performer) => {
    audioRef.current?.pause()
    setIsPickerOpen(false)
    setIsPlaying(false)
    setFlippedMembers(new Set())
    setSelectedMembers(performer)
  }

  const closeMembers = () => {
    setSelectedMembers(null)
    setFlippedMembers(new Set())
  }

  const toggleMemberCard = (index: number) => {
    setFlippedMembers((current) => {
      const next = new Set(current)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const playTrack = (performer: Performer, track: (typeof tracks)[number]) => {
    const audio = audioRef.current
    if (!audio) return

    const trackKey = `${performer.name}:${track.audioSrc}`
    if (loadedTrackKeyRef.current !== trackKey) {
      audio.src = track.audioSrc
      audio.load()
      loadedTrackKeyRef.current = trackKey
    }

    setHasAudioError(false)
    void audio.play().catch(() => setHasAudioError(true))
  }

  const selectRecord = (trackIndex: number) => {
    const audio = audioRef.current
    const track = tracks[trackIndex]
    if (!audio || !track || !selectedPerformer) return

    if (selectedTrack === trackIndex) {
      if (audio.paused) {
        playTrack(selectedPerformer, track)
      } else {
        audio.pause()
      }
      return
    }

    setSelectedTrack(trackIndex)
    playTrack(selectedPerformer, track)
  }

  const moveCarousel = (direction: -1 | 1) => {
    audioRef.current?.pause()
    setSelectedTrack((current) => (current + direction + tracks.length) % tracks.length)
  }

  const showTrack = (trackIndex: number) => {
    audioRef.current?.pause()
    setSelectedTrack(trackIndex)
    setHasAudioError(false)
  }

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio || !activeTrack || !selectedPerformer) return

    if (audio.paused) {
      playTrack(selectedPerformer, activeTrack)
    } else {
      audio.pause()
    }
  }

  return (
    <div className="performer-showcase">
      <div className="performer-grid">
        {performers.map((performer, index) => (
          <article className="performer-card" key={performer.name}>
            <div className="performer-image-frame">
              <img alt={performer.imageAlt} className="performer-image" loading="lazy" src={performer.image} />
              <span className="performer-edition">GROUP {index + 1}</span>
            </div>
            <div className="performer-card-content">
              <p className="eyebrow">The seventies sound</p>
              <h3>{performer.name}</h3>
              <div className="performer-card-actions">
                <button
                  aria-controls="performer-record-picker"
                  aria-expanded={isPickerOpen && selectedPerformer?.name === performer.name}
                  className="performer-play-button"
                  onClick={() => openPicker(performer)}
                  type="button"
                >
                  <span aria-hidden="true" className="performer-button-icon">♫</span>
                  Listen
                </button>
                {performer.members && performer.members.length > 0 && (
                  <button
                    aria-controls="performer-members"
                    aria-expanded={selectedMembers?.name === performer.name}
                    className="performer-view-button"
                    onClick={() => openMembers(performer)}
                    type="button"
                  >
                    <svg aria-hidden="true" className="performer-view-icon" viewBox="0 0 24 24">
                      <path d="M12 5c-5.2 0-9.4 4.1-10.5 7 1.1 2.9 5.3 7 10.5 7s9.4-4.1 10.5-7C21.4 9.1 17.2 5 12 5Zm0 11.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                    View performers
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedMembers && (
        <section
          aria-label={`${selectedMembers.name} performers`}
          className="performer-members"
          id="performer-members"
        >
          <div className="performer-members-heading">
            <div>
              <p className="eyebrow">
                Group {performers.findIndex((performer) => performer.name === selectedMembers.name) + 1}
              </p>
              <h3>Meet the <em>performers.</em></h3>
              <p>Flip each photo to meet all five members.</p>
            </div>
            <button className="performer-picker-close" onClick={closeMembers} type="button">
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="performer-members-grid">
            {selectedMembers.members?.map((member, index) => {
              const isFlipped = flippedMembers.has(index)
              return (
                <button
                  aria-label={`${isFlipped ? 'Show' : 'Flip to see'} performer ${index + 1}`}
                  aria-pressed={isFlipped}
                  className={`performer-member-card${isFlipped ? ' is-flipped' : ''}`}
                  key={member.image}
                  onClick={() => toggleMemberCard(index)}
                  type="button"
                >
                  <span className="performer-member-card-inner">
                    <span className="performer-member-face performer-member-front">
                      <span className="performer-member-number">0{index + 1}</span>
                      <span>Member {index + 1}</span>
                      <span className="performer-member-hint">Flip to reveal</span>
                    </span>
                    <span className="performer-member-face performer-member-back">
                      <img alt={member.imageAlt} loading="lazy" src={member.image} />
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <section
        aria-label={`${selectedPerformer?.name ?? 'Performer'} record carousel`}
        className={`performer-record-picker${isPickerOpen ? ' is-open' : ''}`}
        id="performer-record-picker"
        hidden={!isPickerOpen}
      >
        <div className="performer-picker-heading">
          <div>
            <p className="eyebrow">The listening room</p>
            <h3>{selectedPerformer?.name} <em>records.</em></h3>
            <p className="performer-picker-hint">Choose from 3 tracks in the carousel.</p>
          </div>
          <button
            aria-label="Close record selector"
            className="performer-picker-close"
            onClick={closePicker}
            type="button"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        {selectedPerformer && (
          <>
            <div className="performer-carousel">
              <button
                aria-label="Previous record"
                className="performer-carousel-arrow"
                onClick={() => moveCarousel(-1)}
                type="button"
              >
                <span aria-hidden="true">←</span>
              </button>
              <div aria-live="polite" className="performer-carousel-window">
                <div
                  className="performer-carousel-track"
                  style={{ transform: `translateX(-${selectedTrack * 100}%)` }}
                >
                  {tracks.map((track, index) => {
                    const isSelected = selectedTrack === index
                    return (
                      <button
                        aria-label={`${isSelected && isPlaying ? 'Pause' : 'Play'} ${selectedPerformer.name}, ${track.title}`}
                        aria-pressed={isSelected && isPlaying}
                        className={`performer-record-slide${isSelected ? ' is-selected' : ''}${isSelected && isPlaying ? ' is-playing' : ''}`}
                        key={track.number}
                        onClick={() => selectRecord(index)}
                        type="button"
                      >
                        <span aria-hidden="true" className="performer-record">
                          <span className="performer-record-label">{selectedPerformer.name}</span>
                          <span className="performer-record-hole" />
                        </span>
                        <span className="performer-record-name">{track.title}</span>
                        <span className="performer-record-action">
                          {isSelected && isPlaying ? 'Now playing' : 'Tap to play'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <button
                aria-label="Next record"
                className="performer-carousel-arrow"
                onClick={() => moveCarousel(1)}
                type="button"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
            <div aria-label="Choose a record" className="performer-carousel-dots">
              {tracks.map((track, index) => (
                <button
                  aria-label={`Show ${track.title}`}
                  aria-current={selectedTrack === index ? 'true' : undefined}
                  className={`performer-carousel-dot${selectedTrack === index ? ' is-active' : ''}`}
                  key={track.number}
                  onClick={() => showTrack(index)}
                  type="button"
                />
              ))}
            </div>
          </>
        )}
        {selectedPerformer && activeTrack && (
          <div className="performer-now-playing" aria-live="polite">
            <span className={`performer-now-playing-indicator${isPlaying ? ' is-playing' : ''}`} aria-hidden="true" />
            <span>
              {hasAudioError
                ? `Could not load ${activeTrack.audioFileName}.`
                : isPlaying
                  ? `Now playing ${selectedPerformer.name} · ${activeTrack.title}`
                  : `Selected: ${selectedPerformer.name} · ${activeTrack.title}`}
            </span>
            {!hasAudioError && (
              <button className="performer-toggle-playback" onClick={togglePlayback} type="button">
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            )}
          </div>
        )}
        <audio
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false)
            setHasAudioError(true)
          }}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          preload="none"
          ref={audioRef}
        />
      </section>
    </div>
  )
}

export default PerformerSection
