FROM node:20-alpine
COPY . /app/
WORKDIR /app
RUN apk add openssl
RUN npm ci && npx prisma generate
RUN ["npm", "run", "build"]
CMD ["npm", "run", "start"]
