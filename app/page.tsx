import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotActionHandler } from "./components/CopilotActionHandler";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Client component that sets up the Copilot action handler */}
      <CopilotActionHandler />

      {/* Main content area */}
      <div className="flex-1 p-8 mr-96 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">MCP-LangGraph Client</h1>
          <p className="text-gray-600 max-w-md">
            A multi-agent system powered by LangGraph and CopilotKit
          </p>
        </div>

        <Link
          href="/mcp-config"
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-md font-medium"
        >
          <Settings className="w-5 h-5" />
          Configure MCP Servers
        </Link>
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
            "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
          }
          labels={{
            title: "MCP Assistant",
            initial: "Need any help?",
          }}
        />
      </div>
    </div>
  );
}
