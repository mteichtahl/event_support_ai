import {
  AppLayout,
  Box,
  BreadcrumbGroup,
  Cards,
  Container,
  ContentLayout,
  Flashbar,
  Grid,
  Header,
  HelpPanel,
  Link,
  SpaceBetween,
  SplitPanel,
  Textarea,
} from '@cloudscape-design/components';
import { Outlet } from 'react-router-dom';

import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';

import SideNavigation from "./pages/components/sideNavigation"

const LOCALE = 'ja';


export default function App() {
  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        maxContentWidth={Number.MAX_VALUE}
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '/' },
              { text: 'audio_translate', href: '/audio_translate' },
            ]}
          />
        }
        // navigationHide={true}
        // navigationOpen={false}
        navigation={
         <SideNavigation/>
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