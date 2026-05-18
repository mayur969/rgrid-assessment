FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Needed for native packages like bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Faster + reproducible installs
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY env.ts ./env.ts

RUN npx tsc


FROM node:22-alpine AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

# Install only production deps
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/src/server.js"]