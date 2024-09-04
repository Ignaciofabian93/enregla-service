FROM node:22

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

# Copy SSL certificates into the container
COPY /etc/letsencrypt/live/www.enreglaintegral.cl/fullchain.pem /etc/ssl/certs/
COPY /etc/letsencrypt/live/www.enreglaintegral.cl/privkey.pem /etc/ssl/private/

EXPOSE 4000

CMD [ "npm", "start" ]