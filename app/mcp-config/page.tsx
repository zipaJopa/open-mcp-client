"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { MCPConfigForm } from "../components/MCPConfigForm";
import { CopilotActionHandler } from "../components/CopilotActionHandler";
export default function MCPConfigPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CopilotActionHandler />
      {/* Main content area */}
      <div className="flex-1 p-8 mr-96">
        <MCPConfigForm />
      </div>

      {/* Fixed sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-96 border-l bg-white shadow-md"
        style={
          {
            "--copilot-kit-primary-color": "#4A4A4A",
          } as CopilotKitCSSProperties
        }
      >
        <CopilotChat
          className="h-full flex flex-col"
          instructions={
            "You are assisting the user with MCP server configuration. The user has configured custom MCP servers in the form. You can help test and troubleshoot these configurations."
          }
          labels={{
            title: "Configuration Assistant",
            initial: "Ask me about your MCP configuration",
          }}
        />
      </div>
    </div>
  );
}
