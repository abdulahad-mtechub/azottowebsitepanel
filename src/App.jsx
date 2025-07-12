import { ConfigProvider } from 'antd'
import { RouteF } from './RouteF'

function App() {

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1D4ED8',
          colorError: '#BC302F',
        },
        components:{
          Timeline: {
            dotBg: 'transparent',
          },
        }
      }}
    >
      <RouteF />
    </ConfigProvider>
  )
}

export default App
