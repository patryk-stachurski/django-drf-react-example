# Build frontend files with React and Node
FROM node:12.8.1-alpine as frontend-stage

ARG REACT_APP_API_BASE_URL

WORKDIR /app

COPY ./frontend/ .

RUN npm install
RUN REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL npm run build

# Nginx server
FROM nginx:1.17.2-alpine

COPY --from=frontend-stage /app/build/ /www

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d

ADD https://raw.githubusercontent.com/certbot/certbot/master/certbot/ssl-dhparams.pem /etc/nginx/certbot/conf/ssl-dhparams.pem
ADD https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/tls_configs/options-ssl-nginx.conf /etc/nginx/conf.d/
