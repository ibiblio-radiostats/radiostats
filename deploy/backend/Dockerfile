FROM python

RUN apt-get update -y && \
    apt-get install -y apt-transport-https apt-utils build-essential libexpat1-dev libpcre3-dev apache2-dev apache2 libssl-dev nano && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys CC86BB64 && \
    echo "deb http://ppa.launchpad.net/rmescandon/yq/ubuntu focal main" >> /etc/apt/sources.list && \
    apt-get update -y && \
    apt-get install -y yq
COPY backend/requirements.txt /app/requirements.txt
WORKDIR /app

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
COPY backend /app

RUN groupadd -r django && useradd --no-log-init -r -g django django
RUN mkdir -p sils_reports
RUN chown -R django:django sils_reports
COPY deploy/backend/start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh
