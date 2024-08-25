FROM oven/bun

# Set working directory
WORKDIR /app

EXPOSE 5001

# Copy the lock and package file
COPY bun.lockb . 
COPY package.json . 

# Install dependencies
RUN bun install --frozen-lockfile

COPY . ./ 

CMD ["bun", "run",  "dev"]
