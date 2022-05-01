// types
import { FC } from '../types'

// components
import Page from '../components/Page'

export interface PageHomeProps { }

const PageHome: FC<PageHomeProps> = (props) => {
  return (
    <Page
      withAuth
      title='Home'
    >
      <p>hello</p>
    </Page>
  )
}

export default PageHome
