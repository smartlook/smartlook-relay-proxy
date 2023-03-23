PROJECT_NAME	:= smartlook-relay-proxy

NPM_BIN			:= ./node_modules/.bin

TSC				:= $(NPM_BIN)/tsc
TSX				:= $(NPM_BIN)/tsx
VITEST			:= $(NPM_BIN)/vitest
PRETTIER		:= $(NPM_BIN)/prettier
ESLINT			:= $(NPM_BIN)/eslint
PINO_PRETTY		:= $(NPM_BIN)/pino-pretty
HUSKY			:= $(NPM_BIN)/husky

.PHONY: help
## Display this help
help:
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

.PHONY: install
install: ## install all dependencies
	pnpm install
	$(HUSKY) install

.PHONY: dev
dev: ## run TS (watch mode)
	$(TSX) watch --clear-screen=false -r dotenv/config ./src/main.ts | $(PINO_PRETTY)

.PHONY: run-js
run-js: ## run built JS
	node -r dotenv/config ./build/src/main.js

##@ Build

.PHONY: build
build: ## build TS
	rm -rf ./build
	$(TSC) --build --force

.PHONY: build-image
build-image: ## build Docker image (args=<build args>, tag=<string>)
	docker build $(args) -t $(or $(tag), $(PROJECT_NAME)) . -f ./Dockerfile

##@ Test

.PHONY: test
test: ## run tests
	$(VITEST) run

.PHONY: test-watch
test-watch: ## run tests (watch mode)
	$(VITEST) watch

.PHONY: test-coverage
test-coverage: ## run tests (with coverage)
	$(VITEST) run --coverage

##@ Code quality

.PHONY: prettier
prettier: ## run Prettier (autofix)
	$(PRETTIER) --cache --write .

.PHONY: eslint
eslint: ## run ESLint (autofix)
	$(ESLINT) --max-warnings 0 --cache --fix .

.PHONY: lint
lint: prettier eslint ## run Prettier & ESlint (autofix)

##@ CI

.PHONY: install-ci
install-ci: ## install all dependencies (CI)
	pnpm install --frozen-lockfile

.PHONY: build-ci
build-ci: ## build TS (CI)
	$(TSC) --build --force

.PHONY: test-ci
test-ci: test-coverage ## run tests (CI)

.PHONY: prettier-ci
prettier-ci: ## run Prettier (CI)
	$(PRETTIER) --check .

.PHONY: eslint-ci
eslint-ci: ## run ESLint (CI)
	$(ESLINT) --max-warnings 0 .

.PHONY: lint-ci
lint-ci: prettier-ci eslint-ci ## run Prettier & ESlint (CI)
