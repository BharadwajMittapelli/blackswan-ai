FROM python:3.11-slim

# --- System dependencies ---
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# --- Install uv (fast Python package manager) ---
RUN pip install --no-cache-dir uv==0.8.13

WORKDIR /code

# --- Copy dependency manifests first (Docker layer caching) ---
COPY ./pyproject.toml ./README.md ./uv.lock* ./

# --- Export a requirements.txt from the lock and install strictly from it ---
RUN uv export --format requirements-txt --no-dev > requirements.txt && \
    uv pip install --system --no-cache-dir -r requirements.txt

# --- Copy application code ---
COPY ./app ./app

# --- Build args for traceability ---
ARG COMMIT_SHA=""
ENV COMMIT_SHA=${COMMIT_SHA}

ARG AGENT_VERSION=0.0.0
ENV AGENT_VERSION=${AGENT_VERSION}

EXPOSE 8080

# --- Uvicorn: 1 worker (prevent ADK graph memory duplication), 8 threads (run_in_threadpool) ---
CMD ["python", "-m", "uvicorn", "app.fast_api_app:fast_app", \
    "--host", "0.0.0.0", \
    "--port", "8080", \
    "--workers", "1", \
    "--timeout-keep-alive", "120"]