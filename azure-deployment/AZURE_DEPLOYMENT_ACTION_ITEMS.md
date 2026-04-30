# 🚀 Azure Container Apps Deployment - Action Items

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] **Azure Subscription** - Active subscription at https://portal.azure.com
- [ ] **Azure CLI** - Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
- [ ] **Docker** - Install Docker Desktop from https://www.docker.com/products/docker-desktop
- [ ] **Git** - For pushing code to Azure

---

## Phase 1: Prepare Your Environment (15 min)

### 1.1 Install Azure CLI
```powershell
# Download and install Azure CLI
winget install Microsoft.AzureCLI

# Or use MSI installer from:
# https://aka.ms/azurecli-windows/latest/msi
```

### 1.2 Login to Azure
```powershell
az login
```

### 1.3 Set your subscription
```powershell
# List your subscriptions
az account list -o table

# Set the subscription you want to use
az account set --subscription "Your-Subscription-Name"
```

---

## Phase 2: Create Azure Resources (20 min)

### 2.1 Create Resource Group
```powershell
az group create --name chatbot-rg --location eastus
```

### 2.2 Create Container Apps Environment
```powershell
# Create log analytics workspace
az monitor log-analytics workspace create `
  --resource-group chatbot-rg `
  --workspace-name chatbot-logs

# Get workspace ID
$workspaceId = (az monitor log-analytics workspace show `
  --resource-group chatbot-rg `
  --workspace-name chatbot-logs --query id -o tsv)

# Create container apps environment
az containerapp env create `
  --name chatbot-env `
  --resource-group chatbot-rg `
  --location eastus `
  --logs-workspace-id $workspaceId
```

### 2.3 Create Azure Container Registry (ACR)
```powershell
az acr create `
  --resource-group chatbot-rg `
  --name chatbotregistry `
  --sku Basic `
  --location eastus
```

### 2.4 Create Cosmos DB (MongoDB API)
```powershell
az cosmosdb create `
  --name chatbot-db `
  --resource-group chatbot-rg `
  --kind MongoDB `
  --location eastus

# Get MongoDB connection string
$cosmosKey = (az cosmosdb keys list `
  --name chatbot-db `
  --resource-group chatbot-rg `
  --query primaryConnectionString -o tsv)

Write-Output "MongoDB Connection: $cosmosKey"
```

### 2.5 Create Redis Cache
```powershell
az redis create `
  --name chatbot-redis `
  --resource-group chatbot-rg `
  --location eastus `
  --sku Basic `
  --vm-size c0

# Get Redis connection string
$redisKey = (az redis list-keys `
  --name chatbot-redis `
  --resource-group chatbot-rg `
  --query primaryKey -o tsv)

Write-Output "Redis Key: $redisKey"
```

---

## Phase 3: Build & Push Docker Images (30 min)

### 3.1 Enable admin on ACR
```powershell
az acr update -n chatbotregistry --admin-enabled true
```

### 3.2 Get ACR credentials
```powershell
$acrPassword = (az acr credential show `
  --name chatbotregistry `
  --query passwords[0].value -o tsv)
```

### 3.3 Login to ACR
```powershell
az acr login --name chatbotregistry
```

### 3.4 Build & Push Backend Image
```powershell
# Build backend image
docker build -t chatbotregistry.azurecr.io/backend:latest `
  -f azure-deployment/Dockerfile.backend ./backend

# Push to ACR
docker push chatbotregistry.azurecr.io/backend:latest
```

### 3.5 Build & Push Frontend Image
```powershell
# Build frontend image
docker build -t chatbotregistry.azurecr.io/frontend:latest `
  -f azure-deployment/Dockerfile.frontend ./

# Push to ACR
docker push chatbotregistry.azurecr.io/frontend:latest
```

### 3.6 Build & Push Admin Panel Image
```powershell
# Build admin image
docker build -t chatbotregistry.azurecr.io/admin:latest `
  -f azure-deployment/Dockerfile.admin ./admin-panel

# Push to ACR
docker push chatbotregistry.azurecr.io/admin:latest
```

---

## Phase 4: Deploy to Container Apps (20 min)

### 4.1 Deploy Backend
```powershell
az containerapp create `
  --name chatbot-backend `
  --resource-group chatbot-rg `
  --environment chatbot-env `
  --image chatbotregistry.azurecr.io/backend:latest `
  --registry-username chatbotregistry `
  --registry-password $acrPassword `
  --cpu 0.5 --memory 1Gi `
  --min-replicas 1 --max-replicas 3 `
  --transport http `
  --ingress external `
  --target-port 5000 `
  --env-vars `
    "NODE_ENV=production" `
    "MONGODB_URI=<your-cosmos-connection-string>" `
    "REDIS_URL=chatbot-redis.redis.cache.windows.net:6380" `
    "JWT_SECRET=<generate-a-secure-key>"
```

### 4.2 Deploy Frontend
```powershell
az containerapp create `
  --name chatbot-frontend `
  --resource-group chatbot-rg `
  --environment chatbot-env `
  --image chatbotregistry.azurecr.io/frontend:latest `
  --registry-username chatbotregistry `
  --registry-password $acrPassword `
  --cpu 0.25 --memory 0.5Gi `
  --min-replicas 1 --max-replicas 3 `
  --transport http `
  --ingress external `
  --target-port 80 `
  --env-vars `
    "REACT_APP_API_URL=https://chatbot-backend.<your-domain>.azurecontainerapps.io/api"
