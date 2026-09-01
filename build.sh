#!/bin/sh
# Minify source CSS/JS into the .min files the pages reference.
# Run after editing styles.css or script.js, then bump the ?v= query
# on the changed file's link in index.html AND mixes/index.html.
set -e
npx -y esbuild styles.css --minify --outfile=styles.min.css
npx -y esbuild script.js --minify --outfile=script.min.js
echo "minified. Remember to bump the ?v= query in both HTML pages."
