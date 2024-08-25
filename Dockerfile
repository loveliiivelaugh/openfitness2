FROM oven/bun:latest

# Set working directory
WORKDIR /backend

# Copy package.json and yarn.lock/npm package.json to the container
COPY ./backend/bun.lockb . 
COPY ./backend/package.json .

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code to the container
COPY ./backend .

# Command to run the application
CMD ["bun", "run", "dev"]

# Expose port (if your application listens on a different port, update it here)
EXPOSE 5001