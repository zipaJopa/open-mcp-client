"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { ToolCallRenderer } from "../components/ToolCallRenderer";

/**
 * Custom hook that sets up the Copilot action rendering
 */
export const useCopilotActionHandler = (): void => {
  useCopilotAction({
    name: "*",
    render: ({ name, args, status, result }: any) => {
      return (
        <ToolCallRenderer
          name={name}
          args={args}
          status={status || "unknown"}
          result={result}
        />
      );
    },
  });
}; 