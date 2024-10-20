#!/bin/bash

echo "Setting up Tokka-Labs locally..."
# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps

# Install backend dependencies
echo "Installing backend dependencies..."
cd ../backend
bun install

# Set up environment variables
echo "Setting up environment variables..."
cp .env.example .env
echo "Please edit the .env file in the backend directory with your specific configurations."

# Start the development servers
echo "Starting development servers..."
echo "Starting backend..."
bun run dev &

echo "Starting frontend..."
cd ../frontend
npm run dev &

echo "Setup complete! Open your browser and navigate to http://localhost:5173 to view the application."