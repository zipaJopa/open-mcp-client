from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent

from langchain_openai import ChatOpenAI
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

# Get the directory of the current file
CURRENT_DIR = Path(__file__).parent

# Load environment variables from .env file
load_dotenv()

# Path to your math server - use relative path to this file
DEFAULT_MATH_SERVER_PATH = "/Users/ataibarkai/LocalGit/CopilotKit-Other-Repos/mcp-client-langgraph/agent/math_server.py"

async def run_agent():
    # Initialize OpenAI model with API key from environment variables
    model = ChatOpenAI(model="gpt-4o")
    
    server_params = StdioServerParameters(
        command="python",
        # Make sure to update to the full absolute path to your math_server.py file
        args=[DEFAULT_MATH_SERVER_PATH],
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()

            # Get tools
            tools = await load_mcp_tools(session)

            # Create and run the agent
            agent = create_react_agent(model, tools)
            agent_response = await agent.ainvoke({"messages": "what's 29234 times 7731?"})
            
            # Print the agent response when it's ready
            print(f"Agent response: {agent_response}")
            
            return agent_response

def main():
    # Run the async function
    asyncio.run(run_agent())

if __name__ == "__main__":
    main()