#!/usr/bin/env bash

set -xe

yarn workspace apollo-angular build
(cd packages/apollo-angular/build && yarn pack --filename apollo-angular.tgz && mv apollo-angular.tgz ../apollo-angular.tgz)
yarn cache clean apollo-angular
rm -rf testapp
ng new testapp --package-manager yarn --defaults --minimal --skip-git
(cd testapp && ng add ../packages/apollo-angular/apollo-angular.tgz --graphql '16.0.0' --defaults --verbose --skip-confirmation)
(cd testapp && yarn ng run testapp:build:production)
(cd testapp && ng add @cypress/schematic --defaults --verbose --skip-confirmation)
./scripts/prepare-e2e.js testapp 16
(cd testapp && yarn ng run testapp:cypress-run:production)
rm -rf testapp
