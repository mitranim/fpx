MAKEFLAGS := --silent --always-make
PAR := $(MAKE) -j 128
DENO := deno run --no-check --unstable --allow-hrtime
RUN := $(if $(run),--run "$(run)",)
VERB := $(if $(filter $(verb),true),-v,)
TEST := test/test.mjs $(VERB) $(RUN)
BENCH := test/bench.mjs $(VERB) $(RUN)
DOC := doc/doc.mjs
DIFF := doc/diff.mjs

test_w:
	$(DENO) --watch $(TEST)

test:
	$(DENO) $(TEST)

bench_w:
	$(DENO) --watch $(BENCH)

bench:
	$(DENO) $(BENCH)

lint_w:
	watchexec -r -c -d=0 -e=mjs -n -- $(MAKE) lint

lint:
	deno lint --rules-exclude=no-empty,require-yield,require-await

# TODO consider watching all related files.
doc_w:
	$(DENO) -A --watch $(DOC)

doc:
	$(DENO) -A $(DOC)

diff_w:
	$(DENO) -A --watch $(DIFF)

diff:
	$(DENO) -A $(DIFF)

watch:
	$(PAR) test_w lint_w doc_w

prep: lint test doc

define PRE_COMMIT
#!/bin/sh
export NO_COLOR=""
make doc && git add readme.md
endef
export PRE_COMMIT

# Should be run once, after cloning the repo.
# Requires Unix.
hook:
	$(eval OUT := .git/hooks/pre-commit)
	echo "$${PRE_COMMIT}" > $(OUT)
	chmod +x $(OUT)
