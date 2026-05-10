FROM node:22-alpine
RUN mkdir /backend
COPY . /backend
WORKDIR /backend
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]