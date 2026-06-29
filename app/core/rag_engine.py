import re
from typing import List, Dict, Any

def slice_context(contract_code: str, parsed_patterns: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Takes the raw code text and the output from parse_source_code_patterns.
    Computes start and end boundaries, strips out unrelated boilerplate/comments,
    and maps the isolated segment into the 'extracted_text_snippet' field.
    """
    lines = contract_code.splitlines()
    processed_segments = []
    
    for pattern in parsed_patterns:
        start = pattern.get("line_start", 1) - 1
        end = pattern.get("line_end", len(lines))
        
        # Get the raw lines for this function
        snippet_lines = lines[start:end]
        
        # Basic comment stripping (e.g., lines starting with # or //)
        cleaned_lines = []
        for line in snippet_lines:
            stripped = line.strip()
            if stripped.startswith("#") or stripped.startswith("//"):
                continue
            cleaned_lines.append(line)
            
        snippet = "\n".join(cleaned_lines).strip()
        
        processed_segments.append({
            "function_name": pattern.get("function_name"),
            "line_start": pattern.get("line_start"),
            "line_end": pattern.get("line_end"),
            "category": pattern.get("category"),
            "extracted_text_snippet": snippet
        })
        
    return processed_segments
