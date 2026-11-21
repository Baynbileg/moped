# Moped Supply

A small React + TypeScript storefront starter for a moped and parts shop. The
catalog is sample data and the cart runs in the browser; there is no backend,
checkout, or payment processing yet.

## Requirements

- Node.js
- npm

## Getting started

Create a `.env.local` file based on `env.example` and replace the placeholders
with your Supabase project URL and anon key.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check and build the project:

```sh
npm run typecheck
npm run build
npm run preview
```

Edit the storefront in `src/`. Replace the example products and image URLs in
`src/products.ts` with your own inventory.