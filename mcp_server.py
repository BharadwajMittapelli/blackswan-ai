"""
Execution Instructions:
This is a standalone Model Context Protocol (MCP) server for BlackSwan AI tools.
You can launch this module natively over standard input/output (stdio) channels using an agent runner configuration like:

    npx @modelcontextprotocol/inspector uv run python mcp_server.py
"""
import json
from fastmcp import FastMCP
from app.tools.static_analyzer import parse_source_code_patterns
from app.core.rag_engine import slice_context

# Initialize FastMCP server
mcp = FastMCP("blackswan-ai-context-broker")

@mcp.tool()
async def inspect_code_syntax(contract_code: str) -> str:
    """
    Analyzes the provided contract code syntax using the deterministic static analyzer.
    Returns the resulting diagnostic list as a formatted JSON string.
    """
    diagnostics = await parse_source_code_patterns(contract_code)
    return json.dumps(diagnostics, indent=2)

@mcp.tool()
def slice_functional_bounds(contract_code: str, target_function: str, line_start: int, line_end: int) -> str:
    """
    Extracts the exact target code block for the provided function and line bounds.
    Strips out unrelated boilerplate/comments and returns the precise string output.
    """
    # Create the pattern mock expected by the slice_context function
    pattern = {
        "function_name": target_function,
        "line_start": line_start,
        "line_end": line_end,
    }
    
    # Process the context slice using existing RAG engine logic
    processed_segments = slice_context(contract_code, [pattern])
    
    if processed_segments and len(processed_segments) > 0:
        return processed_segments[0].get("extracted_text_snippet", "")
    
    return ""

if __name__ == "__main__":
    mcp.run(transport="stdio")
