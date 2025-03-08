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

Then just start the UI and agent, they'll both start and connect to each other:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
