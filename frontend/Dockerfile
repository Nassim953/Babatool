FROM node:alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci && npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]


