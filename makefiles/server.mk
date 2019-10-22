### SERVER
# ¯¯¯¯¯¯¯¯¯¯¯

server.start: ## Start server in its docker container
	docker-compose -f local.yml up

server.stop: ## Start server in its docker container
	docker-compose -f local.yml stop

server.shell:
	docker-compose -f local.yml run django python manage.py shell
