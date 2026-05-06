# Smart E-Commerce Search and Recommendation System using Advanced DSA

A full-stack project demonstrating advanced data structures in a practical e-commerce search experience.

## Concepts Implemented

- **Trie**: Product autocomplete and prefix search.
- **Hash Map**: Product lookup, category mapping, and indexed metadata access.
- **Heap**: Top-rated, cheapest, and most popular product ranking.
- **Graph**: Related-product recommendation traversal.
- **Fenwick Tree**: Efficient price-bucket range queries.

## Tech Stack

- React + Vite
- Tailwind CSS
- Express.js
- JavaScript DSA modules

## Run Locally

```bash
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:4000`

## API

- `GET /api/products`
- `GET /api/search?q=sho`
- `GET /api/top?mode=rating|cheap|popular&limit=5`
- `GET /api/recommendations/:id`
- `GET /api/range?min=500&max=2000`
- `GET /api/categories`
