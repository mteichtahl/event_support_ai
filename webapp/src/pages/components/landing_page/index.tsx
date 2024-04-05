import {
  AppLayout,
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Header,
  Link,
} from '@cloudscape-design/components';

import List from "../home/list"



const App: React.FC = () => {
  return (
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
  );
}

export default App;