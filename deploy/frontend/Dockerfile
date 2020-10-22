FROM node:current-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN yarn import --network-timeout 100000 && rm package-lock.json
RUN yarn install --network-timeout 100000
RUN yarn add react-scripts

COPY frontend ./
RUN yarn build

FROM nginx:stable-alpine
RUN apk add bash && apk add yq --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
COPY --from=build /app/build /usr/share/nginx/html
COPY deploy/frontend/site.template /etc/nginx/conf.d/default.template
COPY deploy/frontend/env.sh ./
COPY deploy/frontend/start.sh ./
RUN chmod +x ./env.sh && chmod +x ./start.sh
CMD ./start.sh
