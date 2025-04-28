import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { AppLayout } from "@cloudscape-design/components";


import App from '../App.tsx';

const selfSignUpEnabled: boolean =
  import.meta.env.VITE_APP_SELF_SIGN_UP_ENABLED === 'true';

const AuthWithUserpool: React.FC = () => {
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
    <AppLayout
      navigationHide={true}
      toolsHide={true}
      disableContentPaddings={true}
      maxContentWidth={Number.MAX_VALUE}
      content={
        <Authenticator
          hideSignUp={!selfSignUpEnabled}
          variation='modal'
        >
          <App />
        </Authenticator>
      }
    />
  );
};

export default AuthWithUserpool;
