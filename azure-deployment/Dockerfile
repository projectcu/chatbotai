FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/src ./src

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/index.js"]
