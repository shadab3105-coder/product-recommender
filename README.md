# AI Product Recommender

React (Vite) frontend + small Express backend that calls the OpenAI API.
The API key stays on the server, never in the browser.

## Setup
1. `npm install`
2. Create a `.env` file (see `.env.example`) with `OPENAI_API_KEY=your_key`
3. `npm run dev` then open http://localhost:5173

## How it works
1. User types a preference ("phone under $500").
2. React sends it to `POST /api/recommend`.
3. The server gives the catalog and the request to GPT and asks for JSON `{ ids, reason }`.
4. The server drops any id not in the catalog; React filters the product list by those ids.

## Structure
- `server.js` - API route and AI call
- `src/App.jsx` - state and page layout
- `src/ProductCard.jsx` - one product
- `src/api.js` - fetch helper
- `src/products.js` - product data
