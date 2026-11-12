FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN cp env-example-ci .env
RUN npm run build
RUN sed -i 's/\r//g' startup.ci.sh && chmod +x startup.ci.sh

CMD ["./startup.ci.sh"]
