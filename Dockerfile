FROM node:16-alpine
RUN apk add alpine-sdk python3
RUN mkdir /app
WORKDIR /app
COPY . /app
WORKDIR /app/0xflowerpoker
RUN npm install
RUN ./node_modules/.bin/hardhat compile
WORKDIR /app
RUN npm install
CMD ["npm", "start"]
