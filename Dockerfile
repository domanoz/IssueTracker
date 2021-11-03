FROM node:17-slim

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

CMD /wait && npm run test && npm run start