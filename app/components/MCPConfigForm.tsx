"use client";

import { useState, useEffect } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import { ExampleConfigs } from "./ExampleConfigs";

type ConnectionType = "stdio" | "sse";

interface StdioConfig {
  command: string;
  args: string[];
  transport: "stdio";
}

interface SSEConfig {
  url: string;
  transport: "sse";
}

type ServerConfig = StdioConfig | SSEConfig;

export function MCPConfigForm() {
  const { setState, state } = useCoAgent({
    name: "sample_agent",
    initialState: {
      mcp_config: {},
    },
  });
  const [configs, setConfigs] = useState<Record<string, ServerConfig>>({});
  const [serverName, setServerName] = useState("");
  const [connectionType, setConnectionType] = useState<ConnectionType>("stdio");
  const [command, setCommand] = useState("");
  const [args, setArgs] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  // Fetch the current configuration when the component mounts
  useEffect(() => {
    if (state && state.mcp_config) {
      setConfigs(state.mcp_config as Record<string, ServerConfig>);
    }
    setIsLoading(false);
  }, [state]);

  const handleExampleConfig = (exampleConfig: Record<string, ServerConfig>) => {
    // Merge the example with existing configs or replace them based on user preference
    if (Object.keys(configs).length > 0) {
      const shouldReplace = window.confirm(
        "Do you want to replace your current configuration with this example? Click 'OK' to replace, or 'Cancel' to merge."
      );

      if (shouldReplace) {
        setConfigs(exampleConfig);
      } else {
        setConfigs((prev) => ({ ...prev, ...exampleConfig }));
      }
    } else {
      setConfigs(exampleConfig);
    }
  };

  const addConfig = () => {
    if (!serverName) return;

    const newConfig =
      connectionType === "stdio"
        ? {
            command,
            args: args.split(" ").filter((arg) => arg.trim() !== ""),
            transport: "stdio" as const,
          }
        : {
            url,
            transport: "sse" as const,
          };

    setConfigs((prev) => ({
      ...prev,
      [serverName]: newConfig,
    }));

    // Reset form
    setServerName("");
    setCommand("");
    setArgs("");
    setUrl("");
  };

  const removeConfig = (name: string) => {
    setConfigs((prev) => {
      const newConfigs = { ...prev };
      delete newConfigs[name];
      return newConfigs;
    });
  };

  const saveConfigs = async () => {
    setSaveStatus("saving");
    try {
      await setState({
        mcp_config: configs,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
      console.error("Error saving MCP configuration:", error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading configuration...</div>;
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">MCP Server Configuration</h2>

      <ExampleConfigs onSelectConfig={handleExampleConfig} />

      {Object.entries(configs).length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Configured Servers</h3>
          <div className="space-y-2">
            {Object.entries(configs).map(([name, config]) => (
              <div
                key={name}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div>
                  <span className="font-medium">{name}</span>
                  <span className="ml-2 text-xs bg-gray-200 px-1 rounded">
                    {config.transport}
                  </span>
                  <div className="text-xs text-gray-500">
                    {config.transport === "stdio"
                      ? `${config.command} ${config.args.join(" ")}`
                      : config.url}
                  </div>
                </div>
                <button
                  onClick={() => removeConfig(name)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={saveConfigs}
            disabled={saveStatus === "saving"}
            className={`mt-2 px-3 py-1 rounded text-sm ${
              saveStatus === "idle"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : saveStatus === "saving"
                ? "bg-gray-400 text-white cursor-not-allowed"
                : saveStatus === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {saveStatus === "idle"
              ? "Apply Configurations"
              : saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "success"
              ? "Saved!"
              : "Error!"}
          </button>
        </div>
      )}

      <div className="space-y-3 border-t pt-3">
        <h3 className="text-sm font-medium">Add New Server</h3>

        <div>
          <label className="block text-sm mb-1">Server Name</label>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="e.g., math, search, etc."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Connection Type</label>
          <select
            value={connectionType}
            onChange={(e) =>
              setConnectionType(e.target.value as ConnectionType)
            }
            className="w-full px-2 py-1 border rounded text-sm"
          >
            <option value="stdio">Standard IO</option>
            <option value="sse">SSE (Server-Sent Events)</option>
          </select>
        </div>

        {connectionType === "stdio" ? (
          <>
            <div>
              <label className="block text-sm mb-1">Command</label>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="e.g., python"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Arguments</label>
              <input
                type="text"
                value={args}
                onChange={(e) => setArgs(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="e.g., path/to/script.py"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="e.g., http://localhost:8000/events"
            />
          </div>
        )}

        <button
          onClick={addConfig}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Add Server
        </button>
      </div>
    </div>
  );
}
