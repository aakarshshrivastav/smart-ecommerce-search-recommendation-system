export class TrieNode {
  constructor() {
    this.children = new Map()
    this.products = []
    this.isEnd = false
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(word, product) {
    let node = this.root
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode())
      }
      node = node.children.get(char)
      node.products.push(product)
    }
    node.isEnd = true
  }

  searchPrefix(prefix, limit = 8) {
    let node = this.root
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) return []
      node = node.children.get(char)
    }

    const seen = new Set()
    return node.products
      .filter((product) => {
        if (seen.has(product.id)) return false
        seen.add(product.id)
        return true
      })
      .slice(0, limit)
  }
}
