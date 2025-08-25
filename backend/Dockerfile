FROM python:3.11-slim

WORKDIR /app

# for the healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE ${VITE__RUN__SERVER_PORT}

CMD ["python3", "main.py"]
