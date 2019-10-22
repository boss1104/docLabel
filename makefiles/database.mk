# ### DATABASE
# # ¯¯¯¯¯¯¯¯

database.migrate: ## Create alembic migration file
	docker-compose -f local.yml run django python manage.py migrate

database.createsuperuser:
	docker-compose -f local.yml run django python manage.py createsuperuser
