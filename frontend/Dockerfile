FROM oven/bun:latest

# Set working directory
WORKDIR /frontend

EXPOSE 3001

COPY ./frontend/package.json .

RUN bun install

COPY ./frontend .

CMD ["bun", "run", "dev"]
