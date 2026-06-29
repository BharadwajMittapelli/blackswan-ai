# blackswan-ai

## 🚀 Key Features

*   **Robust Ticker Resolution:** Automatically resolves simple coin tickers (e.g. `Bitcoin`, `Ethereum`, `pepe` ) into smart contract addresses via DexScreener search integration.
*   **Institutional Fundamental Audit Matrix:** A 4-tab UI component (Team, Technology, Tokenomics, Roadmap) with live status badges, anomaly detection, and contract bytecode verification.
*   **On-Chain Risk & Escape Velocity Metrics:** Analyzes insider liquidity dumps, calculates estimated blocks to drain, and renders survival probabilities.
*   **Syntax Diagnostic Explorer:** A purely data-driven, Master-Detail interface providing isolated code snippets alongside structural syntax analysis and optimization guidelines.
*   **Deterministic Demo Sandboxing:** Template interception natively routes known mockup addresses (e.g., Reentrancy Vault, Ungated Mint) to hardcoded static analysis targets, ensuring maximum demonstration stability.
*   **Holder Forensics:** Insider clustering flags dynamically track coordinated whale actions across wallets.
*   **Defensive API & UI Fallbacks:** Advanced rate-limit safeguards natively integrated into the ADK engine, rendering graceful placeholder UIs on the frontend instead of crashing.

## Project Structure

```
blackswan-ai/
├── app/                       # Core agent backend (FastAPI + ADK workflow)
│   ├── agent.py               # Main ReAct agent workflow logic
│   ├── config.py              # App configurations and API keys
│   ├── fast_api_app.py        # FastAPI REST API gateway (w/ Template Interception)
│   ├── schemas.py             # Strict Pydantic models (ProjectDiligenceMatrix, etc.)
│   ├── core/
│   │   ├── agent_node.py      # LLM synthesis and semantic processing
│   │   └── rag_engine.py      # Context slicing & RAG pipelines
│   ├── tools/
│   │   ├── __init__.py
│   │   └── static_analyzer.py # Structural syntax parsing & regex block extraction
│   └── app_utils/             # App utilities and helpers
├── frontend/                  # Next.js 15 (App Router) Dashboard
│   ├── src/
│   │   ├── app/               # Router pages & global CSS stylesheets
│   │   ├── components/        # Flyrank-inspired dark-theme dashboard panels
│   │   │   ├── ui/            # Shadcn UI primitives (card, chart, input, button)
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   ├── fundamental-audit-matrix.tsx
│   │   │   ├── header.tsx
│   │   │   ├── historical-activity-chart.tsx
│   │   │   ├── insider-clustering-card.tsx
│   │   │   ├── results-skeleton.tsx
│   │   │   ├── results-view.tsx
│   │   │   ├── syntax-diagnostic-explorer.tsx # Master-Detail code annotation UI
│   │   │   └── stat-grid.tsx
│   │   └── lib/
│   │       └── types.ts       # Shared TypeScript type definitions
│   ├── package.json           # Frontend dependencies (Recharts, Tailwind, etc.)
│   └── next.config.ts         # Next.js configuration
├── tests/                     # Unit, integration, and load tests
├── GEMINI.md                  # AI-assisted development guide
└── pyproject.toml             # Python backend dependencies
```

> 💡 **Tip:** Use [Gemini CLI](https://github.com/google-gemini/gemini-cli) for AI-assisted development - project context is pre-configured in `GEMINI.md`.

## Requirements

Before you begin, ensure you have:
- **uv**: Python package manager (used for all dependency management in this project) - [Install](https://docs.astral.sh/uv/getting-started/installation/) ([add packages](https://docs.astral.sh/uv/concepts/dependencies/) with `uv add <package>`)
- **agents-cli**: Agents CLI - Install with `uv tool install google-agents-cli`
- **Google Cloud SDK**: For GCP services - [Install](https://cloud.google.com/sdk/docs/install)


## Access the Website

The BlackSwan Risk Engine features a dedicated dashboard UI. To access the website directly:

1. **Start the backend:** Run `uv run uvicorn app.fast_api_app:fast_app --host 0.0.0.0 --port 8000` from the root directory.
2. **Start the frontend:** Navigate to the `frontend/` directory and run `npm run dev`.
3. **Open your browser:** Navigate to **[http://localhost:3000](http://localhost:3000)** to view the dashboard.

## Quick Start

Install `agents-cli` and its skills if not already installed:

```bash
uvx google-agents-cli setup
```

Install required packages:

```bash
agents-cli install
```

Test the agent with a local web server:

```bash
agents-cli playground
```

You can also use features from the [ADK](https://adk.dev/) CLI with `uv run adk`.

## Commands

| Command              | Description                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `agents-cli install` | Install dependencies using uv                                                         |
| `agents-cli playground` | Launch local development environment                                                  |
| `agents-cli lint`    | Run code quality checks                                                               |
| `agents-cli eval`    | Evaluate agent behavior (generate, grade, analyze, and more — see `agents-cli eval --help`) |
| `uv run pytest tests/unit tests/integration` | Run unit and integration tests                                                        |

## 🛠️ Project Management

| Command | What It Does |
|---------|--------------|
| `agents-cli scaffold enhance` | Add CI/CD pipelines and Terraform infrastructure |
| `agents-cli infra cicd` | One-command setup of entire CI/CD pipeline + infrastructure |
| `agents-cli scaffold upgrade` | Auto-upgrade to latest version while preserving customizations |

---

## Development

Edit your agent logic in `app/agent.py` and test with `agents-cli playground` - it auto-reloads on save.

## Deployment

```bash
gcloud config set project <your-project-id>
agents-cli deploy
```

To add CI/CD and Terraform, run `agents-cli scaffold enhance`.
To set up your production infrastructure, run `agents-cli infra cicd`.

## Observability

Built-in telemetry exports to Cloud Trace, BigQuery, and Cloud Logging.
