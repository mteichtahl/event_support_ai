import {
  AppLayout,
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Header,
  Link,
} from '@cloudscape-design/components';
import '@aws-amplify/ui-react/styles.css';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.ja.json';

// import myTopNavigation from "./pages/components/topNavigation"
import MyTopNavigation from "./pages/components/topNavigation"
import List from "./pages/components/home/list"

const LOCALE = 'ja';


const App: React.FC = () => {
  return (

    <I18nProvider locale={LOCALE} messages={[messages]}>
      <MyTopNavigation></MyTopNavigation>
      <AppLayout
        maxContentWidth={Number.MAX_VALUE}
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#' },
            ]}
          />
        }
        navigationHide={true}
        // navigationOpen={false}
        // navigation={
        //  <SideNavigation/>
        // }
        // notifications={}
        toolsHide={true}
        // toolsOpen={false}
        // tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
        content={
          <ContentLayout
            header={
              <Header variant="h1">
                イベント運営をサポートするツール
              </Header>
            }
          >
            <Container
              header={
                <Header variant="h2">
                  サービス一覧
                </Header>
              }
            >
            <List />
              
            </Container>
          </ContentLayout>
        }
        // splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}
      />
    </I18nProvider>
  );
}

export default App;