# help: Show this help
# find all lines with two # | and : | exclude fgrep | extract name and description | create table
help:
	@echo
	@echo "Smartlook Relay Proxy"
	@echo
	@fgrep -h "#" $(MAKEFILE_LIST) | fgrep : | fgrep -v fgrep | sed -e $$'s/#[[:blank:]]*\([^:]*\):\(.*\)/\\1##\\2/' | column -t -s '##'
	@echo

# clean: Remove all local build files & clean node_modules
clean:
	@echo "Cleaning build..."
	rm -rf ./build; rm -rf ./node_modules;
	docker-compose down

# dev: Start dev server in Docker
# dev: use 'build=yes' to rebuild (useful after installing new dependencies)
dev:
ifeq ($(build),yes)
	@echo "Rebuilding and starting development server..."
	docker-compose -f docker-compose.dev.yml up --build --remove-orphans
else
	@echo "Starting development server..."
	docker-compose -f docker-compose.dev.yml up
endif

# lint: Lint all files (runs ESLint & Prettier)
lint:
	@echo "Linting..."
	npm run lint

# build: Build Docker image for production
build:
	@echo "Building for production..."
	docker build -t smartlook-relay-proxy .

# up: Run Docker image in production mode. Specify local port by setting 'port=<number>'
up:
ifdef port
	@echo "Running Docker image..."
	docker run --env-file ./.env -d -p $(port):9000 --name smartlook-relay-proxy smartlook-relay-proxy
else
	$(error port is required. Usage: 'make up port=<number>'')
endif
