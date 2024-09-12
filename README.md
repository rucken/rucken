# rucken

Console tools and scripts for nx and not only that I (EndyKaufman) use to automate the workflow and speed up the development process

[![npm version](https://badge.fury.io/js/rucken.svg)](https://badge.fury.io/js/rucken)
[![monthly downloads](https://badgen.net/npm/dm/rucken)](https://www.npmjs.com/package/rucken)

## make-ts-list - create list of ts files for all nx libraries

> npx rucken "make-ts-list" "--help"

```sh
Usage: rucken make-ts-list|mtsl [options]

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
  -l,--locales [strings]                    list of available languages (example: ru,en)
  -rut,--reset-unused-translates [boolean]  remove all translates if they not found in source code (default: true)
                                            (default: "true")
  -h, --help                                display help for command
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
  -r,--root-database-url [strings]       database url for connect as root user (example:
                                         postgres://ROOT_POSTGRES_USER:ROOT_POSTGRES_PASSWORD@localhost:POSTGRES_PORT/postgres?schema=public)
  -a,--app-database-url [strings]        application database url used for create new database (example:
                                         postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:POSTGRES_PORT/POSTGRES_DATABASE?schema=public)
  -fu,--force-change-username [boolean]  force rename username if one exists in database for app-database-url
                                         excluding root (default: false)
  -fp,--force-change-password [boolean]  force change password of specified app-database-url (default: false)
  -d,--drop-app-database [boolean]       drop application database before try create it (default: false)
  -h, --help                             display help for command
```

## env-replacer - recursive replace input value with process environment values

> npx rucken "env-replacer" "--help"

```sh
Usage: rucken env-replacer [options] <input>

recursive replace input value with process environment values

Options:
  -h, --help  display help for command
```

## copy-paste - copy paste source files to destination with singular and plural replace text in file contents and file paths

> npx rucken "copy-paste" "--help"

```sh
Usage: rucken copy-paste|cp [options]

copy paste source files to destination with singular and plural replace text in file contents and file paths

Options:
  -p,--path [strings]             the path with the source code to copy, it uses the current CWD if it is not defined, default: "." (example: ../../src)
  -f,--find [strings]             source singular text in kebab-case (example: user-role)
  -fp,--find-plural [strings]     source text in plural in kebab-case, if not defined, it will be automatically detected programmatically (example: user-rules)
  -r,--replace [strings]          destination singular text in kebab-case (example: user-company)
  -rp,--replace-plural [strings]  destination text in plural in kebab-case, if not defined, it will be automatically detected programmatically (example:
                                  user-companies)
  -d,--dest-path [strings]        the path with the destination code to paste, it uses the "path" if it is not defined, default: "." (example: ../../src)
  -e,--extensions [strings]       extensions of files for copy paste, default: "ts,html,htm,scss,css,txt,json,yaml,yml,xml,js.esm,sh" (example: py,ini)
  -gr,--glob-rules [strings]      match files using the patterns the shell uses
  -re,--replace-envs [strings]    do you need to replace environment variables when copying, you can specify a template, the default template is %key%
                                  (examples: "true", "%key%", "${key}")
  -h, --help                      display help for command
```

## License

MIT
