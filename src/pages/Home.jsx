import { BrowseType, ExploreLive, Herosection, HowWork, JusoorFeature, WhyJusoor } from '../components'

const Home = () => {
  return (
    <div>
        <Herosection />
        <HowWork />
        <JusoorFeature />
        <ExploreLive />
        <WhyJusoor />
        <BrowseType />
    </div>
  )
}

export{Home}