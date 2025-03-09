https://github.com/user-attachments/assets/f72e1f7d-3c84-4429-a465-23dff3d3bd63


## Getting Started

First setup your environment variables:

```sh
touch .env
```

Add the following to the `.env` file in the root of the project:

```sh
LANGSMITH_API_KEY=lsv2_...
```

And make another in the `agent` folder:

```sh
cd agent
touch .env
```

Add the following to the `.env` file in the `agent` folder:

```sh
OPENAI_API_KEY=sk-...
LANGSMITH_API_KEY=lsv2_...
```

## Development

For development, we recommend running the frontend and agent separately in different terminals to better see errors and logs:

```bash
# Terminal 1 - Frontend
pnpm run dev-frontend

# Terminal 2 - Agent
pnpm run dev-agent
```

This approach makes it easier to spot and debug issues in either the frontend or agent components.

Alternatively, you can run both services together with a single command:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

The code is factored into 2 parts:

1. The `/agent` folder: A LangGraph agent that connects to MCP servers and calls their tools

2. The `/app` folder: a frontend application that uses CopilotKit for UI and state synchronization.