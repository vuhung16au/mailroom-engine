.PHONY: dev vercel test

# Run the Next.js app locally using Bun
dev:
bun run dev

# Deploy to Vercel using the Vercel CLI
vercel:
vercel --prod

# Run minimal E2E tests using Playwright
test:
bun run playwright test
