.DEFAULT_GOAL := help


### QUICK
# ¯¯¯¯¯¯¯

start: server.start


include makefiles/server.mk
include makefiles/database.mk
include makefiles/help.mk
