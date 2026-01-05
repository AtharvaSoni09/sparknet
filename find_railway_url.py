import requests
import json

# Test data
test_data = {
    "temp_max_F": 85.0,
    "humidity_pct": 45.0,
    "windspeed_mph": 10.0,
    "precip_in": 0.0,
    "ndvi": 0.3,
    "pop_density": 100.0,
    "slope": 5.0
}

# Try different Railway URL formats
railway_urls = [
    "https://magnificent-communication.railway.app/api/explain",
    "https://magnificent-communication.railway.app/explain",
    "https://magnificent-communication-production.up.railway.app/api/explain",
    "https://magnificent-communication-production.up.railway.app/explain"
]

print("Testing Railway URLs...")
for url in railway_urls:
    try:
        print(f"\n🔍 Testing: {url}")
        response = requests.post(url, json=test_data, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS! Prediction: {result.get('prediction_acres', 'N/A'):.2f} acres")
            print(f"🎯 This is your working API URL: {url}")
            break
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Failed: {e}")

print("\n📋 Next step: Update frontend with working Railway URL")
