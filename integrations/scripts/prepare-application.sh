#!/bin/bash
rm -rf ./integrations/app
mkdir ./integrations/app
cd ./integrations
npx --yes create-nx-workspace --name=app --preset=empty --interactive=false --nx-cloud=false
cd ../
node ./integrations/scripts/path-files.js
cd ./integrations/app
npm install --save-dev @nrwl/angular @nrwl/nest @nrwl/node --force
npm run nx -- g @nrwl/nest:app server
npm run nx -- g @nrwl/angular:app client --style=scss --routing=true
npm run nx -- g @nrwl/node:app cli
npm run nx -- g @nrwl/nest:lib feature/server
npm run nx -- g @nrwl/angular:lib feature/client
npm run nx -- g @nrwl/node:lib feature/common
npm run nx -- g @nrwl/workspace:remove client-e2e
cd ../../
cp -Rf ./integrations/default/* ./integrations/app
rm -rf ./integrations/app/lib
mkdir ./integrations/app/lib
cp -Rf ./dist/libs/rucken/* ./integrations/app/lib
npx --yes replace-json-property ./integrations/app/lib/package.json version 0.0.0
cd ./integrations/app/lib
npm pack .
cd ../
npx --yes npm-check-updates -u
npm i --force
npm install --save class-validator-multi-lang  --force
npm install --save-dev ./lib/rucken-0.0.0.tgz @ngneat/transloco-keys-manager  --force
npm run nx -- format
npm run rucken -- tools all
npm run rucken -- gettext --locales=en,ru --default-locale=en
tsc --noEmit -p tsconfig.base.json
npm run nx -- affected:build --all

# mkdir ./integrations/app/src/app/new-api
# cp -Rf ./apps/demo/src/app/panels/new-api/* ./integrations/app/src/app/new-api/
# cp -Rf ./integrations/default/* ./integrations/app/src/app/
# node ./integrations/scripts/path-angular-files.js
# npm run build -- --prod
cd ../../
