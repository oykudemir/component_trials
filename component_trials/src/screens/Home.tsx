import Slider from '../components/Slider'

const Home = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', height:'100vh', alignItems:'center'}}>
        <Slider type='multi' min={300} max={395} rangeColor='blue'/>
    </div>
  )
}

export default Home