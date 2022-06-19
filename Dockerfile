FROM node:16-bullseye-slim
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN git submodule update --init
WORKDIR /app/0xflowerpoker
RUN npm install
RUN ./node_modules/.bin/hardhat compile
WORKDIR /app
RUN npm install
CMD ["npm", "start"]
