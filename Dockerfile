FROM node:18 as builder

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY prisma ./prisma/

RUN npm install
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18-slim

RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends

ENV NODE_ENV production
ENV JWT_SECRET= 
ENV DATABASE_URL= 
ENV POSTGRES_USER= 
ENV POSTGRES_PASSWORD= 
ENV POSTGRES_DB= 

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/package.json .
COPY --chown=node:node --from=builder /usr/src/app/package-lock.json .
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["dumb-init", "npm", "run" ,"start:migrate:prod"]