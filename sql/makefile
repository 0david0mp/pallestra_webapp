# https://github.com/Wandmalfarbe/pandoc-latex-template

DB_NAME = palestra_pwm
CLEAN_PSQL_FLAGS = -v ON_ERROR_STOP=1 -U postgres -a
PSQL_FLAGS = -d "$(DB_NAME)" $(CLEAN_PSQL_FLAGS)

database: tables.sql values.sql
	clear; psql $(PSQL_FLAGS) -f $< && psql $(PSQL_FLAGS) -f values.sql

clean:
	psql $(CLEAN_PSQL_FLAGS) -c "DROP DATABASE \"$(DB_NAME)\";"; psql $(CLEAN_PSQL_FLAGS) -c "CREATE DATABASE \"$(DB_NAME)\";";
