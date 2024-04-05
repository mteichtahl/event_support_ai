import { useCallback, useMemo } from 'react';
import TopNavigation from "@cloudscape-design/components/top-navigation";
import useSWR from 'swr';
import { Auth } from 'aws-amplify';

const MyTopNavigation: React.FC = () => {

  const signOut = useCallback(async () => {
    await Auth.signOut();
  }, []);

  const { data } = useSWR('user', async () => {
    return await Auth.currentAuthenticatedUser();
  });

  const email = useMemo(() => {
    return data?.signInUserSession?.idToken?.payload?.email ?? '';
  }, [data]);
  


  return (
    <TopNavigation
      identity={{
        href: "/",
        title: "イベントサポーター",
        // logo: {
        //   // src: "/logo-small-top-navigation.svg",
        //   alt: "Service"
        // }
      }}
      utilities={[
        // {
        //   type: "button",
        //   text: "Link",
        //   href: "https://example.com/",
        //   external: true,
        //   externalIconAriaLabel: " (opens in a new tab)"
        // },
        // {
        //   type: "menu-dropdown",
        //   iconName: "settings",
        //   ariaLabel: "Settings",
        //   title: "Settings",
        //   items: [
        //     {
        //       id: "settings-org",
        //       text: "Organizational settings"
        //     },
        //     {
        //       id: "settings-project",
        //       text: "Project settings"
        //     }
        //   ]
        // },
        {
          type: "menu-dropdown",
          text: email,
          // description: "description",
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