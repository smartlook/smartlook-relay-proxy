# help: Show this help
# find all lines with two # | and : | exclude fgrep | extract name and description | create table
help:
	@echo
	@echo "Smartlook Relay"
	@echo
	@fgrep -h "#" $(MAKEFILE_LIST) | fgrep : | fgrep -v fgrep | sed -e $$'s/#[[:blank:]]*\([^:]*\):\(.*\)/\\1##\\2/' | column -t -s '##'
	@echo

# clean: Remove all local build files & clean node_modules
clean:
	@echo "Cleaning build..."
	rm -r ./build; rm -r ./node_modules;

# up-dev: Start dev server in Docker
up-dev:
	@echo "Starting locally..."
	docker-compose -f docker-compose.dev.yml up

# up-dev-build: Rebuild & start dev server in Docker (useful after installing new dependencies)
up-dev-build:
	@echo "Rebuilding and starting locally..."
	docker-compose -f docker-compose.dev.yml up --build --remove-orphans
