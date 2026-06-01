<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your JSON-AI app

This frontend now runs as a Next.js static-export site. Production builds emit plain static assets into `out/`, which can be uploaded directly to S3 or served behind CloudFront.

View your app in AI Studio: https://ai.studio/apps/10304c50-f777-441e-bf07-b87ec772796e

## Run locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` if you wire the mock AI page to a live backend.
3. Start the development server:
   `npm run dev`

## Build for S3

1. Create a production export:
   `npm run build`
2. Deploy the generated `out/` directory to your S3 bucket.
3. If you use CloudFront, configure the distribution to serve `index.html` for directory requests and custom 404 handling as needed.
