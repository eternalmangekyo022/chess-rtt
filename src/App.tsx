import { useState } from "react"
import Tile, { TileType } from './components/Tile'
import './App.css'

let temp: TileType[] = [/* { color: 'white', position: { x: 1, y: 1 } } */];


for(let x = 0; x < 8; x++) {
  for(let y = 0; y < 8; y++) {
    temp.push({ color: x % 2 === 0 ? (y % 2 === 0 ? 'white' : 'black') : (y % 2 === 0 ? 'black' : 'white'), position: { x, y } })
  }
  /* temp.push({ color: row % 2 === 0 ? 'white' : 'black', position: { x: row % 8, y: Math.floor(row / 8) } }) */
}

function App(): JSX.Element {
  const [tiles, setTiles] = useState<TileType[]>(temp);

  return <>
    <div className="relative w-screen h-screen flex justify-center items-center">
      <div className='relative h-[60rem] w-[60rem] bg-gray-300'>
        { tiles.map(i => <Tile color={i.color} position={i.position}/>) }
      </div>
    </div>
  </>
}
export default App