"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { MCPConfigForm } from "../components/MCPConfigForm";

export default function MCPConfigPage() {
  return (
    <div style={{ height: "100%", width: "100%", display: "flex" }}>
      <div className="w-1/2 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">MCP Server Configuration</h1>
        <p className="mb-4 text-gray-600">
          Configure custom MCP servers to extend the capabilities of your
          assistant. You can add servers that run locally or connect to remote
          services.
        </p>
        <MCPConfigForm />
      </div>

      {/* Sidebar for testing the configuration */}
      <div
        className="w-1/2 border-l"
        style={
          {
            "--copilot-kit-primary-color": "#333333",
          } as CopilotKitCSSProperties
        }
      >
        <CopilotSidebar
          defaultOpen={true}
          instructions={
            "You are assisting the user with MCP server configuration. The user has configured custom MCP servers in the form on the left. You can help test and troubleshoot these configurations."
          }
          labels={{
            title: "MCP Config Assistant",
            initial: "Ask me about your MCP configuration",
          }}
        />
      </div>
    </div>
  );
}
