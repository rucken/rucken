#!/bin/bash
rm -rf ./integrations/app
mkdir ./integrations/app
cd ./integrations
npx --yes create-nx-workspace@14.6.5 --name=app --preset=empty --interactive=false --nx-cloud=false
cd ../
node ./integrations/scripts/path-files.js
cd ./integrations/app
npm i --force
npm install --save-dev @nrwl/angular@14.6.5 @nrwl/nest@14.6.5 @nrwl/node@14.6.5 --force
npm install --save @ngneat/transloco @ngneat/transloco-locale
npm run nx -- g @nrwl/nest:app server
npm run nx -- g @nrwl/angular:app client --style=scss --routing=true
npm run nx -- g @nrwl/node:app cli
npm run nx -- g @nrwl/nest:lib feature/server
npm run nx -- g @nrwl/angular:lib feature/client
npm run nx -- g @nrwl/node:lib feature/common
npm run nx -- g @nrwl/workspace:remove client-e2e
cd ../../
node ./integrations/scripts/path-files.js
cp -Rf ./integrations/default/* ./integrations/app
rm -rf ./integrations/app/lib
mkdir ./integrations/app/lib
cp -Rf ./dist/libs/rucken/* ./integrations/app/lib
npx --yes replace-json-property ./integrations/app/lib/package.json version 0.0.0
cd ./integrations/app/lib
npm pack .
cd ../
npm i --force
npm install --save class-validator-multi-lang --force
npm install --save-dev ./lib/rucken-0.0.0.tgz @ngneat/transloco-keys-manager --force
npm run nx -- format

npm run rucken -- make-ts-list

npm run rucken -- version-updater

npm run rucken -- translate --locales=en,ru --default-locale=en
npm run rucken -- translate --locales=en,ru --default-locale=en
npm run rucken -- translate --locales=en,ru --default-locale=en

npm run rucken -- prepare --locales=en,ru --default-locale=en
npm run rucken -- prepare --locales=en,ru --default-locale=en
npm run rucken -- prepare --locales=en,ru --default-locale=en
npm run rucken -- prepare --locales=en,ru --default-locale=en
npm run rucken -- prepare --locales=en,ru --default-locale=en

npm run rucken -- copy-paste --find=server-user --replace=server-company --path=./libs/feature --dest-path=/test
npm run rucken -- copy-paste --find=server-user --replace=server-company --path=./libs/feature
npm run rucken -- copy-paste --find=admin --replace=my-company --path=./libs/feature
npm run rucken -- copy-paste --find=new --replace=new-user --path=./libs/feature/server-duplicate
npm run rucken -- copy-paste --find=README --replace=README --path=./libs/copy-paste-glob --dest-path=./libs/copy-paste-glob-new --glob-rules=**/README.md --extensions=MD

export APP_VERSION='42'
npm run rucken -- copy-paste --find=new --replace=new1-user --path=./libs/feature/server-env-replacer --replace-envs=true

export START_ENV_VARIABLE="examples:"
npm run rucken -- copy-paste --find=cat-dog --replace=human-ufo --path=./libs/cat-dog --replace-envs=true

tsc --noEmit -p tsconfig.base.json
npm run nx -- run-many --target=build --all

# mkdir ./integrations/app/src/app/new-api
# cp -Rf ./apps/demo/src/app/panels/new-api/* ./integrations/app/src/app/new-api/
# cp -Rf ./integrations/default/* ./integrations/app/src/app/
# node ./integrations/scripts/path-angular-files.js
# npm run build -- --prod
cd ../../
