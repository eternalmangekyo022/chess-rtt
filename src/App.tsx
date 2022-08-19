import { useEffect, useMemo, useState } from "react";
import Tile, { TileType } from './components/Tile';
import './App.css';

import QueenBlack from './pieces/queen-black.png';
import KnightBlack from './pieces/knight-black.png';
import RookBlack from './pieces/rook-black.png';
import PawnBlack from './pieces/pawn-black.png';
import BishopBlack from './pieces/bishop-black.png';
import KingBlack from './pieces/king-black.png';

import QueenWhite from './pieces/queen-white.png';
import KnightWhite from './pieces/knight-white.png';
import RookWhite from './pieces/rook-white.png';
import PawnWhite from './pieces/pawn-white.png';
import BishopWhite from './pieces/bishop-white.png';
import KingWhite from './pieces/king-white.png';

const colors = { light: '#EDEED1', dark: '#7FA650' }

type position = { x: number, y: number }

function getPiece({ x, y }: position): string | null {


  if(x === 1 || x === 6) /* pawn */ {
    return x === 1 ? PawnBlack : PawnWhite
  }

  if(x === 7) /* white */ {
    if([0, 7].includes(y)) return RookWhite
    else if([1, 6].includes(y)) return KnightWhite
    else if([2, 5].includes(y)) return BishopWhite
    return y === 3 ? QueenWhite : KingWhite
  }

  if(x === 0) /* black */ {
    if([0, 7].includes(y)) return RookBlack
    else if([1, 6].includes(y)) return KnightBlack
    else if([2, 5].includes(y)) return BishopBlack
    return y === 3 ? QueenBlack : KingBlack
  }

  return null
}


function App(): JSX.Element {
  const [tiles, setTiles] = useState<TileType[]>([]);
  const [debug, setDebug] = useState<boolean>(false);
  const [selected, setSelected] = useState<TileType['position'] | null>(null);

  useEffect(() => {
    const temp: TileType[] = []
    for(let y = 0; y < 8; y++) {
      for(let x = 0; x < 8; x++) {
        const piece = getPiece({ x: y, y: x })
        temp.push({ color: x % 2 === 0 ? (y % 2 === 0 ? colors.light : colors.dark) : (y % 2 === 0 ? colors.dark : colors.light), position: { x, y }, src: piece })
      }
      /* temp.push({ color: row % 2 === 0 ? 'white' : 'black', position: { x: row % 8, y: Math.floor(row / 8) } }) */
    }
    setTiles(temp)
  }, [])



  return <>
    <div className='relative w-screen h-screen flex justify-center items-center bg-orange-200'>
      <input type="checkbox" checked={debug} onChange={() => setDebug(prev => !prev)} className='w-[5rem] fixed aspect-square cursor-pointer z-50 top-10 left-40' />
      {debug && <span className='absolute w-20 aspect-square z-10 top-10 left-10'>x: {selected?.y} y: {selected?.x}</span>}
      <div className='relative h-[60rem] w-[60rem]' /* board */>
        { tiles.map(i => <Tile src={i.src} color={i.color} position={i.position} debug={debug} onClick={setSelected}/>) }
      </div>
    </div>
  </>
}
export default App