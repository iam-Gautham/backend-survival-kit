# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src ./src

# Build TypeScript to JavaScript in /dist
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy compiled JavaScript code from builder stage
COPY --from=builder /app/dist ./dist

# Expose server port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Run the compiled API application
CMD ["node", "dist/index.js"]
