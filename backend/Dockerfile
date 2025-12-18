FROM node:18-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-slim AS runner

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

CMD ["node", "dist/app.js"]
