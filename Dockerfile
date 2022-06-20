FROM node:16-alpine
RUN apk add alpine-sdk python3
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]
