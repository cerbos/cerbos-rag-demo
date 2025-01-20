FROM node:20-alpine
WORKDIR /app
RUN apk add openssl
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY . /app/
RUN npm ci && npx prisma generate
RUN ["npm", "run", "build"]
CMD ["npm", "run", "start"]
