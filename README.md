# Agentic RFP Platform 🚀

An intelligent RFP (Request for Proposal) management platform powered by AI agents. Automates technical analysis, pricing calculations, and sales insights for efficient proposal generation.

## Features

- **Main Agent Orchestration**: Coordinates the complete RFP workflow
- **Technical Agent**: Analyzes specifications and matches products/SKUs
- **Sales Agent**: Identifies opportunities and tracks pipeline
- **Pricing Agent**: Calculates costs, margins, and generates pricing tables
- **AI Insights**: Real-time analytics and recommendations on every page
- **Dashboard**: Visual pipeline tracking with win rates and metrics

## Tech Stack

**Frontend**: Next.js 14, React, TypeScript, TailwindCSS, Chart.js  
**Backend**: FastAPI (Python), Pydantic, BeautifulSoup4  
**AI**: Google Gemini API integration  
**Deployment**: Vercel (frontend), Render (backend)

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/SrishtiPandey0714/agentic-rfp-platform.git
   cd agentic-rfp-platform
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file with your API key
   echo "GEMINI_API_KEY=your_key_here" > .env
   
   # Run backend
   uvicorn api.main:app --reload --port 8000
   ```

3. **Setup Frontend**
   ```bash
   cd rfp-frontend
   npm install
   
   # Create .env.local
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   
   # Run frontend
   npm run dev
   ```

4. **Access the app**: http://localhost:3000

## Cloud Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step deployment guide using Vercel and Render.

**Quick Deploy**:
1. Push to GitHub
2. Deploy backend to Render (free tier)
3. Deploy frontend to Vercel (free tier)
4. Configure environment variables

## Project Structure

```
agentic-rfp-platform/
├── backend/
│   ├── api/              # FastAPI routes
│   ├── agents/           # AI agent logic (main, technical, sales, pricing)
│   ├── loaders/          # Data loaders (HTML, JSON, pricing)
│   ├── data/             # RFP documents and sources
│   └── requirements.txt
├── rfp-frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   └── lib/              # Utilities and API client
├── DEPLOYMENT.md         # Deployment guide
└── render.yaml           # Render deployment config
```

## Environment Variables

**Backend** (`.env`):
- `GEMINI_API_KEY`: Your Google Gemini API key

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL`: Backend API URL

## API Endpoints

- `GET /`: Health check
- `POST /api/rfp/run-pipeline`: Execute complete RFP workflow
- `GET /api/dashboard/overview`: Get dashboard metrics
- `POST /api/ai-insights`: Generate AI insights for any page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See [LICENSE](./LICENSE) file for details.

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section.