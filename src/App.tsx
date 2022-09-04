import { AnimatePresence, motion } from 'framer-motion';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import Tile, { TileType } from './components/Tile';

import BishopBlack from './pieces/bishop-black.png';
import KingBlack from './pieces/king-black.png';
import KnightBlack from './pieces/knight-black.png';
import PawnBlack from './pieces/pawn-black.png';
import QueenBlack from './pieces/queen-black.png';
import RookBlack from './pieces/rook-black.png';

import BishopWhite from './pieces/bishop-white.png';
import KingWhite from './pieces/king-white.png';
import KnightWhite from './pieces/knight-white.png';
import PawnWhite from './pieces/pawn-white.png';
import QueenWhite from './pieces/queen-white.png';
import RookWhite from './pieces/rook-white.png';


/**
 * TODO
 * counter
 * remaining piece logic
 * move: black.then(white.then(black.then(white)))
*/
const colors = { light: ['#EDEED1', '#7FA650'], dark: ['#70798C', '#2B303A'] };
const animationDistance = -70;
const now = new Date().getHours();

/* const typeSizes = {
    'bigint': () => 0,
    'symbol': () => 0,
    'function': () => 0,
    'undefined': () => 0,
    'boolean': () => 4,
    'number': () => 8,
    'string': (item: string) => 2 * item.length,
    'object': (item: { [key: string]: any }): number => !item ? 0 : Object
        .keys(item)
        .reduce((total, key) => sizeOf(key) + sizeOf(item[key]) + total, 0)
};

function sizeOf(value: any): number { return typeSizes[typeof value](value); } */
type position = TileType['position']


function App(): JSX.Element {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const history = useRef<TileType[][]>([]);
    const shouldRender = useRef<boolean>(true);
    const [tiles, setTiles] = useState<TileType[]>([]);
    const [started, setStarted] = useState<boolean>(false);
    const [selected, _setSelected] = usePrevious<TileType | null>(null);
    const setSelected = useCallback((val: TileType | null) => {
        _setSelected(val);
    }, []);
    const [theme, setTheme] = useState<1 | -1>((now < 7 || now >= 19) ? -1 : 1);
    const ref = useRef();

    useEffect(() => {
        resetBoard(theme)
            .then(res => { setTiles(res); history.current.push(res); });
    }, []);

    useEffect(() => {
        (async () => {
            started ? null : setTiles(await resetBoard(theme));
        })();
    }, [started]);

    useEffect(() => {
        if (tiles.length < 64) return;
        const temp = [...tiles];
        for (let i = 0; i < temp.length; i++) {
            getColor(theme, temp[i].position)
                .then(res => temp[i].color = res);
        }
        setTiles(temp);
    }, [theme]);

    useEffect(() => {
        if (!started) { setStarted(true); /* start timer */ }
        if (shouldRender.current) {
            if (isEqual(selected[0]?.position, selected[1]?.position)) {
                setSelected(null);
                shouldRender.current = false;
                return;
            } else if (selected[0]?.src && selected[1]?.position) /* piece moves */ {
                if (!canStep(selected[0] as firstType, selected[1])) {
                    setSelected(null);
                    return;
                }
                const temp = [...tiles];
                for (let i = 0; i < temp.length; i++) {
                    if (isEqual(temp[i].position, selected[1]?.position)) {
                        temp[i].src = selected[0].src;
                        for (let j = 0; j < temp.length; j++) {
                            if (isEqual(temp[j].position, selected[0]?.position)) temp[j].src = null;
                        }
                        break;
                    }
                }
                setTiles(temp);
                history.current.push(temp);
                setSelected(null);
                /* console.log(`${sizeOf(test.current) / (1024 * 1024)} MB`) */
            }
            return;
        }
        shouldRender.current = true;
    /* console.log(selected[0]?.position, selected[1]?.position) */
    }, [selected]);

    return <>

        <motion.div
            className={'relative w-screen h-screen flex justify-center items-center'}
            animate={{ backgroundColor: theme === 1 ? 'rgb(254, 215, 170)' : '#3F4E4F' }}
            transition={{ duration: .3 }}
        >
            <div className='absolute w-full h-10 top-10 flex justify-center items-center'>
                <AnimatePresence mode='wait'>
                    <motion.button /* starter/stopper button */
                        key={theme}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='w-10 h-10'
                        transition={{ delay: .05 }}
                        onClick={() => {
                            if (started) {
                                setModalOpen(true);
                                return;
                            }
                            setStarted(prev => !prev);
                        }}
                    >
                        {theme === 1 ? <span className='w-10 aspect-square text-4xl'>{started ? '⏹️' : '▶️'}</span> : <img className='w-10 aspect-square' src={started ? 'https://www.svgrepo.com/show/13614/stop-button.svg' : 'https://www.svgrepo.com/show/61248/play-button.svg'} />}
                    </motion.button>

                </AnimatePresence>
            </div>
            <div
                onClick={() => setTheme(theme === -1 ? 1 : -1)}
                className='absolute w-12 h-12 right-[15%] top-8 flex justify-center items-center cursor-pointer' /* container for animation */>
                <AnimatePresence>
                    <motion.div
                        className='w-12 absolute text-5xl'
                        key={theme}
                        initial={{ x: theme * animationDistance }}
                        animate={{ x: 0 }}
                        exit={{ x: theme * animationDistance, opacity: 0 }}
                    >
                        {theme === 1 ? <span>🌅</span> : <span>🌃</span>}
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className='relative min-w-[10rem] max-w-[50rem] w-full aspect-square' /* board: 240x240*/>
                {tiles.map((tile, i) =>
                    <div key={i}>
                        <Tile
                            selected={isEqual(tile.position, selected[1]?.position)}
                            src={tile.src}
                            color={tile.color}
                            position={tile.position}
                            onClick={setSelected} />
                    </div>)}
            </div>
            <Modal shadow flex open={modalOpen} close={() => setModalOpen(false)} theme={theme}>
                <span className='absolute left-1/2 -translate-x-[50%] top-[20%]'>Reset board and counter?</span>
                <div
                    className='absolute bottom-6 right-6 w-[10%] aspect-square cursor-pointer flex justify-center items-center'
                >
                    <div className='bg-white w-[90%] aspect-square rounded-full'></div>
                    <img
                        className='absolute w-[110%] aspect-square'
                        src='https://www.svgrepo.com/show/384403/accept-check-good-mark-ok-tick.svg'
                        onClick={async () => {
                            setTiles(await resetBoard(theme));
                            setStarted(false);
                            setModalOpen(false);
                        }}
                        draggable={false}
                    />

                </div>
                <img
                    src='https://www.svgrepo.com/show/286637/cancel-close.svg'
                    draggable={false}
                    onClick={async () => {
                        setModalOpen(false);
                    }}
                    className='absolute bottom-6 left-6 w-[10%] aspect-square cursor-pointer'
                />
            </Modal>
        </motion.div>
    </>;
}
/* Jp692a5bdp */
/**
 * Helps you determine what type of piece belongs to
 * a specific position at the start of the round.
 * @param coordinates row coordinate of tile to search for, that are best when destructured, each coord can be 7 at max.
 * @example ```typescript
 * let piece: { src: string | null } = { src: null }
 * piece.src = getPiece(tiles[0].position)
 * ```
*/
async function getPiece({ x, y }: position): Promise<string | null> {

    if (x === 1 || x === 6) /* pawn */ {
        return x === 1 ? PawnBlack : PawnWhite;
    }

    if (x === 7) /* white */ {
        if ([0, 7].includes(y)) return RookWhite;
        else if ([1, 6].includes(y)) return KnightWhite;
        else if ([2, 5].includes(y)) return BishopWhite;
        return y === 3 ? QueenWhite : KingWhite;
    }

    if (x === 0) /* black */ {
        if ([0, 7].includes(y)) return RookBlack;
        else if ([1, 6].includes(y)) return KnightBlack;
        else if ([2, 5].includes(y)) return BishopBlack;
        return y === 3 ? QueenBlack : KingBlack;
    }
    return null;
}

