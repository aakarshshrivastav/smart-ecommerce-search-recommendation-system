export class Heap {
  constructor(compare) {
    this.values = []
    this.compare = compare
  }

  push(item) {
    this.values.push(item)
    this.bubbleUp(this.values.length - 1)
  }

  pop() {
    if (this.values.length === 0) return null
    if (this.values.length === 1) return this.values.pop()

    const top = this.values[0]
    this.values[0] = this.values.pop()
    this.sinkDown(0)
    return top
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.compare(this.values[parent], this.values[index])) break
      ;[this.values[parent], this.values[index]] = [this.values[index], this.values[parent]]
      index = parent
    }
  }

  sinkDown(index) {
    while (true) {
      const left = index * 2 + 1
      const right = index * 2 + 2
      let best = index

      if (left < this.values.length && !this.compare(this.values[best], this.values[left])) {
        best = left
      }
      if (right < this.values.length && !this.compare(this.values[best], this.values[right])) {
        best = right
      }
      if (best === index) return

      ;[this.values[index], this.values[best]] = [this.values[best], this.values[index]]
      index = best
    }
  }
}

export function topK(items, compare, limit) {
  const heap = new Heap(compare)
  items.forEach((item) => heap.push(item))

  const result = []
  while (result.length < limit && heap.values.length) {
    result.push(heap.pop())
  }
  return result
}
