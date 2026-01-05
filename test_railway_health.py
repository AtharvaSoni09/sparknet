import requests

# Test basic health check
urls_to_test = [
    "https://magnificent-communication.railway.app/",
    "https://magnificent-communication.railway.app/docs",
    "https://magnificent-communication.railway.app/health",
    "https://magnificent-communication-production.up.railway.app/",
    "https://magnificent-communication-production.up.railway.app/docs"
]

print("🔍 Testing Railway service availability...")
for url in urls_to_test:
    try:
        response = requests.get(url, timeout=5)
        print(f"✅ {url} -> Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   Content length: {len(response.text)} chars")
    except Exception as e:
        print(f"❌ {url} -> Error: {e}")

print("\n📋 What to check in Railway Dashboard:")
print("1. Service logs for errors")
print("2. Build status")
print("3. Copy the actual service URL from dashboard")
print("4. Check if FastAPI is starting correctly")
