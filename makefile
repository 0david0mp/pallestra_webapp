.PHONY: progweb_2025_david_mieres.zip
progweb_2025_david_mieres.zip:
	zip $@ -r . -x node_modules -x makefile -x logs -x .git -x .gitignore
