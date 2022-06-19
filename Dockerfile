FROM node:alpine
RUN mkdir /app
WORKDIR /app
COPY . /app
WORKDIR /app/0xflowerpoker
RUN npm install
RUN npx hardhat compile
WORKDIR /app
RUN npm install
CMD ["npm", "start"]
