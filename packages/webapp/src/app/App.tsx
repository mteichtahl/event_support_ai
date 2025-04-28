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
import { AppLayout } from '@cloudscape-design/components';
import '@aws-amplify/ui-react/styles.css';
import { Outlet } from 'react-router-dom';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import TopNavigation from "../components/topNavigation"
import { SideNavigation } from "../components/sideNavigation"
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

const LOCALE = 'au';
const selfSignUpEnabled: boolean = import.meta.env.VITE_APP_SELF_SIGN_UP_ENABLED === 'true';


export default function App() {

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
        userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
        identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
      },
    },
  });

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <Authenticator
        hideSignUp={!selfSignUpEnabled}
        variation='modal'
      >
        <TopNavigation />
        <AppLayout
          maxContentWidth={Number.MAX_VALUE}
          navigation={<SideNavigation />}
          toolsHide={true}
          navigationHide={true}
          content={<Outlet />}
        />
      </Authenticator>
    </I18nProvider>
  );
}