## Getting Started

First setup your environment variables:

```sh
touch .env
```

Add the following to the `.env` file:

```sh
LANGSMITH_API_KEY=lsv2_...
```

Then just start the UI and agent, they'll both start and connect to each other:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
