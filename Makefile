install:

			npm install

develop:

			npm run develop

build:

			rm -rf dist
			NODE_ENV=production npx webpack

test:

			npm test

lint:
			npx eslint .
