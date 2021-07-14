MAKEFLAGS := --silent --always-make
PAR := $(MAKE) -j 128
DENO := deno run --no-check --importmap=importmap.json
TEST := test/test.mjs

watch:
	$(PAR) test-w lint-w

prep: lint test

test-w:
	$(DENO) --watch $(TEST)

test:
	$(DENO) $(TEST)

lint-w:
	watchexec -r -d=0 -e=mjs -n -- make lint

lint:
	deno lint
