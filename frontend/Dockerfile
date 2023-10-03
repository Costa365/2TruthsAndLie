FROM node:18.10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./ ./
RUN npm install
EXPOSE 3000

ENV NODE_OPTIONS=--openssl-legacy-provider

CMD [ "npm", "start" ]