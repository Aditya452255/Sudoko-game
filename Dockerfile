FROM node:18-alpine
WORKDIR /app

# copy package.json from web and install dependencies
COPY web/package.json ./package.json
RUN npm install --production

# copy application files
COPY web/public ./public
COPY web/src ./src
COPY web/server.js ./server.js

EXPOSE 7000
CMD ["node","server.js"]
