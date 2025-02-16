FROM node:23.6.1-alpine3.20

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g truffle

RUN npm install web3

RUN npm install nodemon -g

RUN npm install express

EXPOSE 8545
CMD npm install && npx nodemon blockchain_api.js && /bin/sh
