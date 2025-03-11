FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app

RUN python /app/populate.py

CMD ["python", "/app/app.py"]
