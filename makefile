DB_NAME = palestra_pwm
CLEAN_PSQL_FLAGS = -v ON_ERROR_STOP=1 -U postgres -a
PSQL_FLAGS = -d "$(DB_NAME)" $(CLEAN_PSQL_FLAGS)

.PHONY: progweb_2025_david_mieres.zip

db: sql/tables.sql sql/values.sql
	clear
	@for f in $^; do \
		psql $(PSQL_FLAGS) -f "$$f"; \
	done

clean_db:
	psql $(CLEAN_PSQL_FLAGS) -c "DROP DATABASE \"$(DB_NAME)\";"; psql $(CLEAN_PSQL_FLAGS) -c "CREATE DATABASE \"$(DB_NAME)\";";

readme.pdf: readme.md
	pandoc --metadata=disable-header-and-footer:true \
			--template eisvogel --listings \
			$^ -o $@

progweb_2025_david_mieres.zip:
	rm $@
	zip $@ -r . \
		-x "node_modules/*" \
		-x "logs/*" \
		-x ".git/*" -x ".gitignore" -x ".github/*" \
		-x "*.md" -x "media/*"
