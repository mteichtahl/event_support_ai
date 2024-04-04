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

export default function App() {
  return (
    <SpaceBetween size="s">
      <Container
        header={
          <Header variant="h2" description="言語設定とか">
            操作パネル
          </Header>
        }
      >
        <div className="contentPlaceholder">
          aaaa
        </div>
      </Container>
      
      <Container
        header={
          <Header
            variant="h2"
            description="Container description"
          >
            Container title
          </Header>
        }
      >
        <Grid
          gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}
        >
          <div>
            <Textarea
              value="aaaa"
              placeholder="Transcripts will appear here."
              readOnly
            />
          </div>
          <div>
            <Textarea
              value="日本語訳"
              placeholder="日本語訳"
              readOnly
            />
          </div>
        </Grid>
      </Container>
    </SpaceBetween>
    

  );
}