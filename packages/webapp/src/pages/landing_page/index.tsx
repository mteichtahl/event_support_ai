import {
  Container,
  ContentLayout,
  Header,
} from '@cloudscape-design/components';

import List from "./list"



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