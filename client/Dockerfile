FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Faster and reproducible install
RUN npm ci

COPY . .

ARG VITE_BACKEND_URI=http://backend:8080/api/v1
ENV VITE_BACKEND_URI=$VITE_BACKEND_URI

RUN npm run build


FROM nginx:stable-alpine AS runtime

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]