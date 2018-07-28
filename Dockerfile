FROM index.alauda.cn/library/alpine

WORKDIR /app

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories && apk --no-cache add tzdata nodejs && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
ADD kubectl /usr/local/bin/
ADD package.json /app/
ADD node_modules /app/node_modules
RUN npm install && chmod +x /usr/local/bin/kubectl

ADD public /app/public
ADD server /app/server

EXPOSE 4200 50000
CMD node server/index.js
