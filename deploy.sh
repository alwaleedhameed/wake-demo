#!/usr/bin/env bash
# Build the app and publish it to GitHub Pages (the gh-pages branch of alwaleedhameed/wake-demo).
# The live site updates about a minute later: https://alwaleedhameed.github.io/wake-demo/
set -euo pipefail
cd "$(dirname "$0")/app"
npm run build
cd dist
touch .nojekyll                # tells GitHub Pages to serve the files as they are
rm -rf .git && git init -q -b gh-pages && git add -A
git -c user.name="Alwaleed Hameed" commit -q -m "deploy: Wake demo build"
git push -q -f https://github.com/alwaleedhameed/wake-demo.git gh-pages
echo "deployed: https://alwaleedhameed.github.io/wake-demo/"
