FROM node:12-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

RUN npm i -g pm2

COPY . .
EXPOSE 3000

CMD ["pm2-runtime", "index.js"]