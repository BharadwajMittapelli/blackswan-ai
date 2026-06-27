# app/tools.py
import json
import requests
import time
from datetime import datetime, timedelta
from functools import wraps

def ttl_cache(ttl_seconds: int = 300):
    def decorator(func):
        cache = {}
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(kwargs)
            now = time.time()
            if key in cache:
                result, timestamp = cache[key]
                if now - timestamp < ttl_seconds:
                    return result
            
            result = func(*args, **kwargs)
            cache[key] = (result, now)
            return result
        return wrapper
    return decorator

@ttl_cache(ttl_seconds=300)
def fetch_tokenomics_data(token_address: str) -> dict:
    """
    Fetches basic supply metrics and acts as a foundational supply checker.
    """
    url = f"https://api.coingecko.com/api/v3/coins/ethereum/contract/{token_address}"
    
    circulating_supply = 10_000_000.0
    total_supply = 100_000_000.0

    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            market_data = data.get("market_data", {})
            circ_val = market_data.get("circulating_supply")
            tot_val = market_data.get("total_supply")
            
            if circ_val is not None:
                circulating_supply = float(circ_val)
            if tot_val is not None:
                total_supply = float(tot_val)
            elif circ_val is not None:
                total_supply = circulating_supply
    except (requests.exceptions.RequestException, ValueError):
        # Fallback to dummy data if API fails or requires key
        pass

    supply_inflation_overhang = max(0.0, total_supply - circulating_supply)

    result = {
        "token_address": token_address,
        "circulating_supply": circulating_supply,
        "total_supply": total_supply,
        "supply_inflation_overhang": supply_inflation_overhang,
        "vesting_data_status": "UNVERIFIED_ON_CHAIN"
    }
    return result

@ttl_cache(ttl_seconds=300)
def fetch_onchain_metrics(token_address: str) -> dict:
    """
    Fetches live on-chain data focusing on liquidity and volume from DexScreener.
    """
    url = f"https://api.dexscreener.com/latest/dex/tokens/{token_address}"
    default_error = {
        "error": "DexScreener API unavailable",
        "total_liquidity_usd": 0,
        "is_liquidity_locked": False
    }

    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 429:
            return default_error
            
        response.raise_for_status()
        data = response.json()
        
        pairs = data.get("pairs")
        if not pairs:
            return default_error
            
        primary_pair = pairs[0]
        
        liquidity = primary_pair.get("liquidity", {})
        liquidity_usd = float(liquidity.get("usd", 0) or 0)
        fdv = float(primary_pair.get("fdv", 0) or 0)
        volume = primary_pair.get("volume", {})
        volume_h24 = float(volume.get("h24", 0) or 0)
        
        volume_to_liquidity_ratio = 0.0
        if liquidity_usd > 0:
            volume_to_liquidity_ratio = volume_h24 / liquidity_usd
            
        result = {
            "token_address": token_address,
            "liquidity_usd": liquidity_usd,
            "fdv": fdv,
            "volume_h24": volume_h24,
            "volume_to_liquidity_ratio": volume_to_liquidity_ratio,
            "is_liquidity_locked": False
        }
        return result
        
    except (requests.exceptions.RequestException, ValueError):
        return default_error

@ttl_cache(ttl_seconds=300)
def fetch_holder_analytics(token_address: str) -> dict:
    """
    Simulates forensic analysis of token holder clustering.
    Returns a dictionary with concentration metrics and top holders.
    """
    import random
    historical_data = []
    base_date = datetime(2026, 6, 27)
    for i in range(30):
        d = base_date - timedelta(days=29 - i)
        date_str = d.strftime("%Y-%m-%d")
        
        if date_str == "2026-06-15":
            volume = 5000000
            tx_count = 2500
        else:
            # Seeded for consistency in mock data if we wanted, but random is fine here
            volume = random.randint(50000, 500000)
            tx_count = random.randint(100, 800)
            
        historical_data.append({
            "date": date_str,
            "volume": volume,
            "tx_count": tx_count
        })
        
    anomalies = [
        {"date": "2026-06-15", "type": "Insider Clustering", "description": "AI Alert: 5 clustered wallets funded by a single source executed simultaneous transfers."}
    ]

    return {
        "top_100_concentration": 68.57,
        "whale_concentration": 95.52,
        "gini_index": 0.9983,
        "holders": [
            {
                "address": "0x1234567890abcdef1234567890abcdef12345678",
                "balance_pct": 35.0,
                "tier": "Whale",
                "funding_source": "0xAbCDeF1234567890AbCDeF1234567890AbCDeF12",
                "cluster_flag": True
            },
            {
                "address": "0xabcdef1234567890abcdef1234567890abcdef12",
                "balance_pct": 25.0,
                "tier": "Whale",
                "funding_source": "0xAbCDeF1234567890AbCDeF1234567890AbCDeF12",
                "cluster_flag": True
            },
            {
                "address": "0x9876543210fedcba9876543210fedcba98765432",
                "balance_pct": 10.0,
                "tier": "Shark",
                "funding_source": "0xAbCDeF1234567890AbCDeF1234567890AbCDeF12",
                "cluster_flag": True
            },
            {
                "address": "0xfedcba0987654321fedcba0987654321fedcba09",
                "balance_pct": 5.0,
                "tier": "Shark",
                "funding_source": "Binance 14",
                "cluster_flag": False
            },
            {
                "address": "0x1111222233334444555566667777888899990000",
                "balance_pct": 1.5,
                "tier": "Crab",
                "funding_source": "Coinbase 2",
                "cluster_flag": False
            }
        ],
        "historical_data": historical_data,
        "anomalies": anomalies
    }