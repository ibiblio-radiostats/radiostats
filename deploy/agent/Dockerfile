FROM python

COPY agent/requirements.txt /app/requirements.txt
WORKDIR /app

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
COPY agent /app

RUN groupadd -r django && useradd --no-log-init -r -g django django
COPY deploy/agent/start.sh ./
RUN chmod +x ./start.sh
CMD ./start.sh
