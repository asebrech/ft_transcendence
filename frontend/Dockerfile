# Stage 1: build
FROM node:18.13.0 AS development

WORKDIR /ft_transcendence/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@14.2.10

COPY . .

RUN npm run build

EXPOSE 4200
