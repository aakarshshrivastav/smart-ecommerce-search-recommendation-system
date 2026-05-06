import cors from 'cors'
import express from 'express'
import { products } from './data/products.js'
import { topK } from './dsa/Heap.js'
import { bucketForPrice, categoryMap, productGraph, productMap, rangeCount, trie } from './indexes.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'Smart Commerce API' })
})

app.get('/api/products', (_req, res) => {
  res.json(products)
})

app.get('/api/categories', (_req, res) => {
  res.json(
    [...categoryMap.entries()].map(([name, items]) => ({
      name,
      count: items.length
    }))
  )
})

app.get('/api/search', (req, res) => {
  const q = String(req.query.q ?? '').trim()
  if (!q) return res.json([])
  res.json(trie.searchPrefix(q, Number(req.query.limit ?? 8)))
})

app.get('/api/top', (req, res) => {
  const mode = String(req.query.mode ?? 'rating')
  const limit = Number(req.query.limit ?? 5)
  const compareByMode = {
    rating: (a, b) => a.rating >= b.rating,
    cheap: (a, b) => a.price <= b.price,
    popular: (a, b) => a.popularity >= b.popularity
  }

  res.json(topK(products, compareByMode[mode] ?? compareByMode.rating, limit))
})

app.get('/api/recommendations/:id', (req, res) => {
  const selected = productMap.get(req.params.id)
  if (!selected) return res.status(404).json({ message: 'Product not found' })

  const ids = productGraph.recommend(selected.id)
  res.json(ids.map((id) => productMap.get(id)).filter(Boolean))
})

app.get('/api/range', (req, res) => {
  const min = Number(req.query.min ?? 0)
  const max = Number(req.query.max ?? Number.MAX_SAFE_INTEGER)
  const items = products.filter((product) => product.price >= min && product.price <= max)

  res.json({
    min,
    max,
    bucketStart: bucketForPrice(min),
    bucketEnd: bucketForPrice(max),
    indexedCount: rangeCount(min, max),
    products: items
  })
})

app.listen(PORT, () => {
  console.log(`Smart Commerce API running on http://localhost:${PORT}`)
})
