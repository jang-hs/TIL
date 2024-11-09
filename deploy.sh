#!/usr/bin/env sh

# abort on errors
set -e

git pull
git add -A
git commit -m "$1 $2 $3 --all.sh master"
git push origin main

# build
npm run build
# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b gh-pages
git add -A
git commit -m 'deploy with vuepress'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:jang-hs/TIL.git master:gh-pages
cd -