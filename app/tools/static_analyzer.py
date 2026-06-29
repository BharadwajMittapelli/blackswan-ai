import re

def get_demo_source(profile: str) -> str:
    """Returns hardcoded clean source text based on the demo profile."""
    if profile == "reentrancy_vault":
        return '''pragma solidity ^0.8.0;
contract ReentrancyVault {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
        balances[msg.sender] = 0;
    }
    
    @admin
    function emergencyWithdraw() public {
        // admin only logic
        payable(msg.sender).transfer(address(this).balance);
    }
}
'''
    elif profile == "ungated_mint":
        return '''pragma solidity ^0.8.0;
contract UngatedMintToken {
    uint public totalSupply;
    mapping(address => uint) public balances;
    
    function mint(address to, uint amount) public {
        totalSupply += amount;
        balances[to] += amount;
    }
}
'''
    else: # secure_asset
        return '''pragma solidity ^0.8.0;
contract SecureAsset {
    address public admin;
    uint public totalSupply;
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    @onlyOwner
    function setAdmin(address newAdmin) public {
        admin = newAdmin;
    }
}
'''

async def parse_source_code_patterns(contract_code: str) -> list:
    """
    Parses the raw source code string using standard Python string operations and regular expressions
    to find specific functional signatures (like state-variable update orders or administrative access tags).
    
    Returns a list of dictionaries mapping the identified function names, line numbers, and formatting categories.
    """
    results = []
    lines = contract_code.splitlines()
    
    # Very basic pattern matching for demonstration
    # Look for functions
    function_pattern = re.compile(r'^\s*(def|function)\s+([a-zA-Z0-9_]+)\s*\(')
    admin_tag_pattern = re.compile(r'(onlyOwner|requiresAuth|admin_only|@admin|onlyRole)')
    # Adjusted to catch solidity mapping updates e.g. balances[msg.sender] += msg.value; and python self.x = 
    state_update_pattern = re.compile(r'(self\.[a-zA-Z0-9_]+\s*=|balances\[.*\]\s*[\+\-]?=|totalSupply\s*[\+\-]?=)')
    
    in_function = False
    current_func_name = None
    start_line = 0
    has_admin = False
    has_state_update = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Function definition
        func_match = function_pattern.search(line)
        if func_match:
            if in_function:
                category = "Standard Function"
                if has_admin:
                    category = "Administrative Access Level"
                elif has_state_update:
                    category = "State Update Sequence"
                
                results.append({
                    "function_name": current_func_name,
                    "line_start": start_line,
                    "line_end": line_num - 1,
                    "category": category
                })
            
            in_function = True
            current_func_name = func_match.group(2)
            start_line = line_num
            has_admin = False
            has_state_update = False
        
        if in_function:
            if admin_tag_pattern.search(line):
                has_admin = True
            if state_update_pattern.search(line):
                has_state_update = True
                
    # Handle last function
    if in_function:
        category = "Standard Function"
        if has_admin:
            category = "Administrative Access Level"
        elif has_state_update:
            category = "State Update Sequence"
            
        results.append({
            "function_name": current_func_name,
            "line_start": start_line,
            "line_end": len(lines),
            "category": category
        })
        
    return results
