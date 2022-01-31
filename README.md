# rucken

Console nx tools for rucken

## make-ts-list - create list of ts files for all nx libraries

> npx rucken "make-ts-list" "--help"

```
Usage: main make-ts-list|fl [options]

create list of ts files for all nx libraries

Options:
  -h, --help  display help for command
```

## version-updater - update versions in all nx applications

> npx rucken "version-updater" "--help"

```
Usage: main version-updater|vu [options]

update versions in all nx applications

Options:
  -upv,--update-package-version [boolean]  update package version (default: true)
  -h, --help                               display help for command
```

## translate - extract translate from source (run: extract-i18n => gettext => extract-i18n)

> npx rucken "translate" "--help"

```
Usage: main translate [options]

extract translate from source (run: extract-i18n => gettext => extract-i18n)

Options:
  -l,--locales [strings]         list of available languages (example: ru,en)
  -dl,--default-locale [string]  default locale (default: en)
  -h, --help                     display help for command
```

## extract-i18n - translate marker extractor (use: transloco-keys-manager + transloco-scoped-libs)

> npx rucken "extract-i18n" "--help"

```
Usage: main extract-i18n [options]

translate marker extractor (use: transloco-keys-manager + transloco-scoped-libs)

Options:
  -l,--locales [strings]  list of available languages (example: ru,en)
  -h, --help              display help for command
```

## gettext - translate marker extractor

> npx rucken "gettext" "--help"

```
Usage: main gettext [options]

translate marker extractor

Options:
  -l,--locales [strings]         list of available languages (example: ru,en)
  -dl,--default-locale [string]  default locale (default: en)
  -h, --help                     display help for command
```

## prepare - make-ts-list + version-update + translate

> npx rucken "prepare" "--help"

```
Usage: main prepare [options]

make-ts-list + version-update + translate

Options:
  -l,--locales [strings]                   list of available languages (example: ru,en)
  -dl,--default-locale [string]            default locale (default: en)
  -upv,--update-package-version [boolean]  update package version (default: true)
  -h, --help                               display help for command
```
