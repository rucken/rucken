#!/bin/bash
#rm -rf ./integrations/app
#mkdir ./integrations/app
#cd ./integrations
#npx --yes create-nx-workspace --name=app --preset=empty --interactive=false --nx-cloud=false
#cd app
#npm install --save-dev @nrwl/angular @nrwl/nest @nrwl/node --force
#npx --yes nx g @nrwl/nest:app server
#npx --yes nx g @nrwl/angular:app client --style=scss --routing=true
#npx --yes nx g @nrwl/node:app cli
#npx --yes nx g @nrwl/nest:lib feature/server
#npx --yes nx g @nrwl/angular:lib feature/client
#npx --yes nx g @nrwl/node:lib feature/common
#npx --yes nx g @nrwl/workspace:remove client-e2e
#cd ../../
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
npx rucken tools all
npx rucken gettext --locales=en,ru --default-locale=ru
npx nx format
tsc --noEmit -p tsconfig.base.json
npx --yes nx affected:build --all

# mkdir ./integrations/app/src/app/new-api
# cp -Rf ./apps/demo/src/app/panels/new-api/* ./integrations/app/src/app/new-api/
# cp -Rf ./integrations/default/* ./integrations/app/src/app/
# node ./integrations/scripts/path-angular-files.js
# npm run build -- --prod
cd ../../
