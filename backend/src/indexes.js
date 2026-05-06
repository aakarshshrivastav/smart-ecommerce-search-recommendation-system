import { products } from './data/products.js'
import { FenwickTree } from './dsa/FenwickTree.js'
import { ProductGraph } from './dsa/ProductGraph.js'
import { Trie } from './dsa/Trie.js'

const PRICE_BUCKET = 500
const maxBucket = Math.ceil(Math.max(...products.map((product) => product.price)) / PRICE_BUCKET)

export const productMap = new Map(products.map((product) => [product.id, product]))
export const categoryMap = products.reduce((map, product) => {
  if (!map.has(product.category)) map.set(product.category, [])
  map.get(product.category).push(product)
  return map
}, new Map())

export const trie = new Trie()
products.forEach((product) => {
  trie.insert(product.name, product)
  product.tags.forEach((tag) => trie.insert(tag, product))
})

export const productGraph = new ProductGraph()
products.forEach((product) => productGraph.addProduct(product.id))
productGraph.connect('phone-nova', 'charger-gan')
productGraph.connect('phone-nova', 'earphones-buds')
productGraph.connect('phone-nova', 'case-armour')
productGraph.connect('charger-gan', 'laptop-aero')
productGraph.connect('earphones-buds', 'watch-active')
productGraph.connect('laptop-aero', 'mouse-glide')
productGraph.connect('laptop-aero', 'keyboard-mech')
productGraph.connect('shoe-velocity', 'shorts-airflow')
productGraph.connect('shoe-velocity', 'watch-active')
productGraph.connect('bag-shoulder', 'bottle-steel')
productGraph.connect('bag-shoulder', 'phone-nova')

export const priceFenwick = new FenwickTree(maxBucket + 1)
products.forEach((product) => priceFenwick.add(Math.floor(product.price / PRICE_BUCKET), 1))

export function bucketForPrice(price) {
  return Math.floor(Number(price) / PRICE_BUCKET)
}

export function rangeCount(min, max) {
  const left = Math.max(0, bucketForPrice(min))
  const right = Math.min(maxBucket, bucketForPrice(max))
  return priceFenwick.rangeSum(left, right)
}
