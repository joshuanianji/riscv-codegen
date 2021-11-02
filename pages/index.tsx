import type { NextPage } from 'next'
import Head from 'next/head'
import { Page, Grid, Text } from '@geist-ui/react'
import ThemeToggle from '@lib/ThemeToggle'
import CodegenApp from '@lib/CodegenApp'

const Home: NextPage = () => (
  <div>
    <Head>
      <title>RISC-V Codegen</title>
    </Head>
    <Page>
      <TopRow />
      <Content />
    </Page>
  </div>
)


const TopRow: React.FC = () => (
  <Grid.Container style={{
    marginTop: '1rem'
  }}>
    <Grid xs={6} />
    <Grid xs={6} />
    <Grid xs={6}><ThemeToggle /></Grid>
  </Grid.Container >
)

const Content: React.FC = () => (
  <Page.Content>
    <Grid.Container gap={2} justify='center'>
      <Grid xs={24} justify='center'><Text h1>RISC-V Code Generator</Text></Grid>
      <Grid xs={24} justify='center'><Text h3 small>Function Definition Automation</Text></Grid>
      <Grid xs={24} height='4em'></Grid>
      <Grid xs={20} md={16} lg={12}><CodegenApp /></Grid>
    </Grid.Container>
  </Page.Content>
)

export default Home
