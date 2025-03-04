FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && apt-get install -y libpq-dev gcc
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire 'app' folder into the container
COPY app /app

# Set the working directory inside the container to /app
WORKDIR /app

CMD ["python", "/app/app.py"]
