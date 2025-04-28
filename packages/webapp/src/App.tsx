import {
  AppLayout,
} from '@cloudscape-design/components';
import '@aws-amplify/ui-react/styles.css';

import { Outlet } from 'react-router-dom';

import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';

import TopNavigation from "./components/topNavigation"
import { SideNavi } from "./components/sideNavigation"

const LOCALE = 'au';


export default function App() {
  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <TopNavigation />
      <AppLayout
        maxContentWidth={Number.MAX_VALUE}
        navigation={
          <SideNavi />
        }
        // notifications={}
        toolsHide={true}
        // toolsOpen={true}
        // tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
        content={
          <Outlet />
        }
      // splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}
      />
    </I18nProvider>
  );
}