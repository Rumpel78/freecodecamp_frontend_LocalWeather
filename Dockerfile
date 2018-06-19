FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./server/package.json /usr/src/app/
COPY ./server/yarn.lock /usr/src/server/
RUN yarn --pure-lockfile
COPY ./server/ /usr/src/app/

RUN mkdir -p /tmp/client
WORKDIR /tmp/client
COPY ./client/package.json /tmp/client/
COPY ./client/yarn.lock /tmp/client/
RUN yarn --pure-lockfile
COPY ./client/ /tmp/client/

RUN yarn build
RUN cp build/* /usr/src/app/public -R
RUN rm /tmp/client -rf
WORKDIR /usr/src/app

EXPOSE 3000
CMD [ "yarn", "start" ]
