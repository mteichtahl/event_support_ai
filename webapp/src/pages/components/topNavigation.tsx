import * as React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";

const MyTopNavigation: React.FC = () => {
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
        // {
        //   type: "menu-dropdown",
        //   text: "Customer Name",
        //   description: "email@example.com",
        //   iconName: "user-profile",
        //   items: [
        //     { id: "profile", text: "Profile" },
        //     { id: "preferences", text: "Preferences" },
        //     { id: "security", text: "Security" },
        //     {
        //       id: "support-group",
        //       text: "Support",
        //       items: [
        //         {
        //           id: "documentation",
        //           text: "Documentation",
        //           href: "#",
        //           external: true,
        //           externalIconAriaLabel:
        //             " (opens in new tab)"
        //         },
        //         { id: "support", text: "Support" },
        //         {
        //           id: "feedback",
        //           text: "Feedback",
        //           href: "#",
        //           external: true,
        //           externalIconAriaLabel:
        //             " (opens in new tab)"
        //         }
        //       ]
        //     },
        //     { id: "signout", text: "Sign out" }
        //   ]
        // }
      ]}
    />
  );
}

export default MyTopNavigation