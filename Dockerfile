FROM node:20-alpine

# Install compatibility libraries for sharp on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build the Next.js app
RUN npm run build

# Start the application
EXPOSE 3000
CMD ["npm", "start"]
