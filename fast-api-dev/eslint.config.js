const js = require('@eslint/js')
const globals = require('globals')


module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn'
    }
  },
  {
    files: ['tests/**/*.js', '**/*.test.js'],
    languageOptions: {
      globals: globals.jest
    }
  }
]
