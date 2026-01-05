import requests

base_url = "https://magnificent-communication.railway.app"

print(f"🔍 Checking what's running at: {base_url}")

try:
    response = requests.get(base_url)
    print(f"Root endpoint response: {response.text}")
    print(f"Status: {response.status_code}")
    
    # Try FastAPI docs
    docs_response = requests.get(f"{base_url}/docs")
    print(f"\n/docs endpoint: {docs_response.status_code}")
    if docs_response.status_code == 200:
        print("FastAPI docs available!")
    
    # Try health
    health_response = requests.get(f"{base_url}/health")
    print(f"/health endpoint: {health_response.status_code}")
    print(f"Health response: {health_response.text}")
    
except Exception as e:
    print(f"Error: {e}")

print("\n🤔 The service is running but FastAPI routes might not be configured correctly.")
print("📋 Check Railway logs to see what's actually starting up.")
