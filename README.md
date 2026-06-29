# Hours Calculator

A web-based calculator for computing contact hours, FTEF, and workload factors for educational institutions.

## Live Demo

**[View the app on GitHub Pages →](https://Kloe1979.github.io/hours-calculator)**

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Kloe1979/hours-calculator.git
   cd hours-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

Build the app for production:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## Deploying to GitHub Pages

The app is configured to deploy automatically to GitHub Pages.

To deploy:

```bash
npm run deploy
```

This will:
1. Build the app
2. Push the built files to the `gh-pages` branch
3. Publish to https://Kloe1979.github.io/hours-calculator

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint
- `npm run deploy` — Build and deploy to GitHub Pages
- `npm run test` - Run focused tests: time.test.js, calculations.test.js from test script in package.json

## Technologies

- **React** 19
- **Vite** — Fast build tool
- **Tailwind CSS** — Utility-first CSS framework
