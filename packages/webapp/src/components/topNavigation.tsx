import TopNavigation from "@cloudscape-design/components/top-navigation";
import { useAuthenticator } from '@aws-amplify/ui-react';

const MyTopNavigation: React.FC = () => {

  const { signOut, user } = useAuthenticator();
  


  return (
    <TopNavigation
      identity={{
        href: "/",
        title: "イベントサポーター",
      }}
      utilities={[
        {
          type: "menu-dropdown",
          text: user.username,
          iconName: "user-profile",
          items: [
            { 
              id: "signout", 
              text: "Sign out",
            }
          ],
          onItemClick: (event) => {
            if (event.detail.id === "signout") {
              signOut();
            }
          }
        }
      ]}
    />
  );
}

export default MyTopNavigation