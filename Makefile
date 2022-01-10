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

# up-dev: Start dev server in Docker
# up-dev: use 'build=yes' to rebuild (useful after installing new dependencies)
up-dev:
ifeq ($(build),yes)
	@echo "Rebuilding and starting development server..."
	docker-compose -f docker-compose.dev.yml up --build --remove-orphans
else
	@echo "Starting development server..."
	docker-compose -f docker-compose.dev.yml up
endif

# build: Build Docker image for production
build:
	@echo "Building for production..."
	docker build -t smartlook-proxy .

# up: Run Docker image in production mode. Specify local port by setting 'port=<number>'
up:
ifdef port
	@echo "Running Docker image..."
	docker run --env-file ./.env -d -p $(port):9000 --name smartlook-proxy-prod smartlook-proxy
else
	$(error port is required. Usage: 'make up port=<number>'')
endif
