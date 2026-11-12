.DEFAULT_GOAL := help

YARN ?= yarn

.PHONY: help install dev build test lint format check api-generate
help: ## Список команд
	@grep -hE '^[a-zA-Z0-9_.-]+:.*## ' $(MAKEFILE_LIST) | awk -F ':.*## ' '{printf "  %-16s %s\n", $$1, $$2}'
install: ## Поставить зависимости
	$(YARN) install
dev: ## Запустить на http://localhost:5173; /api уходит на BACKEND_URL из .env.local
	$(YARN) dev
build: ## Сборка в dist/
	$(YARN) build
test: ## Тесты
	$(YARN) test
lint: ## Линтер
	$(YARN) lint
format: ## Форматирование
	$(YARN) format
api-generate: ## Типы клиента API из api/backend-schema.yaml
	$(YARN) api:generate
check: lint test build ## Всё, что проверяет CI
	$(YARN) format:check
