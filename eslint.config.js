const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslintEslintPlugin = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",
        },

        globals: {
            ...globals.node,
            ...globals.jest,
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslintEslintPlugin,
    },

    extends: compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ),

    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "import/prefer-default-export": "off",

        "@typescript-eslint/naming-convention": ["off", {
            "selector": ["variable", "classProperty"],
            "format": ["camelCase"],

            "filter": {
                "regex": "(__meta|_id|_doc)",
                "match": true,
            },
        }],

        "no-underscore-dangle": ["error", {
            "allow": ["__meta", "_id", "_doc"],
        }],

        "no-restricted-syntax": ["off", {
            "selector": "ForOfStatement[await=true]",
            "message": "Todo: Required by EventStoreDB, Check for a better solution.",
        }],
    },
}, globalIgnores(["**/eslint.config.js"])]);
