# sample_agent/agent.py
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

# Define a factory function that will create and return the graph
def create_mcp_graph():
    """
    Create a LangGraph agent with MCP tools.
    This function creates a fresh connection to the MCP server and returns a graph.
    """
    import asyncio
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
    from langchain_mcp_adapters.tools import load_mcp_tools
    
    # Path to your math server
    MATH_SERVER_PATH = "./math_server.py"
    
    # Create the model
    model = ChatOpenAI(model="gpt-4o")
    
    # Set up and run the async operations to get MCP tools
    async def setup_mcp_tools():
        server_params = StdioServerParameters(
            command="python",
            args=[MATH_SERVER_PATH],
        )
        
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                # Initialize the connection
                await session.initialize()
                
                # Get tools
                tools = await load_mcp_tools(session)
                
                # Create the graph with tools
                return create_react_agent(model, tools)
    
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