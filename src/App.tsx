import './App.css'
import CallerList from './components/CallerList'
import CallCard from './components/CallerCard'

function App() {
  return (
    <>
      <div className="grid h-full grid-flow-dense grid-cols-5 grid-rows-3">
        <div className="col-span-1 row-span-3">
          <CallerList />
        </div>
        <div className="col-span-2">
          <CallCard />
        </div>
        <div className="col-span-2">
          <CallCard />
        </div>
        <div className="col-span-2">
          <CallCard />
        </div>
        <div className="col-span-2">
          <CallCard />
        </div>
      </div>
    </>
  )
}

export default App
