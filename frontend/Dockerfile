# Stage 1: Build frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend files
COPY . .

# Accept build-time environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build production assets
RUN npm run build

# Stage 2: Serve static files
FROM node:20-alpine

WORKDIR /app

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Copy build output from previous stage
COPY --from=builder /app/dist ./dist

# Expose the port Railway will route to
EXPOSE 3000

# Use PORT environment variable from Railway at runtime
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
