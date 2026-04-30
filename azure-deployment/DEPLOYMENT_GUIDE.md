# Azure Deployment Guide

## Architecture Overview

This chatbot system is designed to be deployed on Microsoft Azure using the following services:

### Azure Services Used
- **Azure App Service** - Backend API hosting
- **Azure Database for MongoDB** - Conversation history & training data
- **Azure Cache for Redis** - Session caching
- **Azure Blob Storage** - File uploads & models
- **Azure Cognitive Services** - NLP enhancement
- **Azure Application Insights** - Monitoring & logging

## Prerequisites

1. **Azure Subscription** - Active subscription
2. **Azure CLI** - Install latest version
3. **Docker** - For containerized deployment
4. **Git** - Version control

## Setup Steps

### 1. Create Azure Resources

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name chatbot-rg \
  --location eastus

# Create App Service Plan
az appservice plan create \
  --name chatbot-plan \
  --resource-group chatbot-rg \
  --sku B1 \
  --is-linux

# Create Web App for Backend
az webapp create \
  --resource-group chatbot-rg \
  --plan chatbot-plan \
  --name chatbot-api \
  --runtime "NODE|18-lts"

# Create MongoDB Server
az cosmosdb create \
  --name chatbot-db \
  --resource-group chatbot-rg \
  --kind MongoDB \
  --locations regionName=eastus failoverPriority=0
```

### 2. Configure Database

```bash
# Get connection string
az cosmosdb keys list \
  --name chatbot-db \
  --resource-group chatbot-rg

# Set App Settings
az webapp config appsettings set \
  --resource-group chatbot-rg \
  --name chatbot-api \
  --settings MONGODB_URI="<connection-string>"
```

### 3. Deploy Backend

```bash
# Build Docker image
docker build -t chatbot-api:latest ./backend

# Login to Azure Container Registry
az acr login --name chatbotregistry

# Tag image
docker tag chatbot-api:latest \
  chatbotregistry.azurecr.io/chatbot-api:latest

# Push to registry
docker push chatbotregistry.azurecr.io/chatbot-api:latest

# Deploy to App Service
az webapp create \
  --resource-group chatbot-rg \
  --plan chatbot-plan \
  --name chatbot-api \
  --deployment-container-image-name-user <username> \
  --deployment-container-image-name <image-name> \
  --deployment-container-image-name-password <password>
```

### 4. Deploy Frontend

```bash
# Build React app
cd frontend
npm run build

# Deploy to Static Web Apps
az staticwebapp create \
  --name chatbot-ui \
  --resource-group chatbot-rg \
  --source . \
  --location eastus \
  --branch main \
  --token <github-token>
```

### 5. Set Environment Variables

```bash
# Backend environment variables
az webapp config appsettings set \
  --resource-group chatbot-rg \
  --name chatbot-api \
  --settings \
  MONGODB_URI="<cosmosdb-uri>" \
  JWT_SECRET="<secure-key>" \
  AZURE_STORAGE_CONNECTION_STRING="<storage-string>" \
  AZURE_COGNITIVE_SERVICES_KEY="<cognitive-key>" \
  NODE_ENV="production"
```

## Deployment Configuration Files

### Dockerfile for Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/src ./src

EXPOSE 5000

CMD ["node", "src/index.js"]
```

### Azure DevOps Pipeline (.github/workflows/deploy.yml)

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'chatbot-api'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: './backend'

      - name: Deploy Frontend
        uses: azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: './frontend'
          output_location: 'build'
```

## Monitoring & Logging

### Application Insights Setup

```bash
# Create Application Insights
az monitor app-insights component create \
  --resource-group chatbot-rg \
  --app chatbot-insights

# Link to App Service
az webapp config appsettings set \
  --resource-group chatbot-rg \
  --name chatbot-api \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="<key>"
```

### Metrics to Monitor

- Response Time (target: <200ms)
- Error Rate (target: <1%)
- Bot Success Rate (target: >95%)
- Active Sessions
- Message Processing Rate

## Scaling Configuration

```bash
# Enable autoscaling
az monitor autoscale create \
  --resource-group chatbot-rg \
  --resource-type "Microsoft.Web/serverfarms" \
  --resource-name chatbot-plan \
  --min-count 1 \
  --max-count 5 \
  --count 2
```

## Security Best Practices

1. **SSL/TLS**: Enable HTTPS
```bash
az webapp config ssl bind \
  --resource-group chatbot-rg \
  --name chatbot-api \
  --certificate-thumbprint <thumbprint>
```

2. **API Keys**: Use Key Vault
```bash
az keyvault create \
  --resource-group chatbot-rg \
  --name chatbot-vault

az keyvault secret set \
  --vault-name chatbot-vault \
  --name jwt-secret \
  --value <secret>
```

3. **Network Security**: Configure firewall rules
```bash
az webapp config access-restriction add \
  --resource-group chatbot-rg \
  --name chatbot-api \
  --rule-name AllowVNet \
  --action Allow \
  --vnet-name chatbot-vnet \
  --subnet chatbot-subnet
```

## Cost Optimization

- Use B1 App Service tier for development
- Scale to S1 for production
- Use Redis for caching to reduce DB calls
- Archive old conversations to Blob Storage
- Use CDN for static assets

## Disaster Recovery

```bash
# Setup backup
az sql server backup create \
  --resource-group chatbot-rg \
  --name chatbot-db \
  --backup-name chatbot-backup-$(date +%Y%m%d)
```

## Rollback Strategy

```bash
# Swap staging and production slots
az webapp deployment slot swap \
  --resource-group chatbot-rg \
  --name chatbot-api \
  --slot staging
```

---

**Last Updated**: April 28, 2026  
**Version**: 1.0