```

### 4.3 Deploy Admin Panel
```powershell
az containerapp create `
  --name chatbot-admin `
  --resource-group chatbot-rg `
  --environment chatbot-env `
  --image chatbotregistry.azurecr.io/admin:latest `
  --registry-username chatbotregistry `
  --registry-password $acrPassword `
  --cpu 0.25 --memory 0.5Gi `
  --min-replicas 1 --max-replicas 2 `
  --transport http `
  --ingress external `
  --target-port 80 `
  --env-vars `
    "REACT_APP_API_URL=https://chatbot-backend.<your-domain>.azurecontainerapps.io/api"
```

---

## Phase 5: Configure & Test (15 min)

### 5.1 Update CORS settings on Backend
```powershell
az containerapp update `
  --name chatbot-backend `
  --resource-group chatbot-rg `
  --min-replicas 1 `
  --max-replicas 5
```

### 5.2 Get the application URLs
```powershell
# Get backend URL
$backendUrl = (az containerapp show `
  --name chatbot-backend `
  --resource-group chatbot-rg `
  --query properties.provisioningState -o tsv)

# Get frontend URL
$frontendUrl = (az containerapp show `
  --name chatbot-frontend `
  --resource-group chatbot-rg `
  --query properties.fqdn -o tsv)

Write-Output "Frontend URL: https://$frontendUrl"
Write-Output "Backend API: https://$backendUrl/api"
```

### 5.3 Test the application
```powershell
# Test health endpoint
Invoke-WebRequest "https://<backend-fqdn>/api/health"

# Test chat endpoint
$body = @{
    userId = "test-user"
    message = "hello"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://<backend-fqdn>/api/chat/session" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## Phase 6: Set Up CI/CD (Optional - 20 min)

### 6.1 Create GitHub Actions workflow
```powershell
# Create .github/workflows directory
mkdir -p .github/workflows

# Create deployment workflow file (see azure-deployment/github-actions.yml)
```

### 6.2 Set up GitHub secrets
```
Go to: https://github.com/<your-org>/<your-repo>/settings/secrets

Add these secrets:
- AZURE_CREDENTIALS: Your Azure service principal JSON
- AZURE_CONTAINER_REGISTRY: chatbotregistry
- AZURE_RESOURCE_GROUP: chatbot-rg
```

---

## 📋 Complete Action Items Summary

| Phase | Task | Time | Status |
|-------|------|------|--------|
| **1. Prepare** | Install Azure CLI | 5 min | ⬜ |
| **1. Prepare** | Login to Azure | 2 min | ⬜ |
| **1. Prepare** | Set subscription | 3 min | ⬜ |
| **2. Create Resources** | Create Resource Group | 2 min | ⬜ |
| **2. Create Resources** | Create Container Apps Env | 5 min | ⬜ |
| **2. Create Resources** | Create ACR | 3 min | ⬜ |
| **2. Create Resources** | Create Cosmos DB | 5 min | ⬜ |
| **2. Create Resources** | Create Redis Cache | 5 min | ⬜ |
| **3. Build Images** | Build & Push Backend | 10 min | ⬜ |
| **3. Build Images** | Build & Push Frontend | 10 min | ⬜ |
| **3. Build Images** | Build & Push Admin | 10 min | ⬜ |
| **4. Deploy** | Deploy Backend | 5 min | ⬜ |
| **4. Deploy** | Deploy Frontend | 5 min | ⬜ |
| **4. Deploy** | Deploy Admin | 5 min | ⬜ |
| **5. Test** | Configure & Test | 15 min | ⬜ |
| **6. CI/CD** | Set up GitHub Actions | 20 min | ⬜ |

---

## 🔧 Quick Commands Reference

### Login
```powershell
az login
az acr login --name chatbotregistry
```

### Check status
```powershell
az containerapp list --resource-group chatbot-rg
az acr repository list --name chatbotregistry
```

### Update scaling
```powershell
az containerapp update `
  --name chatbot-backend `
  --resource-group chatbot-rg `
  --min-replicas 2 `
  --max-replicas 10
```

### View logs
```powershell
az containerapp logs show `
  --name chatbot-backend `
  --resource-group chatbot-rg `
  --tail 100
```

### Restart
```powershell
az containerapp revision restart `
  --name chatbot-backend `
  --resource-group chatbot-rg
```

---

## 💰 Cost Estimation

| Service | Tier | Estimated Cost/month |
|----------|------|---------------------|
| Container Apps | Basic | $15-30 |
| Container Apps Environment | Basic | $10 |
| Azure Container Registry | Basic | $5 |
| Cosmos DB (MongoDB) | Basic | $25 |
| Redis Cache | Basic | $20 |
| **Total** | | **$75-90/month** |

---

## 🆘 Troubleshooting

### Image pull failures
```powershell
# Check if ACR admin is enabled
az acr show -n chatbotregistry --query adminEnabled

# Regenerate credentials if needed
az acr credential regenerate -n chatbotregistry
```

### Container app errors
```powershell
# View logs
az containerapp logs show --name chatbot-backend --resource-group chatbot-rg --tail 50

# Check revision
az containerapp revision list --name chatbot-backend --resource-group chatbot-rg
```

### Connection issues
```powershell
# Test MongoDB connection
az cosmosdb show -n chatbot-db -g chatbot-rg

# Test Redis connection
az redis show -n chatbot-redis -g chatbot-rg
```

---

## ✅ Deployment Complete!

Once all phases are done, your chatbot will be live at:
- **Frontend**: `https://<frontend-fqdn>`
- **Admin Panel**: `https://<admin-fqdn>`
- **API**: `https://<backend-fqdn>/api`

---

## 📞 Next Steps

1. **Customize Intents** - Add your business-specific intents via Admin Panel
2. **Set up Monitoring** - Configure Application Insights alerts
3. **Configure Domain** - Add custom domain if needed
4. **Set up SSL** - Enable HTTPS for custom domains

---

**Ready to deploy? Start with Phase 1!** 🚀