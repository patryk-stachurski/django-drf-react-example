FROM python:3.7.4-alpine

WORKDIR /usr/src

RUN apk add --update --no-cache \
    g++ \
    gcc \
    build-base \
    jpeg-dev \
    zlib-dev

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
RUN pip install pipenv

COPY . .

RUN pipenv install --skip-lock --system
