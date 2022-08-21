import { useCallback, useEffect, useMemo, useState } from "react";
import Tile, { TileType } from './components/Tile';
import { isEqual } from 'lodash'
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

type position = TileType['position']


/**
 * This function helps you determine what type of piece belongs to
 * a specific position at the start of the round.
 * @param coordinates row coordinate of tile to search for, that are best when destructured, each coord can be 7 at max.
 * @example
* let piece: { src: string | null } = { src: null }
* piece.src = getPiece(tiles[0].position)
 * 
 */
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
  /* const [selected, setSelected] = useState<TileType['position'] | null>(null); */
  const [selected, _setSelected] = usePrevious<TileType | null>(null);
  const setSelected = useCallback((val: TileType | null) => {
    _setSelected(val)
  }, [])

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

  useEffect(() => {
    if(isEqual(selected[0], selected[1])) {
      return
    }
    if(selected[0]?.src) {
      const temp = [...tiles]
      for(let i = 0; i < temp.length; i++) {
        if(isEqual(temp[i].position, selected[1]?.position)) {
          temp[i].src = selected[0].src
          temp[i].size = 70
          for(let j = 0; j < temp.length; j++) {
            if(isEqual(temp[j].position, selected[0]?.position)) temp[j].src = null
          }
          break
        }
      }
      setTiles(temp)
      setSelected(null)
    }
    /* console.log(selected[0]?.position, selected[1]?.position) */
  }, [selected])

  return <>
    <div className='relative w-screen h-screen flex justify-center items-center bg-orange-200'>
      {/* <input type="checkbox" checked={debug} onChange={() => setDebug(prev => !prev)} className='w-[5rem] fixed aspect-square cursor-pointer z-50 top-10 left-40' /> */}
      {debug && <span className='absolute w-20 aspect-square z-10 top-10 left-10'>x: {selected[1]?.position.y} y: {selected[1]?.position.x}</span>}
      <div className='relative h-[60rem] w-[60rem]' /* board */>
        { tiles.map(i => <Tile size={i.size} src={i.src} color={i.color} position={i.position} debug={debug} onClick={setSelected}/>) }
      </div>
    </div>
  </>
}
export default App


/**
 * 
*/
function usePrevious<T>(initial: T | null): [[null | T, null | T], (val: T) => void] {
  /* [prev, current], because append works similarly */
  const [state, setState] = useState<[null | T, null | T]>([null, initial]);

  function mutateState(val: T): void {
      setState(prev => [prev[1], val])
  }

  return [state, mutateState]
}