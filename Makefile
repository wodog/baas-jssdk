test:
	npm run test

tag:
	@\
	if [ $$(git status -s | wc -l) -gt 0 ]; then \
		echo "请先打好 commit"; \
	else \
		git checkout $$(git rev-parse HEAD) 2>/dev/null; \
		sed -i '' '/dist/d' .gitignore; \
		npm run build:browser; \
		git add . -A; \
		version=$$(cat package.json | grep "version" | awk -F '"' '{print $$4}'); \
		git commit -m $$version; \
		git tag $$version -f; \
	fi

