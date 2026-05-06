import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeIndianRupee,
  Boxes,
  BrainCircuit,
  ChevronRight,
  Cpu,
  GitBranch,
  Layers3,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'

const api = async (path) => {
  const response = await fetch(path)
  if (!response.ok) throw new Error('API request failed')
  return response.json()
}

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)

const dsaCards = [
  ['Trie', 'Autocomplete product names and intent tags in milliseconds.', Search],
  ['Hash Map', 'Lookup product details, categories, and metadata directly.', Boxes],
  ['Heap', 'Rank top-rated, cheapest, and most popular products.', TrendingUp],
  ['Graph', 'Traverse related products for recommendation paths.', GitBranch],
  ['Fenwick Tree', 'Count price buckets for fast range query analytics.', SlidersHorizontal]
]

function App() {
  const [products, setProducts] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [query, setQuery] = useState('sho')
  const [rankMode, setRankMode] = useState('rating')
  const [selectedId, setSelectedId] = useState('phone-nova')
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [range, setRange] = useState({ min: 500, max: 2000 })
  const [rangeResult, setRangeResult] = useState({ products: [], indexedCount: 0 })

  useEffect(() => {
    api('/api/products').then(setProducts)
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadSuggestions() {
      const nextSuggestions = query.trim()
        ? await api(`/api/search?q=${encodeURIComponent(query)}`)
        : []

      if (!ignore) setSuggestions(nextSuggestions)
    }

    loadSuggestions()
    return () => {
      ignore = true
    }
  }, [query])

  useEffect(() => {
    api(`/api/top?mode=${rankMode}&limit=5`).then(setTopProducts)
  }, [rankMode])

  useEffect(() => {
    api(`/api/recommendations/${selectedId}`).then(setRecommendations)
  }, [selectedId])

  useEffect(() => {
    api(`/api/range?min=${range.min}&max=${range.max}`).then(setRangeResult)
  }, [range])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSpotlightIndex((current) => current + 1)
    }, 3600)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const updateProgress = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(pageHeight > 0 ? window.scrollY / pageHeight : 0)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId]
  )

  const spotlightProduct = products.length
    ? products[spotlightIndex % products.length]
    : selectedProduct

  return (
    <main className="overflow-hidden bg-[#f5f5f7]">
      <div className="fixed left-0 top-0 z-50 h-1 bg-slate-950 transition-all duration-150" style={{ width: `${scrollProgress * 100}%` }} />

      <section className="relative min-h-screen px-5 py-5 sm:px-8 lg:px-12">
        <nav className="sticky top-4 z-40 mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-white/70 bg-white/65 px-4 py-3 shadow-sm backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white">
              <ShoppingBag size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">SmartCart DSA</p>
              <p className="text-xs text-slate-500">Search and recommendation engine</p>
            </div>
          </div>
          <a
            href="#system"
            className="hidden items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 sm:flex"
          >
            Explore engine <ArrowRight size={16} />
          </a>
        </nav>

        <div className="mx-auto max-w-7xl py-12 text-center lg:py-16">
          <div className="animate-rise">
            <div className="mx-auto mb-5 inline-flex animate-float items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-xl">
              <Sparkles size={16} /> Advanced DSA in a real commerce flow
            </div>
            <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[0.98] text-slate-950 sm:text-7xl lg:text-8xl">
              Smart E-Commerce Search and Recommendation System
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              A professional full-stack product discovery platform powered by Trie autocomplete,
              hash-map indexing, heap ranking, graph recommendations, and Fenwick price queries.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#system"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Launch demo <ChevronRight size={18} />
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/60 px-5 py-3 font-bold text-slate-800 backdrop-blur-xl transition hover:bg-white"
              >
                View DSA stack
              </a>
            </div>
          </div>

          <div className="animate-rise-delayed mt-12">
            {spotlightProduct && (
              <ProductStage
                product={spotlightProduct}
                selectedProduct={selectedProduct}
                suggestions={suggestions}
                query={query}
                onQueryChange={setQuery}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-white/70 bg-white/70 py-4 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="apple-marquee flex min-w-max items-center gap-4 px-4">
            {[...products, ...products].map((product, index) => (
              <button
                key={`${product.id}-${index}`}
                onClick={() => setSelectedId(product.id)}
                className="flex w-72 items-center gap-3 rounded-lg bg-slate-50 px-3 py-3 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                <img src={product.image} alt={product.name} className="size-16 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">{product.name}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{formatPrice(product.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="system" className="px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="reveal-panel">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Connected frontend and C++ backend</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Product intelligence console</h2>
            </div>
            <div className="rounded-lg border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl">
              {products.length} indexed products
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="reveal-panel rounded-lg border border-white/70 bg-white/72 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <h3 className="text-xl font-black text-slate-950">Heap-powered rankings</h3>
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {['rating', 'cheap', 'popular'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setRankMode(mode)}
                      className={`rounded-md px-3 py-2 text-sm font-bold capitalize transition ${
                        rankMode === mode ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {topProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={setSelectedId} />
                ))}
              </div>
            </section>

            <section className="reveal-panel rounded-lg border border-white/70 bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
              <h3 className="text-xl font-black">Graph recommendations</h3>
              {selectedProduct && (
                <div className="mt-4 overflow-hidden rounded-lg bg-white/10">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="h-44 w-full object-cover opacity-90" />
                  <div className="p-4">
                    <p className="text-sm text-slate-300">Selected product</p>
                    <p className="mt-1 text-xl font-black">{selectedProduct.name}</p>
                    <p className="mt-2 text-sm text-teal-200">{selectedProduct.category}</p>
                  </div>
                </div>
              )}
              <div className="mt-4 grid gap-3">
                {recommendations.slice(0, 4).map((product) => (
                  <ProductRow key={product.id} product={product} onSelect={setSelectedId} dark />
                ))}
              </div>
            </section>
          </div>

          <section className="reveal-panel mt-5 rounded-lg border border-white/70 bg-white/72 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <h3 className="text-xl font-black text-slate-950">Fenwick price range query</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Query products between {formatPrice(range.min)} and {formatPrice(range.max)} with indexed bucket counts.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <PriceInput label="Minimum" value={range.min} onChange={(min) => setRange((current) => ({ ...current, min }))} />
                  <PriceInput label="Maximum" value={range.max} onChange={(max) => setRange((current) => ({ ...current, max }))} />
                </div>
                <div className="mt-4 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white">
                  Fenwick bucket count: {rangeResult.indexedCount}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rangeResult.products.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={setSelectedId} compact />
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section id="architecture" className="px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-panel rounded-lg border border-white/70 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
            <div className="mb-6 flex items-center gap-3">
              <BrainCircuit className="text-teal-300" />
              <h2 className="text-3xl font-black">Advanced DSA architecture</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {dsaCards.map(([title, body, Icon]) => (
                <div key={title} className="rounded-lg border border-white/10 bg-white/8 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/12">
                  <Icon className="text-teal-300" size={24} />
                  <h3 className="mt-4 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function ProductStage({ product, selectedProduct, suggestions, query, onQueryChange, onSelect }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-[#111114] px-4 py-6 text-white shadow-2xl shadow-slate-950/30 sm:px-8 lg:px-10">
      <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
      <div className="grid items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-teal-200 ring-1 ring-white/10">
            <Cpu size={16} /> C++ powered search engine
          </div>
          <h2 className="mt-5 text-4xl font-black leading-none tracking-tight sm:text-5xl">
            Find it fast. Rank it smart. Recommend what fits.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            A live product surface where every interaction travels through advanced data structures.
          </p>

          <div className="mt-6 max-w-xl rounded-lg bg-white/8 p-3 ring-1 ring-white/10">
            <div className="flex items-center gap-3 rounded-lg bg-black/30 px-4 py-3">
              <Search size={20} className="text-teal-200" />
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-slate-500"
                placeholder="Search products"
              />
              <Zap size={18} className="text-amber-300" />
            </div>
            <div className="mt-3 grid gap-2">
              {suggestions.slice(0, 3).map((item) => (
                <ProductRow key={item.id} product={item} onSelect={onSelect} dark />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
            {['Trie', 'Heap', 'Graph', 'Fenwick', 'Hash Map'].map((label) => (
              <span key={label} className="rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/10">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[520px]">
          <div className="stage-glow absolute inset-x-10 bottom-6 h-24 rounded-[50%] bg-white/20 blur-2xl" />
          <img
            key={product.id}
            src={product.image}
            alt={product.name}
            className="product-hero absolute left-1/2 top-8 h-[420px] w-[78%] -translate-x-1/2 rounded-lg object-cover shadow-2xl shadow-black/50"
          />
          <div className="absolute bottom-6 left-4 right-4 rounded-lg bg-white/12 p-4 text-left backdrop-blur-2xl ring-1 ring-white/15 sm:left-10 sm:right-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">Spotlight product</p>
                <h3 className="mt-2 text-2xl font-black">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{product.description}</p>
              </div>
              <div className="shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-black text-slate-950">
                {formatPrice(product.price)}
              </div>
            </div>
            {selectedProduct && (
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-300">
                <Layers3 size={16} className="text-teal-200" />
                Graph focus: {selectedProduct.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, onSelect, compact = false }) {
  return (
    <button
      onClick={() => onSelect(product.id)}
      className="group overflow-hidden rounded-lg border border-white/70 bg-white/80 text-left shadow-sm transition duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-xl hover:shadow-slate-900/10"
    >
      <div className="overflow-hidden">
        <img src={product.image} alt={product.name} className={`w-full object-cover transition duration-700 group-hover:scale-105 ${compact ? 'h-28' : 'h-36'}`} />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{product.category}</p>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
            <Star size={15} fill="currentColor" /> {product.rating}
          </span>
        </div>
        <h4 className="mt-2 text-base font-black leading-tight text-slate-950">{product.name}</h4>
        <p className="mt-2 flex items-center gap-1 font-black text-slate-800">
          <BadgeIndianRupee size={17} /> {product.price.toLocaleString('en-IN')}
        </p>
      </div>
    </button>
  )
}

function ProductRow({ product, onSelect, dark = false }) {
  return (
    <button
      onClick={() => onSelect(product.id)}
      className={`flex items-center gap-3 rounded-lg p-3 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 ${
        dark
          ? 'bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15'
          : 'border border-white/70 bg-white/75 hover:bg-white'
      }`}
    >
      <img src={product.image} alt={product.name} className="size-14 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <p className={`truncate font-black ${dark ? 'text-white' : 'text-slate-950'}`}>{product.name}</p>
        <p className={`mt-1 text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{formatPrice(product.price)}</p>
      </div>
      <ShieldCheck size={18} className={dark ? 'text-teal-200' : 'text-teal-600'} />
    </button>
  )
}

function PriceInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-3 font-bold text-slate-900 outline-none ring-slate-950 transition focus:ring-2"
      />
    </label>
  )
}

export default App
