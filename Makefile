install:

	npm install

develop:

	npm run develop

build:

	rm -rf dist
	NODE_ENV=production npx webpack

publish:

	npm run publish

test:

	npm test

lint:
	
	npx eslint .
