install:

	npm install

develop:

	npm run develop

build:

		rm -rf dist
		NODE_ENV=production npx webpack

watch:

		# rm -rf dist
		npm run watch

start:

		# rm -rf dist
		npm run start

test:

		npm test

lint:
			npx eslint .
