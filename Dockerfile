FROM node:20.11.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn db:generate

EXPOSE 3000

RUN yarn build


CMD [ "node", "dist/src/main.js" ]