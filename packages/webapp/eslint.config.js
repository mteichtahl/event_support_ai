/* 
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  
  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import header from 'eslint-plugin-header'
import { fileURLToPath } from 'url'
import path from 'path'
import boundaries from "eslint-plugin-boundaries";
// import { settings } from './.eslintrc.cjs.poo'

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
header.rules.header.meta.schema = false

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    // languageOptions: {
    //   ecmaVersion: 2020,
    //   globals: globals.browser,
    // },
    plugins: {
      'react-hooks': reactHooks,
      // 'react-refresh': reactRefresh,
      header,
      boundaries
    },
    settings: {
      "boundaries/include": [ "src/**/*"],
      "boundaries/elements": [
        {
          "mode": "full",
          "type": "shared",
          "pattern": [
            "src/components/**/*",
            "src/data/**/*",
            "src/hooks/**/*",
            "src/lib/**/*",
            "src/localization/**/*",
          ]
        },
        {
          "mode": "full",
          "type": "feature",
          "capture": ["featureName"],
          "pattern": ["src/features/*/**/*"]
        },
        {
          "mode": "full",
          "type": "prompts",
          "capture": ["fileName"],
          "pattern": ["src/prompts/*"]
        },
        {
          "mode": "full",
          "type": "app",
          "capture": ["_", "fileName"],
          "pattern": ["src/app/**/*"]
        },
        {
          "mode": "full",
          "type": "neverImport",
          "pattern": ["src/*", "src/tasks/**/*"]
        }
      ]
    },
    rules: {
      'header/header': [2, path.join(__dirname, '../..', 'LicenseHeader.txt')],
      "boundaries/no-unknown": ["error"],
      "boundaries/no-unknown-files": ["error"],
      "boundaries/element-types": [
        "error",
        {
          "default": "disallow",
          "rules":[
            {
              "from": ["shared"],
              "allow": ["shared"]
            },
            {
              "from": ["feature"],
              "allow": [
                "shared",
                ["feature", { "featureName": "${from.featureName}" }]
              ]
            },
            {
              "from": ["app", "neverImport"],
              "allow": ["shared", "feature", "prompts"]
            },
            {
              "from": ["app"],
              "allow": [["app", { "fileName": "*.css" }]]
            }
          ]
        }
      ]
    },
  },
)
