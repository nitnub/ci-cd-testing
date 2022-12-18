FROM node:18.12.1-alpine

ENV NODE_ENV production

# WORKDIR /app # It's recommended to not use the WORKDIR instruction in your Dockerfile -GitHub documentation

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]
