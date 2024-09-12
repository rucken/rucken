export interface CopyPasteConfig {
  copyPaste: {
    extensions: string;
    cases: string[];
    envReplacerKeyPattern: string;
  };
}

export const DEFAULT_COPY_PASTE_CONFIG: CopyPasteConfig = {
  copyPaste: {
    extensions: 'ts,html,htm,scss,css,txt,json,yaml,yml,xml,js.esm,sh',
    cases: [
      // 🐪 camelCase
      'camelCase',
      // 🐫 PascalCase
      'pascalCase',
      // 🐫 UpperCamelCase
      'upperCamelCase',
      //🥙 kebab-case
      'kebabCase',
      // 🐍 snake_case
      'snakeCase',
      // 📣 CONSTANT_CASE
      'constantCase',
      // 🚂 Train-Case
      'trainCase',
      // 🕊 Ada_Case
      'adaCase',
      // 👔 COBOL-CASE
      'cobolCase',
      // 📍 Dot.notation
      // 'dotNotation',
      // 📂 Path/case
      // 'pathCase',
      // 🛰 Space case
      'spaceCase',
      // 🏛 Capital Case
      'capitalCase',
      // 🔡 lower case
      'lowerCase',
      // 🔠 UPPER CASE
      'upperCase',
    ],
    envReplacerKeyPattern: '%key%',
  },
};
