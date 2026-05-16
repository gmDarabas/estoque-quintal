FROM node:22.14

WORKDIR /app

COPY . .

RUN npm install -g typeorm ts-node

EXPOSE 8080 