# Use the Node.js LTS version as the base image
FROM node:lts

WORKDIR /app

COPY . .

ENV PORT=3000
ENV DATABASE_HOST=localhost
ENV DATABASE_PORT=3306
ENV DATABASE_USER=aji-user
ENV DATABASE_PASSWORD=your_password
ENV DATABASE_NAME=aji-db
ENV TYPEORM_SYNC=true

RUN npm install

RUN npm run build

EXPOSE $PORT

CMD ["npm", "run", "start:prod"]