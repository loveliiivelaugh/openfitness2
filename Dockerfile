FROM node:18-alpine

# Set working directory
WORKDIR /backend/src

# Copy package.json and yarn.lock/npm package.json to the container
COPY ./backend/package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Command to run the application
CMD ["node", "index.ts"]

# Expose port (if your application listens on a different port, update it here)
EXPOSE 3001