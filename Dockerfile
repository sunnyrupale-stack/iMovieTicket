# ==========================================
# IMovies - Production Multi-Stage Dockerfile
# ==========================================

# 1. Build Client Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# 2. Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install Server Dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy built frontend assets from client-builder into client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# Root package.json
COPY package*.json ./

EXPOSE 5000

CMD ["node", "server/server.js"]
