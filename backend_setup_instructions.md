# Instructions for creating backend-only repo

## 1. Create New GitHub Repo
- Name: `sparknet-backend`
- Private or Public (your choice)

## 2. Copy Backend Files Only
Copy these files to the new repo root:
- fire-pred-mvp-main/main.py
- fire-pred-mvp-main/mvp_service.py  
- fire-pred-mvp-main/requirements.txt
- fire-pred-mvp-main/*.pkl (model files)
- fire-pred-mvp-main/*.dill (explainer files)

## 3. Add Railway.toml to Root
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "ON_FAILURE"

[services.env]
PORT = "8000"
```

## 4. Deploy to Railway
- Create new Railway project
- Connect to `sparknet-backend` repo
- Deploy

## 5. Update Frontend
Change frontend API URL to: `https://your-backend-url.railway.app/api/explain`
