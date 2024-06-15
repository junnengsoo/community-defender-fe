import './App.css'
import CallerList from './components/CallerList'
import CallerCard from './components/CallerCard'

function App() {
  return (
      <div className="grid h-screen w-screen grid-flow-row grid-cols-5 grid-rows-2">
        <div className="h-screen col-span-1 row-span-3">
          <CallerList />
        </div>
        <div className="col-span-2 overflow-hidden">
          <CallerCard />
        </div>
        <div className="col-span-2">
          <CallerCard />
        </div>
        <div className="col-span-2">
          <CallerCard />
        </div>
        <div className="col-span-2">
          <CallerCard />
        </div>
      </div>
  )
}

export default App
