import Link from 'next/link'

const CARDS = [
  {
    gender: 'womens',
    label: "Women's",
    sub: 'Curated for the modern woman',
    href: '/collections?gender=womens',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    gradient: 'from-rose-900/70',
  },
  {
    gender: 'mens',
    label: "Men's",
    sub: 'Refined essentials for him',
    href: '/collections?gender=mens',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    gradient: 'from-stone-900/70',
  },
  {
    gender: 'kids',
    label: "Kids'",
    sub: 'Playful & comfortable',
    href: '/collections?gender=kids',
    image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&q=80',
    gradient: 'from-sage-900/60',
  },
]

export default function GenderSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-rose-400 uppercase mb-2">Browse By</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold italic text-stone-800">
          Shop by Category
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map(card => (
          <Link key={card.gender} href={card.href}
            className="group relative overflow-hidden rounded-4xl aspect-[3/4] md:aspect-[2/3] block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${card.image}')` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} via-transparent to-transparent`} />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <p className="text-cream-200/70 text-xs font-medium tracking-[0.2em] uppercase mb-2">{card.sub}</p>
              <h3 className="font-display text-4xl font-bold italic text-cream-100 mb-5">{card.label}</h3>
              <span className="inline-flex items-center bg-white/90 text-stone-800 text-xs font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full group-hover:bg-white transition-colors">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
