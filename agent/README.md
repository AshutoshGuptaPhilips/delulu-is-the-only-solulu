# Solulu Agent Service

Custom REST agent service for generating high-quality alternative realities.

## What this service does

- Receives user input over REST.
- Retrieves similar examples from ../dataset.
- Generates 4 alternatives (Ollama, OpenAI, or local fallback).
- Scores alternatives with a rubric.
- Reranks for quality and diversity.
- Returns structured JSON for frontend rendering.

## Folder structure

- config/system-prompt.md: Main behavioral instruction.
- config/rubric.json: Quality scoring dimensions and weights.
- config/output-schema.json: Required JSON output format.
- src/server.js: Express server bootstrap.
- src/routes/agent.js: REST endpoints.
- src/agent/: Retrieval, generation, critic, reranker, safety, pipeline.

## API

### POST /api/agent/respond

Request body:

```json
{
  "event": "My manager gave me critical feedback in a meeting",
  "emotion": "anxious and embarrassed",
  "interpretation": "Everyone thinks I am not good enough",
  "exerciseId": "optional",
  "conversationId": "optional"
}
```

Response body:

```json
{
  "requestId": "uuid",
  "provider": "local",
  "answer": "Here are four grounded alternative realities...",
  "confidenceScore": 82.5,
  "safetyFlags": [],
  "suggestedActions": [
    "Write two other explanations..."
  ],
  "alternatives": [
    {
      "id": 1,
      "title": "AI Interpretation of Your Thought",
      "type": "ai_interpretation",
      "alternativeView": "...",
      "evidence": "...",
      "gentleReframe": "...",
      "nextStep": "...",
      "rubricScore": 84.1
    }
  ]
}
```

## Run locally

Prerequisites:

- Node.js 18+
- Ollama installed and running

1. Open a terminal in agent
2. Pull the recommended open-source model in Ollama
3. Install dependencies
4. Copy .env.example to .env
5. Start the service

Commands:

```bash
ollama pull llama3.2:3b
npm install
npm run dev
```

If PowerShell blocks npm with an execution policy error, use npm.cmd instead:

```bash
npm.cmd install
npm.cmd run dev
```

If ollama is not recognized right after installation, close and reopen the terminal, or refresh PATH in the current session:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
ollama --version
```

Default URL: http://localhost:8787

## Model selection

- Open-source Ollama (default): MODEL_PROVIDER=ollama
  - OLLAMA_BASE_URL=http://localhost:11434
  - OLLAMA_MODEL=llama3.2:3b
- Local template fallback: MODEL_PROVIDER=local
- OpenAI optional: MODEL_PROVIDER=openai and set OPENAI_API_KEY

Recommended models for this use case:

- llama3.2:3b (best first-run reliability on most laptops)
- llama3.1:8b (higher quality if you have enough RAM)
- qwen2.5:7b (strong structured-output behavior)

## Customization for better correctness

1. Edit config/system-prompt.md to control tone and hard rules.
2. Edit config/rubric.json to rebalance scoring priorities.
3. Edit config/output-schema.json if frontend contract changes.

Tip: keep grounded and cognitive_balance weights high if you want safer, less catastrophic outputs.
