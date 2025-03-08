# sample_agent/agent.py
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_mcp_adapters.client import MultiServerMCPClient
import asyncio

# Define a factory function that will create and return the graph
def create_mcp_graph():
    """
    Create a LangGraph agent with MCP tools.
    This function creates a fresh connection to the MCP server and returns a graph.
    """
    # Path to your math server
    MATH_SERVER_PATH = "./math_server.py"
    
    # Create the model
    model = ChatOpenAI(model="gpt-4o")
    
    # Set up and run the async operations to get MCP tools
    async def setup_mcp_tools():
        async with MultiServerMCPClient(
            {
                "math": {
                    "command": "python",
                    "args": [MATH_SERVER_PATH],
                    "transport": "stdio",
                }
            }
        ) as client:
            all_tools = client.get_tools()
            # Create the graph with tools
            return create_react_agent(model, all_tools)
    
    # Create a new event loop to run the async function
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        graph_with_tools = loop.run_until_complete(setup_mcp_tools())
        return graph_with_tools
    finally:
        loop.close()

# Create the graph by calling the factory function
# This runs at import time and creates a graph with MCP tools
graph = create_mcp_graph()