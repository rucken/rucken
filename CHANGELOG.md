# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.10.0](https://github.com/rucken/rucken/compare/v4.9.1...v4.10.0) (2024-09-12)

### Features

- added the ability to replace environment variables when running the "copy-paste" command ([2f4649c](https://github.com/rucken/rucken/commit/2f4649c59a1246e43256fa1361c83077a4570443))

### [4.9.1](https://github.com/rucken/rucken/compare/v4.9.0...v4.9.1) (2024-08-05)

### Bug Fixes

- **copy-paste:** add support \* for any extensions ([e3a6457](https://github.com/rucken/rucken/commit/e3a6457b0f3d597ce1b9f5c6d5405f07ccf0b881))

## [4.9.0](https://github.com/rucken/rucken/compare/v4.8.1...v4.9.0) (2024-08-05)

### Features

- **copy-paste:** add glob-rules options for ([560165f](https://github.com/rucken/rucken/commit/560165f38fce624d2c258922498df7a6842417d0))

### [4.8.1](https://github.com/rucken/rucken/compare/v4.8.0...v4.8.1) (2024-05-27)

### Bug Fixes

- updates for correct work copy-paste and make-ts-list on Windows ([2e44b56](https://github.com/rucken/rucken/commit/2e44b56c4f3fc218034cc6b995ddaa234d3e1ef0))

## [4.8.0](https://github.com/rucken/rucken/compare/v4.7.1...v4.8.0) (2024-03-29)

### Features

- **copy-paste:** add support correct replace long text with two or more words, when word for find include in replace options ([c8dbfa2](https://github.com/rucken/rucken/commit/c8dbfa2642f4bbff4633ac23c86ea1db716ce165))

### [4.7.1](https://github.com/rucken/rucken/compare/v4.7.0...v4.7.1) (2024-03-28)

### Bug Fixes

- update versions ([e61ea7b](https://github.com/rucken/rucken/commit/e61ea7b9de67a1786be2c0639beacea826eaacd6))

## [4.7.0](https://github.com/rucken/rucken/compare/v4.6.4...v4.7.0) (2024-03-28)

### Features

- **copy-paste:** add support correct generate new files path names ([8d5516f](https://github.com/rucken/rucken/commit/8d5516f776d0f53068f10b72551a7f0a21a879af))

### [4.6.4](https://github.com/rucken/rucken/compare/v4.6.3...v4.6.4) (2023-07-20)

### Bug Fixes

- append ignore compilerOptions.paths with \* ([a7ac185](https://github.com/rucken/rucken/commit/a7ac185d679a8daf4bf08abb4a2fed9cd928accd))

### [4.6.3](https://github.com/rucken/rucken/compare/v4.6.2...v4.6.3) (2023-07-20)

### Bug Fixes

- update for correct work in nest-cli project ([075faa3](https://github.com/rucken/rucken/commit/075faa35a0106a9458f8b8e8ce679dddc135c684))

### [4.6.2](https://github.com/rucken/rucken/compare/v4.6.1...v4.6.2) (2023-05-15)

### Bug Fixes

- no error if db does not exist ([#20](https://github.com/rucken/rucken/issues/20)) ([219c60d](https://github.com/rucken/rucken/commit/219c60db1a63ad118f9c7a8587faf378322d0be4))

### [4.6.1](https://github.com/rucken/rucken/compare/v4.6.0...v4.6.1) (2023-05-15)

### Bug Fixes

- ignore duplicate username change ([#19](https://github.com/rucken/rucken/issues/19)) ([65ccf41](https://github.com/rucken/rucken/commit/65ccf41747006569dba776a35ca8993c36750d6c))

## [4.6.0](https://github.com/rucken/rucken/compare/v4.5.0...v4.6.0) (2023-05-12)

### Features

- change password on database create ([4752d8b](https://github.com/rucken/rucken/commit/4752d8ba5cb0ebcabe9f43160fce307b674fc8db))
- seperate flags for use case ([e335681](https://github.com/rucken/rucken/commit/e3356811f4849635746f6e3ad046879bd28bbabd))
- user name & pass replace in one in db ([c72c462](https://github.com/rucken/rucken/commit/c72c46275d42a41dd6adca1f492be5f64f0e40b2))

### Bug Fixes

- both flags work together ([b018b73](https://github.com/rucken/rucken/commit/b018b731f4a68e672ceaa65e16592811086552d3))
- desc ([1c4c83f](https://github.com/rucken/rucken/commit/1c4c83f0a75e100deb0fa8213205e9158b52f243))
- description of flags ([679b89d](https://github.com/rucken/rucken/commit/679b89d18360b80a37204202f99e62db2bf51e0b))
- downgrade version bump ([1a2d42b](https://github.com/rucken/rucken/commit/1a2d42bd3d28c2a3bd394548c8bdafd552e8a5a0))
- flag name ([64d9001](https://github.com/rucken/rucken/commit/64d9001f1ec76e9320edd40366df4b084c506e38))
- remove console log ([edb7924](https://github.com/rucken/rucken/commit/edb79241add0376f932bcb416e66081a45f420c6))
- rename flag ([071c61c](https://github.com/rucken/rucken/commit/071c61c8751e435bc85336817b74ed315a8b0d5c))
- revert ([4fd9800](https://github.com/rucken/rucken/commit/4fd98004d5da0321343ac65fd2a32a4f25c1ba80))
- root connects to app database not root db ([#17](https://github.com/rucken/rucken/issues/17)) ([80972ad](https://github.com/rucken/rucken/commit/80972ade8f300da33aaa90e76752a976025fdd67))
- update query for search multiple users ([#18](https://github.com/rucken/rucken/issues/18)) ([43d8a2c](https://github.com/rucken/rucken/commit/43d8a2c25dfab919be8d9cefe93a22fc08dbd11e))
- wrong desc ([b6eaf7c](https://github.com/rucken/rucken/commit/b6eaf7c56f18c6c6237ac33b0aed212252f43695))

### [4.4.7](https://github.com/rucken/rucken/compare/v4.4.6...v4.4.7) (2023-03-04)

### Bug Fixes

- add database from rootDatabase ([a24e0a6](https://github.com/rucken/rucken/commit/a24e0a65d751a60f12fc2021bcff345e0cbb7e41))

## [4.5.0](https://github.com/rucken/rucken/compare/v4.4.6...v4.5.0) (2023-05-11)

### Features

- append changing username or password for application database ([cb2cd44](https://github.com/rucken/rucken/commit/cb2cd449fdd26e3e7b1d80897e7c5dd09bf980dc))

### [4.4.7](https://github.com/rucken/rucken/compare/v4.4.6...v4.4.7) (2023-03-04)

### Bug Fixes

- add database from rootDatabase ([a24e0a6](https://github.com/rucken/rucken/commit/a24e0a65d751a60f12fc2021bcff345e0cbb7e41))

### [4.4.6](https://github.com/rucken/rucken/compare/v4.4.5...v4.4.6) (2022-11-29)

### Bug Fixes

- added support merge found projects and projects from root rucken file ([0eb254a](https://github.com/rucken/rucken/commit/0eb254a84cd8502e7f07c250bc2ca9614e49175e))

### [4.4.5](https://github.com/rucken/rucken/compare/v4.4.4...v4.4.5) (2022-11-25)

### Bug Fixes

- revert install nestjs-console after install rucken ([d54893c](https://github.com/rucken/rucken/commit/d54893c6df1bb5da65716771df4630dd0943832f))

### [4.4.4](https://github.com/rucken/rucken/compare/v4.4.3...v4.4.4) (2022-10-27)

### Bug Fixes

- set updateBuildableProjectDepsInPackageJson to false ([6e98f14](https://github.com/rucken/rucken/commit/6e98f1401894b40ed4ed97b4c10f3e4407c5708d))

### [4.4.3](https://github.com/rucken/rucken/compare/v4.4.2...v4.4.3) (2022-10-27)

### Bug Fixes

- add support work with latest nx ([49f444f](https://github.com/rucken/rucken/commit/49f444fe7e9f649e5e2009ac2e392364964e843c))

### [4.4.2](https://github.com/rucken/rucken/compare/v4.4.1...v4.4.2) (2022-10-27)

### Bug Fixes

- append all need deps to lib ([e083ec3](https://github.com/rucken/rucken/commit/e083ec33b6bd02f85a211cda663dcc68bbc4cc73))

### [4.4.1](https://github.com/rucken/rucken/compare/v4.4.0...v4.4.1) (2022-10-16)

### Bug Fixes

- add source-map-support to dev deps in lib ([f1f6d11](https://github.com/rucken/rucken/commit/f1f6d111a9518c900bf2e6fe6b1cf0a3a70959ba))

## [4.4.0](https://github.com/rucken/rucken/compare/v4.3.1...v4.4.0) (2022-10-16)

### Features

- **copy-paste:** copy paste source files to destination with singular and plural replace text in file contents and file paths ([#11](https://github.com/rucken/rucken/issues/11)) ([39c203e](https://github.com/rucken/rucken/commit/39c203ef804402edf2e1ac13ab6bdad4849321ff))

### [4.3.1](https://github.com/rucken/rucken/compare/v4.3.0...v4.3.1) (2022-09-30)

### Bug Fixes

- change logic for postinstall in result npm library ([9527903](https://github.com/rucken/rucken/commit/9527903a03ea3b7b83ef7de01e7a3a52d57d7582))

## [4.3.0](https://github.com/rucken/rucken/compare/v4.2.1...v4.3.0) (2022-09-29)

### Features

- append post install for correct install all need deps inside lib ([d7a24b2](https://github.com/rucken/rucken/commit/d7a24b21d5fd1a6249b72289e113b9ab4b3013eb))

### [4.2.1](https://github.com/rucken/rucken/compare/v4.2.0...v4.2.1) (2022-09-08)

### Bug Fixes

- add rxjs in lib dependencies ([6704723](https://github.com/rucken/rucken/commit/67047231343f0eee87c6b6d4ff5189adb9d511e0))

## [4.2.0](https://github.com/rucken/rucken/compare/v4.1.0...v4.2.0) (2022-09-08)

### Features

- update deps and code for support old and new versions of nx ([d76bfa7](https://github.com/rucken/rucken/commit/d76bfa7eef721ee2ed78bad70181adc4dd6d51a5))

## [4.1.0](https://github.com/rucken/rucken/compare/v4.0.1...v4.1.0) (2022-08-05)

### Features

- remove timestamp from pot and po files ([81f70f3](https://github.com/rucken/rucken/commit/81f70f3998b5cae80ee8821124c6854cfc8324b6))

### [4.0.1](https://github.com/rucken/rucken/compare/v4.0.0...v4.0.1) (2022-08-05)

### Bug Fixes

- reverted logic used for resetUnusedTranslatesBoolean in prepare and translate, because if use this logic we may reset exists translates in json files ([2f90af5](https://github.com/rucken/rucken/commit/2f90af530ec74a9b142adbc54e8a5881c60080a5))

## [4.0.0](https://github.com/rucken/rucken/compare/v3.6.3...v4.0.0) (2022-07-27)

### ⚠ BREAKING CHANGES

- new options resetUnusedTranslates enabled as default

### Features

- add new options resetUnusedTranslates for remove words not used in source code ([8e74b19](https://github.com/rucken/rucken/commit/8e74b191de003b664f6b84c3b5039fd994b52713))
- bump some deps ([9c1de23](https://github.com/rucken/rucken/commit/9c1de239030473d14bb31a521750695798026d88))

### [3.6.3](https://github.com/rucken/rucken/compare/v3.6.2...v3.6.3) (2022-07-13)

### Bug Fixes

- append @nestjs/core and @nestjs/common to cli deps ([3f580fa](https://github.com/rucken/rucken/commit/3f580faf5e6e5854dd4c5e01288f8d693744f677))

### [3.6.2](https://github.com/rucken/rucken/compare/v3.6.1...v3.6.2) (2022-07-13)

### Bug Fixes

- add support get nx projects from rucken config ([2d5061a](https://github.com/rucken/rucken/commit/2d5061a236bab1f69604331d833d93a995afdcf6))
- lock dependencies ([aaa994e](https://github.com/rucken/rucken/commit/aaa994ee19feca401f1c44eb1dc68ab927fbab27))

### [3.6.1](https://github.com/rucken/rucken/compare/v3.6.0...v3.6.1) (2022-04-24)

### Bug Fixes

- change style of imports pg dependencies to lazy stayle ([39ce647](https://github.com/rucken/rucken/commit/39ce647e8d6bafb52fcf74690576f1cc6f521edb))

## [3.6.0](https://github.com/rucken/rucken/compare/v3.5.3...v3.6.0) (2022-03-27)

### Features

- add env-replacer ([e727c26](https://github.com/rucken/rucken/commit/e727c26cc1a4eaaef283f990b32211e764fd78c1))

### [3.5.3](https://github.com/rucken/rucken/compare/v3.5.2...v3.5.3) (2022-03-26)

### Bug Fixes

- update for work with async foreach and add support top-level await for application ([998666c](https://github.com/rucken/rucken/commit/998666ceeef76caa5a71092eee95518d7c8328cb))

### [3.5.2](https://github.com/rucken/rucken/compare/v3.5.1...v3.5.2) (2022-03-25)

### Bug Fixes

- remove minimal versions of node in package.json ([07fc9b8](https://github.com/rucken/rucken/commit/07fc9b8a4e429b1bcb996100e82d1708dce6be1f))

### [3.5.1](https://github.com/rucken/rucken/compare/v3.5.0...v3.5.1) (2022-03-25)

### Bug Fixes

- update for correct work with envs for nx applications ([87955ce](https://github.com/rucken/rucken/commit/87955ce4358a288f8ec74d05a9234774e387787d))

## [3.5.0](https://github.com/rucken/rucken/compare/v3.4.1...v3.5.0) (2022-03-25)

### Features

- add support work with postgres, create and drop application database ([#5](https://github.com/rucken/rucken/issues/5)) ([#6](https://github.com/rucken/rucken/issues/6)) ([dafd1c0](https://github.com/rucken/rucken/commit/dafd1c06816864e2735756acd13b31c2284f063c))

### [3.4.1](https://github.com/rucken/rucken/compare/v3.4.0...v3.4.1) (2022-02-27)

### Bug Fixes

- add revert wrong extract strings with { and } symbol ([5ed8d9b](https://github.com/rucken/rucken/commit/5ed8d9b4b356aa4c3239ef954f3841f9c13843b7))

## [3.4.0](https://github.com/rucken/rucken/compare/v3.3.3...v3.4.0) (2022-01-31)

### Features

- add transloco-extractor for angular and nestjs code ([#3](https://github.com/rucken/rucken/issues/3)) ([6bab9e3](https://github.com/rucken/rucken/commit/6bab9e391267e318595fe955c853bacfae149e1e))

### [3.3.3](https://github.com/rucken/rucken/compare/v3.3.2...v3.3.3) (2022-01-26)

### Bug Fixes

- update publish script ([68f8367](https://github.com/rucken/rucken/commit/68f836759fb6347628f58ff9e03a4c9a8ac7b15b))

### [3.3.2](https://github.com/rucken/rucken/compare/v3.3.1...v3.3.2) (2022-01-26)

### Bug Fixes

- update integration test files ([68c9e05](https://github.com/rucken/rucken/commit/68c9e05675e6b17d4a3e81c827f0848fddd9f274))

### [3.3.1](https://github.com/rucken/rucken/compare/v3.3.0...v3.3.1) (2022-01-25)

### Bug Fixes

- change publish install command ([2663e14](https://github.com/rucken/rucken/commit/2663e149dc2ed2bcbe98c2769f37f032834d8d9b))

## [3.3.0](https://github.com/rucken/rucken/compare/v3.2.2...v3.3.0) (2022-01-25)

### Features

- **gettext:** add gettext command ([#2](https://github.com/rucken/rucken/issues/2)) ([244a7f2](https://github.com/rucken/rucken/commit/244a7f2824bca67c2dc640e6936c1ecba6ab3a0a)), closes [#1](https://github.com/rucken/rucken/issues/1)

### [3.2.2](https://github.com/rucken/rucken/compare/v3.2.1...v3.2.2) (2022-01-03)

### [3.2.1](https://github.com/rucken/rucken/compare/v3.2.0...v3.2.1) (2022-01-03)

## [3.2.0](https://github.com/rucken/rucken/compare/v3.1.4...v3.2.0) (2022-01-03)

### Features

- **tools:** add files-list and version-updater commands for nx workspace ([d8931dc](https://github.com/rucken/rucken/commit/d8931dc3990aa1bba1e8b55849d66a0db82596e1))

### [3.1.4](https://github.com/rucken/rucken/compare/v3.1.3...v3.1.4) (2021-12-28)

### Bug Fixes

- remove not need deps and scripts ([5f84b7c](https://github.com/rucken/rucken/commit/5f84b7c5427967711f5d0f99c8437d391a37a4d7))

### [3.1.3](https://github.com/rucken/rucken/compare/v3.1.2...v3.1.3) (2021-12-28)

### Bug Fixes

- update create-release script ([ef324d9](https://github.com/rucken/rucken/commit/ef324d9f9f1bb559cd9adc089bbd8e8f1ae97391))

### [3.1.2](https://github.com/rucken/rucken/compare/v3.1.1...v3.1.2) (2021-12-28)

### Bug Fixes

- update ci config ([60fe2d5](https://github.com/rucken/rucken/commit/60fe2d5c83283fda35eac830f4b13200aa6c25e9))

### [3.1.1](https://github.com/rucken/rucken/compare/v3.1.0...v3.1.1) (2021-12-28)

### Bug Fixes

- update ci config ([3e042d2](https://github.com/rucken/rucken/commit/3e042d21d8fa57957821cc11db883520fc0284d7))

## [3.1.0](https://github.com/rucken/rucken/compare/v3.0.30...v3.1.0) (2021-12-28)

### Features

- add ci config for publish ([e16a305](https://github.com/rucken/rucken/commit/e16a305248e5b2989038ba64fcf9fa7554cf6c87))

### [3.0.30](https://github.com/rucken/rucken/compare/v3.0.29...v3.0.30) (2021-12-28)

### [3.0.32](https://github.com/rucken/rucken/compare/v3.0.29...v3.0.32) (2021-12-28)

### [3.0.31](https://github.com/rucken/rucken/compare/v3.0.29...v3.0.31) (2021-12-28)

### [3.0.30](https://github.com/rucken/rucken/compare/v3.0.29...v3.0.30) (2021-12-28)

### 3.0.29 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- add script for delete local tags ([7ef6c3b](https://github.com/rucken/rucken/commit/7ef6c3be7dafa40440271da52055c6371f356b38))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### [3.0.28](https://github.com/rucken/rucken/compare/v3.0.27...v3.0.28) (2021-12-28)

### [3.0.27](https://github.com/rucken/rucken/compare/v3.0.26...v3.0.27) (2021-12-28)

### 3.0.26 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- add script for delete local tags ([7ef6c3b](https://github.com/rucken/rucken/commit/7ef6c3be7dafa40440271da52055c6371f356b38))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.25 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- add script for delete local tags ([7ef6c3b](https://github.com/rucken/rucken/commit/7ef6c3be7dafa40440271da52055c6371f356b38))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.24 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- add script for delete local tags ([7ef6c3b](https://github.com/rucken/rucken/commit/7ef6c3be7dafa40440271da52055c6371f356b38))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.23 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- add script for delete local tags ([7ef6c3b](https://github.com/rucken/rucken/commit/7ef6c3be7dafa40440271da52055c6371f356b38))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### [3.0.22](https://github.com/rucken/rucken/compare/v3.0.21...v3.0.22) (2021-12-28)

### 3.0.21 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- add script for delete local tags ([7ef6c3b](https://github.com/rucken/rucken/commit/7ef6c3be7dafa40440271da52055c6371f356b38))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.20 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- add script for delete local tags ([7ef6c3b](https://github.com/rucken/rucken/commit/7ef6c3be7dafa40440271da52055c6371f356b38))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.19 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### [3.0.18](https://github.com/rucken/rucken/compare/v3.0.17...v3.0.18) (2021-12-28)

### 3.0.17 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### [3.0.16](https://github.com/rucken/rucken/compare/v3.0.15...v3.0.16) (2021-12-28)

### Bug Fixes

- move build step after releasers ([5449d66](https://github.com/rucken/rucken/commit/5449d66265c3b8de3ccbc3ca5b58f3974dbfebcf))

### 3.0.15 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### [3.0.14](https://github.com/rucken/rucken/compare/v3.0.13...v3.0.14) (2021-12-28)

### Bug Fixes

- change error message ([198e12f](https://github.com/rucken/rucken/commit/198e12f2d70dc8a81274ff246697f2ca5915494d))
- update tests ([6a92794](https://github.com/rucken/rucken/commit/6a9279487c217448efac652cdc25f0f3145634a8))

### [3.0.13](https://github.com/rucken/rucken/compare/v3.0.12...v3.0.13) (2021-12-28)

### [3.0.12](https://github.com/rucken/rucken/compare/v3.0.11...v3.0.12) (2021-12-28)

### 3.0.11 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.10 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.9 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.8 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### [3.0.7](https://github.com/rucken/rucken/compare/v3.0.4...v3.0.7) (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update package json ([a970979](https://github.com/rucken/rucken/commit/a97097914b703e0220156718b7e77634dbca88a9))
- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### [3.0.6](https://github.com/rucken/rucken/compare/v3.0.4...v3.0.6) (2021-12-28)

### Bug Fixes

- add readme to package json ([aa07ef6](https://github.com/rucken/rucken/commit/aa07ef636071328177b14d7d1d140ce034bc61e4))
- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))

### [3.0.5](https://github.com/rucken/rucken/compare/v3.0.4...v3.0.5) (2021-12-28)

### Bug Fixes

- update standard-version config add skip tag step ([1bbf219](https://github.com/rucken/rucken/commit/1bbf219895c3000e228510499f3db6c33a117fda))

### [3.0.4](https://github.com/rucken/rucken/compare/v3.0.3...v3.0.4) (2021-12-28)

### Bug Fixes

- update publish script ([3276d47](https://github.com/rucken/rucken/commit/3276d47e46281b056ecb69680f102649e412a723))
- update versions config ([f660887](https://github.com/rucken/rucken/commit/f6608879ba5ae2150cc46d0b62fefebfe45fb2f9))

### 3.0.3 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
- update config for standart versios ([d20097c](https://github.com/rucken/rucken/commit/d20097cb2d3f0ff6c3b22165c273a63cf56d1dd5))
- update publish script ([88ef7f8](https://github.com/rucken/rucken/commit/88ef7f819f46638efd40fcdeaeac2c1ae0511260))

### 3.0.3 (2021-12-28)

### Bug Fixes

- add conventional-github-releaser ([67a6a25](https://github.com/rucken/rucken/commit/67a6a25b98d618eb8746295d720f63de4a5d8bff))
