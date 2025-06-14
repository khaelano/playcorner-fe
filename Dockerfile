FROM node:slim AS builder
WORKDIR /temp/
COPY package.json package-lock.json ./

RUN npm install

COPY ./ ./
RUN npm run build

# Serve stage
FROM nginx:stable-alpine AS deploy

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /temp/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
