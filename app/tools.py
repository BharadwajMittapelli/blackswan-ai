# app/tools.py
import json

def fetch_tokenomics_data(token_address: str) -> str:
    """
    Fetches raw JSON data regarding token allocation, vesting schedules, and upcoming unlocks.
    """
    data = {
        "token_address": token_address,
        "circulating_supply": 10_000_000,
        "total_supply": 100_000_000,
        "team_insider_allocation_pct": 25.0,
        "upcoming_unlocks": [
            {
                "date": "2024-05-15",
                "amount": 1_000_000,  # 10% of circulating
                "days_until_unlock": 15
            }
        ]
    }
    return json.dumps(data)

def fetch_onchain_metrics(token_address: str) -> str:
    """
    Fetches live on-chain data focusing on liquidity and wallet concentration.
    """
    data = {
        "token_address": token_address,
        "is_liquidity_locked": False,
        "liquidity_usd": 40_000.0,
        "top_10_wallet_supply_pct": 35.0,
        "recent_deployer_sells_usd": 0.0
    }
    return json.dumps(data)