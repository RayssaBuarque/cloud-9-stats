import CountItem from './components/Count_item/Count-item-component'
import './App.css'

function App() {
  return (
    <>
      <div>
        <div className='count-bar'>
          <div className='count-items'>
            <CountItem title="Eventos" count="X"/>
            <CountItem title='Vitórias' count="Y"/>
            <CountItem title='Membros' count="9"/>
          </div>
        </div>

        <h1>Cloud 9 Stats</h1>


      </div>
    </>
  )
}

export default App
