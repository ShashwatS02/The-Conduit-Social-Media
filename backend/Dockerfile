# backend/Dockerfile

# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# You could run tests or other build steps here

# --- Production Stage ---
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 5000
CMD ["npm", "start"]