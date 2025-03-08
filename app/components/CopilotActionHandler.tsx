"use client";

import { useCopilotActionHandler } from "../hooks/useCopilotActionHandler";

/**
 * Client component that handles Copilot actions
 * This component has no UI of its own, it just sets up the action handler
 */
export const CopilotActionHandler: React.FC = () => {
  useCopilotActionHandler();
  
  // Return null as this component doesn't render anything visible
  return null;
}; 