async function getColor(__theme: number, { x, y }: position): Promise<string> {
    return __theme === 1 ?
    /* light theme */
        x % 2 === 0 ?
            (y % 2 === 0 ?
                colors.light[0] :
                colors.light[1])
            : (y % 2 === 0 ?
                colors.light[1] :
                colors.light[0]) :
    /* non-light theme */
        x % 2 === 0 ?
            (y % 2 === 0 ?
                colors.dark[0] :
                colors.dark[1]) :
            (y % 2 === 0 ?
                colors.dark[1] :
                colors.dark[0]);
}

interface firstType extends TileType {
  src: string
}
function canStep(first: firstType, target: TileType): boolean {
    const [tx, ty, fx, fy] = [target.position.x, target.position.y, first.position.x, first.position.y];
    /* pawns done, cant take king */
    /** TODO
   * bishop, queen, knight, rook, king
  */
    const _first = {
        color: first.src.includes('black') ? 'black' : 'white'
    };

    const _target = {
        color: target.src ? (target.src.includes('black') ? 'black' : 'white') : null,
    };

    if ((_first.color === _target.color) || (target?.src?.includes('king'))) return false;


    if (first.src.includes('pawn')) {
        if (tx !== fx && !target.src) return false;
        if (_first.color === 'white') {
            if (!target.src) {
                if (ty < fy) {
                    if (fy === 6) {
                        if (ty < fy - 2) return false;
                    } else {
                        if (ty + 1 < fy) return false;
                    }
                } else {
                    return false;
                }
            } else {
                if (tx === fx || (tx != fx && ty === fy) || ty > fy) return false;
            }
        } else /* pawn black */ {
            if (tx !== fx && !target.src) return false;
            if (!target.src) {
                if (ty > fy) {
                    if (fy === 1) {
                        if (ty > fy + 2) return false;
                    } else {
                        if (ty - 1 > fy) return false;
                    }
                } else {
                    return false;
                }
            } else {
                if (tx === fx || (tx != fx && ty === fy) || ty < fy) return false;
            }
        }
    }
    return true;



    /* const piece = first.src?.split("./pieces/")[1].split(".png")[0]
  console.log(piece) // eg. white-knight */

}

/* async function addUser({ name, password }: { name: string, password: string }): Promise<void> {
  try {
    const res = await fetch(`https://europe-west1.gcp.data.mongodb-api.com/app/chess4life-ffndx/endpoint/users/add?name=${name}&password=${password}`, {
      method: 'POST',
    })
  } catch(e) {
    console.error(e)
  }
} */

// hooks
/**
 * 
*/
function usePrevious<T>(initial: T | null): [[null | T, null | T], (val: T) => void] {
    /* [prev, current], because append works similarly */
    const [state, setState] = useState<[null | T, null | T]>([null, initial]);

    function mutateState(val: T): void {
        setState(prev => [prev[1], val]);
    }

    return [state, mutateState];
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

async function resetBoard(theme: 1 | -1): Promise<TileType[]> {
    const temp: TileType[] = [];
    try {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                temp.push({
                    color: await getColor(theme, { x: y, y: x }),
                    position: { x: y, y: x },
                    selected: false,
                    src: await getPiece({ x, y })
                });
            }
        }
        return temp as TileType[];
    } catch (e) {
        throw new Error(`Something happened in getDefault(): ${e}`);
    }
}


export default App;