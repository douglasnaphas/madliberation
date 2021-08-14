
FROM douglasnaphas/aws-codebuild-nodejs-10.1.0
WORKDIR /work
COPY App.itest.js package.json package-lock.json ./
RUN mkdir node_modules
COPY node_modules node_modules/
RUN npm install && \
    npm install puppeteer && \
    apt-get update && \
    apt-get install -y libx11-xcb-dev libxtst6
RUN apt-get install -y libnss3-dev
RUN apt-get install -y libxss1
RUN apt-get install -y libasound2
CMD node App.itest.js https://madliberationgame.com
RUN apt-get install -y libatk-bridge2.0-0
RUN apt-get install -y libgtk-3-0
