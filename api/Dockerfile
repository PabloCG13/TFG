FROM node:23.6.1-alpine3.20

RUN mkdir -p /app
WORKDIR /app

RUN npm install nodemon -g

EXPOSE 5000
CMD echo 1; npm install pg pg-promise; echo 2; npx nodemon app.js
