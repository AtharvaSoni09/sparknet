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

print("🔍 Testing Render backend API...")
try:
    response = requests.post(
        "https://sparknet-fire-potential-mvp.onrender.com/api/explain",
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=15
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        result = response.json()
        print("✅ SUCCESS! API Response:")
        print(json.dumps(result, indent=2))
        
        print(f"Prediction: {result.get('prediction_acres', 'N/A'):.2f} acres")
        print(f"LIME Features: {len(result.get('lime_explanation', []))}")
        
        for i, item in enumerate(result.get('lime_explanation', [])[:3]):
            print(f"  {i+1}. {item.get('feature', 'unknown')}: {item.get('weight', 0):.4f}")
    else:
        print(f"❌ Error Response: {response.text}")
        
except requests.exceptions.Timeout:
    print("❌ TIMEOUT - API not responding")
except requests.exceptions.ConnectionError:
    print("❌ CONNECTION ERROR - Can't reach API")
except Exception as e:
    print(f"❌ Unexpected Error: {e}")

print("\n🎯 Test completed!")
