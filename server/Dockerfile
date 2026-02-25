FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Create temp directory for file uploads
RUN mkdir -p public/temp

EXPOSE 8000

# Default: run the API server
CMD ["node", "src/index.js"]
