import { useCallback, useEffect, useState } from "react";
import Tile, { TileType } from './components/Tile';
import Moon from './components/Moon';
import Sun from './components/Sun';
import { isEqual } from 'lodash';
import { atom, useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion'
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

const colors = { light: ['#EDEED1', '#7FA650'], dark: ['#70798C', '#2B303A'] }

const now = new Date().getHours()
const _theme = atom< 1 /* light */ | -1 /* dark */ >(now < 7 || now > 20 ? -1 : 1)
export { _theme }


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
async function getPiece({ x, y }: position): Promise<string | null> {


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

async function getColor(__theme: number, { x, y }: position): Promise<string> {
  return __theme === 1 ? /* light theme */(x % 2 === 0 ? (y % 2 === 0 ? colors.light[0] : colors.light[1]) : (y % 2 === 0 ? colors.light[1] : colors.light[0])) : /* non-light theme */(x % 2 === 0 ? (y % 2 === 0 ? colors.dark[0] : colors.dark[1]): (y % 2 === 0 ? colors.dark[1] : colors.dark[0]))
}

function App(): JSX.Element {
  const [tiles, setTiles] = useState<TileType[]>([]);
  const [selected, _setSelected] = usePrevious<TileType | null>(null);
  const setSelected = useCallback((val: TileType | null) => {
    _setSelected(val)
  }, [])
  const [theme, setTheme] = useAtom(_theme)

  useEffect(() => {
    const temp: TileType[] = []

    const addTile = async({ x, y }: position): Promise<number> => temp.push({ color: await getColor(theme, { x, y }), position: { x, y }, src: await getPiece({ x: y, y: x }) })

    for(let y = 0; y < 8; y++) {
      for(let x = 0; x < 8; x++) {
        addTile({ x, y })
      }
      /* temp.push({ color: row % 2 === 0 ? 'white' : 'black', position: { x: row % 8, y: Math.floor(row / 8) } }) */
    }
    setTiles(temp)
  }, [])

  useEffect(() => {
    if(tiles.length < 64) return
    const temp = [...tiles];
    for(let i = 0; i < temp.length; i++) {
      getColor(theme, temp[i].position)
        .then(res => temp[i].color = res)
    }
    setTiles(temp)
  }, [theme])

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
    <motion.div
    className={`relative w-screen h-screen flex justify-center items-center`}
    animate={{ backgroundColor: theme === 1 ? 'rgb(254, 215, 170)' : 'rgb(17, 24, 39)' }}
    transition={{ duration: .3 }}
    >
      <div onClick={() => setTheme(theme === -1 ? 1 : -1)} className='absolute w-12 h-12 right-24 top-12 flex justify-center items-center cursor-pointer' /* container for animation */>
        <AnimatePresence initial={false}>
          <motion.div
          className='w-12 absolute'
          key={theme}
          initial={{x: theme * -50}}
          animate={{ x: 0 }}
          exit={{ x: theme * -50, opacity: 0 }}
          >
            {theme === 1 ? <Sun/> : <Moon/>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='relative h-[60rem] w-[60rem]' /* board */>
        { tiles.map(i => <Tile size={i.size} src={i.src} color={i.color} position={i.position} debug={false} onClick={setSelected}/>) }
      </div>
    </motion.div>
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

/**
 * Works with booleans, strings and numbers
 * @param initial A list containing values to toggle between
 * @example
 * const [weather, toggleWeather] = useToggle(['sunny', 'cloudy']);
 * weather -> 'sunny'
 * toggleWeather() -> 'cloudy'
 * toggleWeather() -> 'sunny'
*/
/* function useToggle<T=string | number | boolean>(initial: [T, T]): [T, () => void] {
  const [state, setState] = useState<T>(initial[0]);

  function toggle(): void {
    setState(prev => prev === initial[0] ? initial[1] : initial[0])
  }

  return [state, toggle]
} */