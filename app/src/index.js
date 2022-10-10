import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from './shared/apollo'
import { Grommet, Layout, BootstrapConfig, ModalAlert } from 'components'
import Pages from './pages'
import theme from './theme'
import './shared/firebase'
import './index.css'

const client = getApolloClient()

ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={theme}>
      <Suspense fallback={null}>
        <RecoilRoot>
          <ApolloProvider client={client}>
            <BootstrapConfig />
            <ModalAlert />
            <Layout>
              <Pages />
            </Layout>
          </ApolloProvider>
        </RecoilRoot>
      </Suspense>
    </Grommet>
  </React.StrictMode>,
  document.getElementById('root')
)
