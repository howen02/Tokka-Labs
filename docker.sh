#!/bin/bash

echo "Setting up Tokka-Labs with Docker..."

# Ensure Docker and Docker Compose are installed
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null
then
    echo "Docker and/or Docker Compose are not installed. Please install them and try again."
    exit 1
fi

# Build and start the containers
echo "Building and starting Docker containers..."
docker-compose up --build -d

echo "Setup complete! The application will be available at http://localhost:4173"
echo "To stop the containers, run: docker-compose down"