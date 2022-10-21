import { AnimatePresence, motion } from 'framer-motion';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import Tile, { TileType } from './components/Tile';
import { usePrevious, canStep, getColor, resetBoard, firstType/* , getPiece */ } from './hooks';




/**
 * TODO
 * counter
 * remaining piece logic
 * move: black.then(white.then(black.then(white)))
*/
const animationDistance = (): number => window.innerWidth < 440 ? -60 : -75;
const now = new Date().getHours();


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
                if (!canStep(selected[0] as firstType, selected[1], tiles)) {
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
            animate={{ backgroundColor: theme === 1 ? 'rgb(254, 215, 170)' : '#1c4648' }}
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
                        initial={{ x: theme * animationDistance() }}
                        animate={{ x: 0 }}
                        exit={{ x: theme * animationDistance(), opacity: 0 }}
                    >
                        {theme === 1 ? <span>🌅</span> : <span>🌃</span>}
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className='relative min-w-[10rem] max-w-[45rem] w-full aspect-square' /* board: 240x240*/>
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



export default App;