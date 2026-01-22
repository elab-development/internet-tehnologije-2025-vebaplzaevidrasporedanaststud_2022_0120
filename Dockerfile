FROM node:20-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache tzdata
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server after database setup
CMD ["sh", "-c", "npm run db:setup && npm run dev"]
