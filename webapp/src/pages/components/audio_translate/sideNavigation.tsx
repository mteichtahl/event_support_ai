import * as React from "react";
import SideNavigation from "@cloudscape-design/components/side-navigation";

export default () => {
  const [activeHref, setActiveHref] = React.useState(
    "#/page1"
  );
  return (
    <SideNavigation
      activeHref={activeHref}
      header={{ href: "#/", text: "Service name" }}
      // onFollow={event => {
      //   if (!event.detail.external) {
      //     event.preventDefault();
      //     setActiveHref(event.detail.href);
      //   }
      // }}
      items={[
        { type: "link", text: "ホーム", href: "/" },
        { type: "link", text: "通訳", href: "/audio_translate" },
        { type: "link", text: "Page 3", href: "#/page3" },
        { type: "link", text: "Page 4", href: "#/page4" },
        { type: "divider" }
      ]}
    />
  );
}