FROM node:latest
WORKDIR /app

#Node
COPY ./server.js ./server.js
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./controller ./controller
COPY ./routes ./routes

#Static items
COPY ./public ./public
COPY ./private ./private

# Database
COPY ./db ./db

#Views
COPY ./src ./src

RUN npm install
RUN yarn install

# Create stylesheet used in the final project
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
