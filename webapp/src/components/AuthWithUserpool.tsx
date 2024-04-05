import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import {
  AppLayout
} from "@cloudscape-design/components";

import App from '../App.tsx';

const selfSignUpEnabled: boolean =
  import.meta.env.VITE_APP_SELF_SIGN_UP_ENABLED === 'true';

const AuthWithUserpool: React.FC = () => {
  Amplify.configure({
    Auth: {
      userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
      userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
      authenticationFlowType: 'USER_SRP_AUTH',
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
      >
        <App />
      </Authenticator>
    }
    />
      
    
  );
};

export default AuthWithUserpool;
