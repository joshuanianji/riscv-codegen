import type { NextPage } from 'next'
import Head from 'next/head'
import { Page, Grid, Text, Link } from '@geist-ui/react'
import ThemeToggle from '@lib/ThemeToggle'
import CodegenApp from '@lib/CodegenApp'
import { Github, HeartFill } from '@geist-ui/react-icons'

const Home: NextPage = () => (
  <div>
    <Head>
      <title>RISC-V Codegen</title>
    </Head>
    <Page>
      <TopRow />
      <Content />
      <Footer />
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
      <Grid xs={24} md={20} lg={16}><CodegenApp /></Grid>
    </Grid.Container>
  </Page.Content>
)

const Footer: React.FC = () => (
  <Page.Footer>
    <Grid.Container gap={2} justify='center'>
      <Grid xs={24} justify='center'>
        <Link href='riscv-codegen.vercel.app' block>
          By @joshuanianji
        </Link>
      </Grid>
      <Grid xs={24} justify='center'></Grid>
    </Grid.Container>

  </Page.Footer>
)

export default Home
