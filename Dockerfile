FROM node:20-alpine

RUN npm install -g nodemon ts-node

WORKDIR /api

COPY package*.json .

RUN npm install 

COPY . .

CMD [ "npm", "run", "dev" ]


