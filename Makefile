# Path to the node engine
OPT_NODEJS := /opt/nodejs/4/bin

NODE := $(shell command -v $(OPT_NODEJS)/node 2>/dev/null)
ifndef NODE
	NODE := node
endif
NPM := $(shell command -v $(OPT_NODEJS)/npm 2>/dev/null)
ifndef NPM
	NPM := npm
endif

# Path to the executables of the project's dependencies
NODE_MODULES := ./node_modules/.bin

# Install npm modules
install:
	$(NPM) install

# Run tests
test:
	$(NODE) $(NODE_MODULES)/ymb tests/ && $(NODE_MODULES)/mocha-phantomjs --ignore-ssl-errors=true --ssl-protocol=any --ignore-resource-errors tests/index.html?grep=$(grep)