FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

CMD ["node", "src/server.js"]
