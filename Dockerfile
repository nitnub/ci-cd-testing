FROM node:18.12.1-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app
# 
RUN npm run build

COPY entrypoint.sh /entrypoint.sh

RUN ["chmod", "+x", "/entrypoint.sh"]

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 3000

CMD [ "npm", "start" ]
# 
# EXPOSE 3000

# CMD ["npm", "start"]
