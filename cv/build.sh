#!/usr/bin/env bash
# Builds the public CV with LuaLaTeX and writes it where the website serves it,
# public/downloads/konstantinos-papadogiannis-cv.pdf, then checks the result:
# only the approved links, no phone number, no local paths. See README.md.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
name=konstantinos-papadogiannis-cv
out="$here/../public/downloads/$name.pdf"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

if ! command -v lualatex >/dev/null; then
  echo "lualatex not found: install TeX Live with LuaLaTeX" >&2
  exit 1
fi
if ! kpsewhich luaotfload.sty >/dev/null || ! kpsewhich fontawesome5.sty >/dev/null; then
  echo "luaotfload or fontawesome5 not found: install them with TeX Live," >&2
  echo "or point TEXMFHOME at a tree that has them" >&2
  exit 1
fi

# The dates in the PDF are those of the last commit that changed this folder,
# so rebuilding committed sources does not change them.
epoch="$(git -C "$here" log -1 --format=%ct -- . 2>/dev/null || true)"
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-${epoch:-$(date +%s)}}"
export FORCE_SOURCE_DATE=1

# Twice, so the hyperref metadata settles. The class finds the fonts in
# ./fonts, so LuaLaTeX runs from this folder; its auxiliary files stay in the
# temporary directory.
cd "$here"
for _ in 1 2; do
  lualatex -interaction=nonstopmode -halt-on-error -output-directory="$work" \
    "$name.tex" >/dev/null || { tail -n 30 "$work/$name.log"; exit 1; }
done

pdf="$work/$name.pdf"

# Every link target must be one the website itself shows.
allowed='^(mailto:konstantinospapadogiannis\.dev@gmail\.com|https://www\.linkedin\.com/in/konstantinos-papadogiannis/|https://github\.com/KonstantinosPapadogiannis)$'
links="$(grep -aoE '/URI ?\([^)]*\)' "$pdf" | sed -E 's|^/URI ?\((.*)\)$|\1|' || true)"
if [ -z "$links" ]; then
  echo "no links found in the PDF" >&2
  exit 1
fi
if grep -vE "$allowed" <<<"$links" >/dev/null; then
  echo "unexpected link target in the PDF:" >&2
  grep -vE "$allowed" <<<"$links" >&2
  exit 1
fi

if grep -aqE '/(home|Users|tmp)/' "$pdf"; then
  echo "the PDF contains a local file path" >&2
  exit 1
fi

if command -v pdftotext >/dev/null; then
  text="$(pdftotext -layout "$pdf" -)"
  if grep -qE '(\+|00)[0-9]{2}[ 0-9]{8,}|\b69[0-9]([ .-]?[0-9]){7}\b' <<<"$text"; then
    echo "the PDF text contains a phone number" >&2
    exit 1
  fi
  if grep -qiE 'github\.com/[^ ]+/' <<<"$text"; then
    echo "the PDF text names a repository" >&2
    exit 1
  fi
else
  echo "pdftotext not found: the text of the PDF was not checked" >&2
fi

cp "$pdf" "$out"
echo "built ${out#"$here/../"}"
