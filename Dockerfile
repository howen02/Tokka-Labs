# Base image for frontend build
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN rm -rf node_modules package-lock.json && npm cache clean --force
RUN npm install --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Base image for the backend
FROM oven/bun:1 as backend-build
WORKDIR /app/backend
COPY backend/package.json backend/bun.lockb ./
RUN bun install
COPY backend/ .

# Combine frontend and backend
FROM oven/bun:1 as final
WORKDIR /app

# Copy frontend build output and backend source
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist
COPY --from=backend-build /app/backend /app/backend

# Install Redis client for the backend
RUN cd /app/backend && bun add redis

# Clean up potential cache
RUN rm -rf /app/frontend/node_modules /app/frontend/.vite /app/backend/node_modules

# Set environment variables
ENV NODE_ENV=production

# Expose ports for frontend and backend
EXPOSE 4173 3000

# Start both frontend and backend with logs
CMD ["sh", "-c", "echo 'Starting frontend...' && cd /app/frontend && npm run start & echo 'Frontend running on port 5173' && echo 'Starting backend...' && cd /app/backend && bun run start && echo 'Backend running on port 3000'"]
