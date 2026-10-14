import { useState } from 'react'

type StyleChoice = 'men' | 'women'

const outfitIdeas: Record<StyleChoice, { title: string; description: string; pieces: string[] }> = {
  men: {
    title: 'The smooth-groove look',
    description:
      'Go sharp with a little retro flair. Think relaxed tailoring, rich textures, and a collar that knows how to make an entrance.',
    pieces: [
      'A wide-collar button-down or a patterned knit shirt',
      'Flared or straight-leg trousers in corduroy, denim, or a warm neutral',
      'A leather belt, vintage-inspired jacket, or subtle gold accessories',
      'Loafers, Chelsea boots, or clean dress shoes',
    ],
  },
  women: {
    title: 'The disco-night look',
    description:
      'Bring the movement and shine. Mix a statement silhouette with playful 70s details for a look that feels made for the dance floor.',
    pieces: [
      'A flowing maxi dress, jumpsuit, or blouse with flared trousers',
      'Velvet, satin, fringe, or a bold retro print',
      'Gold hoops, layered necklaces, or a wide statement belt',
      'Platform heels, heeled boots, or dressy flats you can dance in',
    ],
  },
}

function DressCode() {
  const [selectedStyle, setSelectedStyle] = useState<StyleChoice | null>(null)
  const selectedOutfit = selectedStyle ? outfitIdeas[selectedStyle] : null

  return (
    <section className="space-y-10">
      <header
        className="relative overflow-hidden rounded-3xl bg-[var(--dark-brown)] px-7 py-10 text-[var(--cream)] sm:px-12 sm:py-14"
        style={{
          backgroundImage:
            'radial-gradient(circle at 92% 8%, rgba(232,176,74,.34), transparent 28%), radial-gradient(circle at 5% 100%, rgba(204,90,52,.28), transparent 35%)',
        }}
      >
        <p className="mb-3 font-[var(--font-ui)] text-xs font-bold uppercase tracking-[0.24em] text-[var(--mustard)]">
          A night in the 70s
        </p>
        <h1 className="max-w-2xl font-[var(--font-heading)] text-4xl leading-tight sm:text-5xl">
          Dress to <span className="text-[var(--mustard)]">groove.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--cream)]/80 sm:text-base">
          Pick a style guide for outfit inspiration, then bring your own
          personality to the dance floor.
        </p>
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-9 rotate-12 font-[var(--font-heading)] text-[9rem] leading-none text-[var(--cream)]/10 sm:right-8 sm:top-0 sm:text-[12rem]"
        >
          70s
        </span>
      </header>

      <div>
        <div className="mb-5">
          <p className="font-[var(--font-ui)] text-xs font-bold uppercase tracking-[0.2em] text-[var(--burnt-orange)]">
            Find your look
          </p>
          <h2 className="mt-2 font-[var(--font-heading)] text-2xl text-[var(--dark-brown)] sm:text-3xl">
            Which style are you dressing for?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {(['men', 'women'] as const).map((style) => {
            const isSelected = selectedStyle === style
            const label = style === 'men' ? "Men's style" : "Women's style"
            const tagline = style === 'men' ? 'Sharp, relaxed, unmistakably retro' : 'Flowy, playful, ready to shine'

            return (
              <button
                aria-pressed={isSelected}
                className={`group flex min-h-36 items-center justify-between gap-5 rounded-2xl border-2 p-6 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--burnt-orange)] ${
                  isSelected
                    ? 'border-[var(--burnt-orange)] bg-white shadow-md'
                    : 'border-[var(--sand)] bg-white/60 hover:border-[var(--burnt-orange)]'
                }`}
                key={style}
                onClick={() => setSelectedStyle(style)}
                type="button"
              >
                <span>
                  <span className="block font-[var(--font-heading)] text-2xl text-[var(--dark-brown)]">
                    {label}
                  </span>
                  <span className="mt-2 block text-sm text-[var(--dark-brown)]/70">{tagline}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full font-[var(--font-heading)] text-2xl transition ${
                    isSelected
                      ? 'bg-[var(--burnt-orange)] text-white'
                      : 'bg-[var(--mustard)]/30 text-[var(--burnt-orange)] group-hover:bg-[var(--mustard)]/60'
                  }`}
                >
                  {isSelected ? '✓' : '↗'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {selectedOutfit ? (
        <section
          aria-live="polite"
          aria-labelledby="outfit-title"
          className="rounded-3xl border border-[var(--sand)] bg-white/70 p-6 sm:p-9"
        >
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-[var(--font-ui)] text-xs font-bold uppercase tracking-[0.2em] text-[var(--burnt-orange)]">
                {selectedStyle === 'men' ? "Men's inspiration" : "Women's inspiration"}
              </p>
              <h2
                className="mt-2 font-[var(--font-heading)] text-2xl text-[var(--dark-brown)] sm:text-3xl"
                id="outfit-title"
              >
                {selectedOutfit.title}
              </h2>
            </div>
            <span className="rounded-full bg-[var(--mustard)]/30 px-4 py-2 font-[var(--font-ui)] text-xs font-bold uppercase tracking-wider text-[var(--dark-brown)]">
              70s inspired
            </span>
          </div>

          <p className="mb-6 max-w-2xl text-sm leading-7 text-[var(--dark-brown)]/80">
            {selectedOutfit.description}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {selectedOutfit.pieces.map((piece, index) => (
              <li
                className="flex gap-3 rounded-xl bg-[var(--cream)]/80 p-4 text-sm leading-6 text-[var(--dark-brown)]"
                key={piece}
              >
                <span
                  aria-hidden="true"
                  className="font-[var(--font-heading)] text-[var(--burnt-orange)]"
                >
                  0{index + 1}
                </span>
                {piece}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-[var(--sand)] pt-5 text-xs leading-6 text-[var(--dark-brown)]/65">
            No need to dress head-to-toe vintage—pick a piece or two, wear what
            feels like you, and choose shoes you can dance in.
          </p>
        </section>
      ) : (
        <p className="text-center text-sm text-[var(--dark-brown)]/65">
          Choose a style above to see outfit ideas.
        </p>
      )}
    </section>
  )
}

export default DressCode
