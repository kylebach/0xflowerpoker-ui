FROM node:16-alpine
RUN apk add alpine-sdk python3
RUN mkdir /app
WORKDIR /app
COPY . /app
CMD ["npm", "start"]
