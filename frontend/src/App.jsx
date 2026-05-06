import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeIndianRupee,
  Boxes,
  BrainCircuit,
  ChevronRight,
  GitBranch,
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

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId]
  )

  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[92vh] px-5 py-5 sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-white/60 bg-white/45 px-4 py-3 shadow-sm backdrop-blur-xl">
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

        <div className="mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[1fr_0.92fr] lg:py-20">
          <div className="animate-rise">
            <div className="mb-5 inline-flex animate-float items-center gap-2 rounded-lg border border-teal-100 bg-white/55 px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm backdrop-blur-xl">
              <Sparkles size={16} /> Advanced DSA in a real commerce flow
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl">
              Smart E-Commerce Search and Recommendation System
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              A professional full-stack product discovery platform powered by Trie autocomplete,
              hash-map indexing, heap ranking, graph recommendations, and Fenwick price queries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#system"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-700"
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

          <div className="relative rounded-lg border border-white/70 bg-white/42 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl animate-rise-delayed">
            <div className="pointer-events-none absolute -left-10 top-10 hidden h-52 w-52 rounded-full border border-teal-300/30 lg:block animate-orbit" />
            <div className="pointer-events-none absolute -right-8 bottom-20 hidden h-28 w-28 rounded-full border border-sky-300/40 lg:block animate-orbit-reverse" />
            <div className="rounded-lg bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-teal-200">Live autocomplete</p>
                <Zap size={18} className="text-amber-300" />
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 ring-1 ring-white/10">
                <Search size={20} className="text-teal-200" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-slate-400"
                  placeholder="Search products"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {suggestions.slice(0, 4).map((product) => (
                <ProductRow key={product.id} product={product} onSelect={setSelectedId} />
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200/70 bg-white/60 p-3">
              <div className="data-stream flex min-w-max items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {['Trie prefix match', 'C++ API', 'Heap rank', 'Graph walk', 'Fenwick bucket scan', 'Hash map lookup'].map((label) => (
                  <span key={label} className="rounded-md bg-slate-950 px-3 py-2 text-teal-200">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="system" className="px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Connected frontend and backend</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Product intelligence console</h2>
            </div>
            <div className="rounded-lg border border-white/60 bg-white/50 px-4 py-3 text-sm font-semibold text-slate-700 backdrop-blur-xl">
              {products.length} indexed products
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-lg border border-white/70 bg-white/48 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-xl font-black text-slate-950">Heap-powered rankings</h3>
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {['rating', 'cheap', 'popular'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setRankMode(mode)}
                      className={`rounded-md px-3 py-2 text-sm font-bold capitalize transition ${
                        rankMode === mode ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'
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

            <section className="rounded-lg border border-white/70 bg-white/48 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
              <h3 className="text-xl font-black text-slate-950">Graph recommendations</h3>
              {selectedProduct && (
                <div className="mt-4 rounded-lg bg-slate-950 p-4 text-white">
                  <p className="text-sm text-slate-300">Selected product</p>
                  <p className="mt-1 text-xl font-black">{selectedProduct.name}</p>
                  <p className="mt-2 text-sm text-teal-200">{selectedProduct.category}</p>
                </div>
              )}
              <div className="mt-4 grid gap-3">
                {recommendations.slice(0, 4).map((product) => (
                  <ProductRow key={product.id} product={product} onSelect={setSelectedId} />
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-lg border border-white/70 bg-white/48 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
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
                <div className="mt-4 rounded-lg bg-teal-600 px-4 py-3 text-sm font-bold text-white">
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
          <div className="rounded-lg border border-white/70 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
            <div className="mb-6 flex items-center gap-3">
              <BrainCircuit className="text-teal-300" />
              <h2 className="text-3xl font-black">Advanced DSA architecture</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {dsaCards.map(([title, body, Icon]) => (
                <div key={title} className="rounded-lg border border-white/10 bg-white/8 p-4">
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

function ProductCard({ product, onSelect, compact = false }) {
  return (
    <button
      onClick={() => onSelect(product.id)}
      className="group overflow-hidden rounded-lg border border-white/70 bg-white/70 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-teal-900/10"
    >
      <img src={product.image} alt={product.name} className={`w-full object-cover ${compact ? 'h-28' : 'h-36'}`} />
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">{product.category}</p>
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

function ProductRow({ product, onSelect }) {
  return (
    <button
      onClick={() => onSelect(product.id)}
      className="flex items-center gap-3 rounded-lg border border-white/70 bg-white/68 p-3 text-left shadow-sm transition hover:bg-white"
    >
      <img src={product.image} alt={product.name} className="size-14 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-black text-slate-950">{product.name}</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{formatPrice(product.price)}</p>
      </div>
      <ShieldCheck size={18} className="text-teal-600" />
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
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-3 font-bold text-slate-900 outline-none ring-teal-500 transition focus:ring-2"
      />
    </label>
  )
}

export default App
