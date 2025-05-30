DB_NAME = palestra_pwm
CLEAN_PSQL_FLAGS = -v ON_ERROR_STOP=1 -U postgres -a
PSQL_FLAGS = -d "$(DB_NAME)" $(CLEAN_PSQL_FLAGS)

.PHONY: progweb_2025_david_mieres.zip

progweb_2025_david_mieres.zip:
	zip $@ -r . -x "node_modules/*" -x "logs/*" -x ".git/*" -x ".gitignore"

db: sql/tables.sql sql/values.sql
	clear; psql $(PSQL_FLAGS) -f $< && psql $(PSQL_FLAGS) -f sql/values.sql

clean_db:
	psql $(CLEAN_PSQL_FLAGS) -c "DROP DATABASE \"$(DB_NAME)\";"; psql $(CLEAN_PSQL_FLAGS) -c "CREATE DATABASE \"$(DB_NAME)\";";
