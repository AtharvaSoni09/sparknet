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

# Test the working Railway URL
base_url = "https://magnificent-communication.railway.app"

print(f"🎯 Testing Railway API at: {base_url}")

# Test different endpoints
endpoints = [
    "/api/explain",
    "/explain", 
    "/predict"
]

for endpoint in endpoints:
    try:
        print(f"\n🔍 Testing: {base_url}{endpoint}")
        response = requests.post(f"{base_url}{endpoint}", json=test_data, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS! API working!")
            print(f"   Prediction: {result.get('prediction_acres', 'N/A'):.2f} acres")
            print(f"   LIME features: {len(result.get('lime_explanation', []))}")
            print(f"   🎯 Your working API URL: {base_url}{endpoint}")
            break
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Failed: {e}")

print(f"\n📋 Next: Update frontend to use: {base_url}/explain")
