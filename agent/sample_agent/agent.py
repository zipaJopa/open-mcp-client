"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

from typing_extensions import Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langchain.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from langgraph.prebuilt import ToolNode
from copilotkit import CopilotKitState
from langchain_mcp_adapters.client import MultiServerMCPClient

class AgentState(CopilotKitState):
    """
    Here we define the state of the agent

    In this instance, we're inheriting from CopilotKitState, which will bring in
    the CopilotKitState fields. We're also adding a custom field, `language`,
    which will be used to set the language of the agent.
    """
    language: Literal["english", "spanish"] = "english"
    # your_custom_agent_state: str = ""


# @tool
# def your_tool_here(your_arg: str):
#     """Your tool description here."""
#     print(f"Your tool logic here")
#     return "Your tool response here."


# Initialize the MCP tools outside both functions
async def setup_mcp_tools():
    """Set up and return the MCP tools."""
    async with MultiServerMCPClient(
        {
            "math": {
                "command": "python",
                "args": ["/Users/ataibarkai/LocalGit/CopilotKit-Other-Repos/mcp-client-langgraph/agent/math_server.py"],
                "transport": "stdio",
            }
        }
    ) as client:
        return client.get_tools()

# Get the MCP tools at module level
mcp_tools = []  # Will be populated at runtime

async def chat_node(state: AgentState, config: RunnableConfig) -> Command[Literal["tool_node", "__end__"]]:
    """
    This is a modified example of the ReAct design pattern, which consists of:
    - Getting a response from the model
    - Handling tool calls

    For more about the ReAct design pattern, see: 
    https://www.perplexity.ai/search/react-agents-NcXLQhreS0WDzpVaS4m9Cg
    """
    
    # 1. Define the model
    model = ChatOpenAI(model="gpt-4o")

    # Get MCP tools if we haven't already
    global mcp_tools
    if not mcp_tools:
        mcp_tools = await setup_mcp_tools()

    # 2. Bind the tools to the model
    tools = [
        *mcp_tools,  # Include only the MCP tools
    ]
    
    model_with_tools = model.bind_tools(
        tools,

        # 2.1 Disable parallel tool calls to avoid race conditions,
        #     enable this for faster performance if you want to manage
        #     the complexity of running tool calls in parallel.
        parallel_tool_calls=False,
    )

    # 3. Define the system message by which the chat model will be run
    system_message = SystemMessage(
        content=f"You are a helpful assistant. Talk in {state.get('language', 'english')}."
    )

    # 4. Run the model to generate a response
    response = await model_with_tools.ainvoke([
        system_message,
        *state["messages"],
    ], config)

    # 5. Check for tool calls in the response and handle them.
    if isinstance(response, AIMessage) and response.tool_calls:
        return Command(goto="tool_node", update={"messages": response})

    # 6. We've handled all tool calls, so we can end the graph.
    return Command(
        goto=END,
        update={"messages": state["messages"] + [response]},
    )

async def tool_node(state: AgentState, config: RunnableConfig) -> Command[Literal["chat_node"]]:
    """
    Async tool node that handles executing tools and returning results.
    Uses the same tools as in the chat_node.
    """
    # Get MCP tools if we haven't already
    global mcp_tools
    if not mcp_tools:
        mcp_tools = await setup_mcp_tools()
        
    # Execute the tool call using only the MCP tools
    tools = [
        *mcp_tools,  # Include only the MCP tools
    ]
    
    # Process the tool call and get response
    # Note: ToolNode().ainvoke returns a single message, not a list of messages
    tool_node_result = await ToolNode(tools=tools).ainvoke({"messages": state["messages"]})
    tool_node_message = tool_node_result["messages"][-1]
    
    # Update state with the tool result message
    # The tool result is already a properly formatted message
    
    # Return to chat node with updated state
    return Command(goto="chat_node", update={"messages": tool_node_message})

# Define the workflow graph
workflow = StateGraph(AgentState)
workflow.add_node("chat_node", chat_node)
workflow.add_node("tool_node", tool_node)
workflow.add_edge("tool_node", "chat_node")
workflow.set_entry_point("chat_node")

# Compile the workflow graph
graph = workflow.compile(MemorySaver())