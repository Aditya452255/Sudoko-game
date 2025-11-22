FROM node:18-alpine
WORKDIR /app
COPY package.json package.json
RUN npm install --production
COPY public ./public
COPY src ./src
COPY server.js ./server.js
EXPOSE 7000
CMD ["node","server.js"]
