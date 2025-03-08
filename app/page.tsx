import { CopilotSidebar } from "@copilotkit/react-ui";

export default function Home() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <CopilotSidebar
        defaultOpen={true}
        instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
        labels={{
          title: "MCP Assistant",
          initial: "Need any help?",
        }}
      />
    </div>
  );
}
