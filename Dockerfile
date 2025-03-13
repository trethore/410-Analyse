FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update 
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]