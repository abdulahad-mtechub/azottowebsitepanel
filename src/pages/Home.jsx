import { BrowseType, Contactform, ExploreLive, Herosection, HowWork, JusoorFeature } from '../components'

const Home = () => {
  return (
    <div>
        <Herosection />
        <HowWork />
        <JusoorFeature />
        <ExploreLive />
        <BrowseType />
        <Contactform />
    </div>
  )
}

export{Home}