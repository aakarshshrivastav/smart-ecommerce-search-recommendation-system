export class FenwickTree {
  constructor(size) {
    this.tree = Array(size + 1).fill(0)
  }

  add(index, value) {
    for (let i = index + 1; i < this.tree.length; i += i & -i) {
      this.tree[i] += value
    }
  }

  sum(index) {
    let total = 0
    for (let i = index + 1; i > 0; i -= i & -i) {
      total += this.tree[i]
    }
    return total
  }

  rangeSum(left, right) {
    if (right < left) return 0
    return this.sum(right) - (left > 0 ? this.sum(left - 1) : 0)
  }
}
