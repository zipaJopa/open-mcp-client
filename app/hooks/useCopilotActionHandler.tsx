"use client";

import { useCopilotAction } from "@copilotkit/react-core";

/**
 * Custom hook that sets up the Copilot action rendering
 */
export const useCopilotActionHandler = (): void => {
  useCopilotAction({
    name: "*",
    render: ({ name, args, status, result }: any) => {
      return (
        <div className="p-4 space-y-2">
          <div className="font-medium">Action: {name}</div>
          <div className="text-sm">Arguments: {JSON.stringify(args)}</div>
          <div className="text-sm">Status: {status}</div>
          <div className="text-sm">Result: {JSON.stringify(result)}</div>
        </div>
      );
    },
  });
}; 