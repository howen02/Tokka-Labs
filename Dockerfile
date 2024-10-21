# Base image for frontend build
FROM oven/bun:1 as frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lockb ./
RUN rm -rf node_modules bun.lockb
RUN bun install
COPY frontend/ .
RUN bun run build

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

# Clean up potential cache
RUN rm -rf /app/frontend/node_modules /app/frontend/.vite /app/backend/node_modules
