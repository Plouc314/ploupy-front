// types
import { FC, IModel } from '../types'

// components
import Page from '../src/components/Page'
import MenuBar from '../src/components/MenuBar'
import Lobby from '../src/components/Lobby'
import Doc from '../src/components/Doc';

export interface PageHomeProps { }

const PageHome: FC<PageHomeProps> = (props) => {


  return (
    <Page
      withAuth
      withComm
      title='Home'
    >
      <MenuBar />
      <Doc />
      <Lobby />

    </Page >
  )
}

export default PageHome
