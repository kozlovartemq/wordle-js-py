FROM python:3.11-slim

WORKDIR /app

# for the healthcheck
RUN apk add --no-cache curl

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE ${VITE__RUN__SERVER_PORT}

CMD ["python3", "main.py"]