#!/bin/sh
# Minify source CSS/JS into the .min files index.html references.
# Run after editing styles.css or script.js, then bump ?v= in index.html.
set -e
npx -y esbuild styles.css --minify --outfile=styles.min.css
npx -y esbuild script.js --minify --outfile=script.min.js
echo "minified. Remember to bump the ?v= query in index.html."
