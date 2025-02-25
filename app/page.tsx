import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CopilotSidebar } from "@copilotkit/react-ui";

export default function Home() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <CopilotSidebar
        instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
        labels={{
          title: "Popup Assistant",
          initial: "Need any help?",
        }}
      />
    </div>
  );
}
