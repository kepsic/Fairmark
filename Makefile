.PHONY: help install dev build start clean test

# Default target
help:
	@echo "Fairmark - Group Work Tracker"
	@echo ""
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build for production"
	@echo "  make start      - Start production server"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Remove node_modules and build files"
	@echo ""

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Start development server
dev: install
	@echo "Starting development server..."
	npm run dev

# Build for production
build: install
	@echo "Building for production..."
	npm run build

# Start production server
start: build
	@echo "Starting production server..."
	npm run start

# Run tests
test: install
	@echo "Running tests..."
	npm test

# Clean build artifacts and dependencies
clean:
	@echo "Cleaning project..."
	rm -rf node_modules .next
	@echo "Clean complete!"
