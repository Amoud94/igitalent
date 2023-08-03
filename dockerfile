FROM node:current-alpine

# using pm2 to serve next.js application
RUN npm install --global pm2

# this is the directory we use in our container
WORKDIR /usr/app

COPY ./ ./

WORKDIR /usr/app/vue-frontend
RUN npm install  && npm run build

WORKDIR /usr/app/node-backend
RUN npm install

EXPOSE 3000
USER node

# run the application using pm2
CMD [ "pm2-runtime", "start", "npm", "--", "start" ]