"use client";

import { useState } from "react";

type ExampleConfig = {
  name: string;
  description: string;
  config: Record<string, any>;
};

const EXAMPLE_CONFIGS: ExampleConfig[] = [
  {
    name: "Math Service",
    description:
      "A simple Python server that can perform mathematical operations",
    config: {
      math: {
        command: "python",
        args: ["agent/math_server.py"],
        transport: "stdio",
      },
    },
  },
  {
    name: "Web Search",
    description: "Connect to a search service via SSE",
    config: {
      search: {
        url: "http://localhost:8000/search/events",
        transport: "sse",
      },
    },
  },
  {
    name: "Full Stack",
    description:
      "A combination of multiple services for comprehensive functionality",
    config: {
      math: {
        command: "python",
        args: ["agent/math_server.py"],
        transport: "stdio",
      },
      search: {
        url: "http://localhost:8000/search/events",
        transport: "sse",
      },
      database: {
        command: "node",
        args: ["scripts/db_server.js"],
        transport: "stdio",
      },
    },
  },
];

interface ExampleConfigsProps {
  onSelectConfig: (config: Record<string, any>) => void;
}

export function ExampleConfigs({ onSelectConfig }: ExampleConfigsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-6">
      <div
        className="flex items-center justify-between cursor-pointer bg-gray-100 p-3 rounded-md"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-sm font-medium">Example Configurations</h3>
        <span>{expanded ? "↑" : "↓"}</span>
      </div>

      {expanded && (
        <div className="mt-2 grid grid-cols-1 gap-3">
          {EXAMPLE_CONFIGS.map((example) => (
            <div key={example.name} className="border rounded-md p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{example.name}</h4>
                  <p className="text-sm text-gray-600">{example.description}</p>
                </div>
                <button
                  onClick={() => onSelectConfig(example.config)}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Use This
                </button>
              </div>
              <div className="mt-2">
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(example.config, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
