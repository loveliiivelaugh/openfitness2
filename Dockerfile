FROM oven/bun:latest

# Set working directory
WORKDIR /backend

# Copy package.json and yarn.lock/npm package.json to the container
COPY ./backend/package.json .

# Install dependencies
RUN bun install

# Copy the rest of the application code to the container
COPY . .

# Command to run the application
CMD ["bun", "run", "src/index.ts"]

# Expose port (if your application listens on a different port, update it here)
EXPOSE 5001