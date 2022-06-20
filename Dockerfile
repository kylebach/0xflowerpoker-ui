FROM node:16-alpine
RUN apk add alpine-sdk python3
RUN mkdir /app
COPY . /app
WORKDIR /app/0xflowerpoker
RUN npm install
RUN ./node_modules/.bin/hardhat compile
WORKDIR /app
RUN npm install
RUN npm run build
CMD ["./node_modules/.bin/serve", "-s", "build"]
