# Base image for Node.js with TypeScript support
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (from package.json)
RUN npm install

# Copy remaining project files (excluding node_modules)
COPY . .

# Build the Next.js app (production mode)
RUN npm run build

# Expose Next.js port (default: 3000)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "dev"]
