"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

from typing_extensions import Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from copilotkit import CopilotKitState
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent

class AgentState(CopilotKitState):
    """
    Here we define the state of the agent

    In this instance, we're inheriting from CopilotKitState, which will bring in
    the CopilotKitState fields. We're also adding a custom field, `language`,
    which will be used to set the language of the agent.
    """
    # TypedDict classes cannot contain instance variables with default values
    # So we'll handle language within the node functions instead
    pass

async def chat_node(state: AgentState, config: RunnableConfig) -> Command[Literal["__end__"]]:
    """
    This is a simplified agent that uses the ReAct agent as a subgraph.
    It handles both chat responses and tool execution in one node.
    """
    # Set up the MCP client and tools within the chat node
    async with MultiServerMCPClient(
        {
            "math": {
                "command": "python",
                "args": ["/Users/ataibarkai/LocalGit/CopilotKit-Other-Repos/mcp-client-langgraph/agent/math_server.py"],
                "transport": "stdio",
            }
        }
    ) as mcp_client:
        # Get the tools
        mcp_tools = mcp_client.get_tools()
        
        # Create the react agent
        model = ChatOpenAI(model="gpt-4o")
        react_agent = create_react_agent(model, mcp_tools)
        
        # Prepare messages for the react agent
        agent_input = {
            "messages": state["messages"]
        }
        
        # Run the react agent subgraph with our input
        agent_response = await react_agent.ainvoke(agent_input)
        
        # Update the state with the new messages
        updated_messages = state["messages"] + agent_response.get("messages", [])
        
        # End the graph with the updated messages
        return Command(
            goto=END,
            update={"messages": updated_messages},
        )

# Define the workflow graph with only a chat node
workflow = StateGraph(AgentState)
workflow.add_node("chat_node", chat_node)
workflow.set_entry_point("chat_node")

# Compile the workflow graph
graph = workflow.compile(MemorySaver())