import { CopilotSidebar } from "@copilotkit/react-ui";
import { CopilotActionHandler } from "./components/CopilotActionHandler";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* Client component that sets up the Copilot action handler */}
      <CopilotActionHandler />

      {/* Add a config link */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/mcp-config"
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
        >
          Configure MCP Servers
        </Link>
      </div>

      {/* Customize the default primary color used by CopilotKit components */}
      <div
        style={
          {
            "--copilot-kit-primary-color": "#333333",
          } as CopilotKitCSSProperties
        }
      >
        <CopilotSidebar
          defaultOpen={true}
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
