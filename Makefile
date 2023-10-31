PROJECT_NAME := smartlook-relay-proxy
COMMIT_SHA := dev,$(shell git rev-parse HEAD)

NPM_BIN := ./node_modules/.bin

TSC := $(NPM_BIN)/tsc
VITEST := $(NPM_BIN)/vitest
PRETTIER := $(NPM_BIN)/prettier
ESLINT := $(NPM_BIN)/eslint

ESLINT_CACHE := ./cache/eslint
PRETTIER_CACHE := ./cache/prettier

COMPOSE_TEST_CMD := docker compose up -d --build --force-recreate --remove-orphans && sleep 5

.PHONY: help
## Display this help
help:
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

.PHONY: install
install: ## install dep
	pnpm install

.PHONY: dev
dev: ## run TS (watch mode)
	docker compose up --build

##@ Build

.PHONY: build-ts
build-ts: ## build TS
	$(TSC) --noEmit

.PHONY: build
build: ## build Docker image (args=<build args>, tag=<string>)
	docker build $(or $(args), --build-arg COMMIT_SHA="$(COMMIT_SHA)") -t $(or $(tag), $(PROJECT_NAME)) . -f ./Dockerfile

##@ Test

.PHONY: test
test: ## run tests
	$(COMPOSE_TEST_CMD)
	$(VITEST) run

.PHONY: test-watch
test-watch: ## run tests (watch mode)
	$(COMPOSE_TEST_CMD)
	$(VITEST) watch

##@ Code quality

.PHONY: prettier
prettier: ## run Prettier (autofix)
	$(PRETTIER) --cache --cache-location=$(PRETTIER_CACHE) --write .

.PHONY: eslint
eslint: ## run ESLint (autofix)
	$(ESLINT) --max-warnings 0 --cache --cache-location $(ESLINT_CACHE) --fix .

.PHONY: lint
lint: prettier eslint ## run Prettier & ESlint (autofix)

##@ CI

.PHONY: install-ci
install-ci: ## install all dependencies (CI)
	pnpm install --frozen-lockfile

.PHONY: build-ci
build-ci: build-ts ## build TS (CI)

.PHONY: test-ci
test-ci: test ## run tests (CI)

.PHONY: prettier-ci
prettier-ci: ## run Prettier (CI)
	$(PRETTIER) --check .

.PHONY: eslint-ci
eslint-ci: ## run ESLint (CI)
	$(ESLINT) --max-warnings 0 .

.PHONY: lint-ci
lint-ci: prettier-ci eslint-ci ## run Prettier & ESlint (CI)
