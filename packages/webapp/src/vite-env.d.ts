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

interface ImportMetaEnv {
  readonly VITE_APP_API_ENDPOINT: string;
  readonly VITE_APP_REGION: string;
  readonly VITE_APP_USER_POOL_ID: string;
  readonly VITE_APP_USER_POOL_CLIENT_ID: string;
  readonly VITE_APP_IDENTITY_POOL_ID: string;
  readonly VITE_APP_PREDICT_STREAM_FUNCTION_ARN: string;
  readonly VITE_APP_SELF_SIGN_UP_ENABLED: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_MODEL_REGION: string;
  readonly VITE_APP_MODEL_ID: string;
  readonly VITE_APP_MULTI_MODAL_MODEL_IDS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
