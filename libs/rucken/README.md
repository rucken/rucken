Console nx tools

[![npm version](https://badge.fury.io/js/rucken.svg)](https://badge.fury.io/js/rucken)
[![monthly downloads](https://badgen.net/npm/dm/rucken)](https://www.npmjs.com/package/rucken)

## make-ts-list - create list of ts files for all nx libraries

> npx rucken "make-ts-list" "--help"

```sh
Usage: rucken make-ts-list|fl [options]

create list of ts files for all nx libraries

Options:
  -h, --help  display help for command
```

## version-updater - update versions in all nx applications

> npx rucken "version-updater" "--help"

```sh
Usage: rucken version-updater|vu [options]

update versions in all nx applications

Options:
  -upv,--update-package-version [boolean]  update package version (default: true)
  -h, --help                               display help for command
```

## translate - extract translate from source (run: extract-i18n => gettext => extract-i18n)

> npx rucken "translate" "--help"

```sh
Usage: rucken translate [options]

extract translate from source (run: extract-i18n => gettext => extract-i18n)

Options:
  -l,--locales [strings]         list of available languages (example: ru,en)
  -dl,--default-locale [string]  default locale (default: en)
  -h, --help                     display help for command
```

## extract-i18n - translate marker extractor (use: transloco-keys-manager + transloco-scoped-libs)

> npx rucken "extract-i18n" "--help"

```sh
Usage: rucken extract-i18n [options]

translate marker extractor (use: transloco-keys-manager + transloco-scoped-libs)

Options:
  -l,--locales [strings]  list of available languages (example: ru,en)
  -h, --help              display help for command
```

## gettext - translate marker extractor

> npx rucken "gettext" "--help"

```sh
Usage: rucken gettext [options]

translate marker extractor

Options:
  -l,--locales [strings]         list of available languages (example: ru,en)
  -dl,--default-locale [string]  default locale (default: en)
  -h, --help                     display help for command
```

## prepare - make-ts-list + version-update + translate

> npx rucken "prepare" "--help"

```sh
Usage: rucken prepare [options]

make-ts-list + version-update + translate

Options:
  -l,--locales [strings]                   list of available languages (example: ru,en)
  -dl,--default-locale [string]            default locale (default: en)
  -upv,--update-package-version [boolean]  update package version (default: true)
  -h, --help                               display help for command
```

## postgres - application database creator

> npx rucken "postgres" "--help"

```sh
Usage: rucken postgres [options]

postgres application database creator

Options:
  -r,--root-database-url [strings]  database url for connect as root user (example:
                                    postgres://ROOT_POSTGRES_USER:ROOT_POSTGRES_PASSWORD@localhost:POSTGRES_PORT/postgres?schema=public)
  -a,--app-database-url [strings]   application database url used for create new database (example:
                                    postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:POSTGRES_PORT/POSTGRES_DATABASE?schema=public)
  -d,--drop-app-database [boolean]  drop application database before try create it (default: false)
  -h, --help                        display help for command
```

## env-replacer - recursive replace input value with process environment values

> npx rucken "env-replacer" "--help"

```sh
Usage: rucken env-replacer [options] <input>

recursive replace input value with process environment values

Options:
  -h, --help  display help for command
```
