export class ProductGraph {
  constructor() {
    this.edges = new Map()
  }

  addProduct(productId) {
    if (!this.edges.has(productId)) this.edges.set(productId, new Set())
  }

  connect(a, b) {
    this.addProduct(a)
    this.addProduct(b)
    this.edges.get(a).add(b)
    this.edges.get(b).add(a)
  }

  recommend(startId, limit = 6) {
    if (!this.edges.has(startId)) return []

    const visited = new Set([startId])
    const queue = [...this.edges.get(startId)]
    const result = []

    while (queue.length && result.length < limit) {
      const current = queue.shift()
      if (visited.has(current)) continue
      visited.add(current)
      result.push(current)

      for (const neighbor of this.edges.get(current) ?? []) {
        if (!visited.has(neighbor)) queue.push(neighbor)
      }
    }
    return result
  }
}
