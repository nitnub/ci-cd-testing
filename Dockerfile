FROM node:18.12.1-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]
