import React from 'react'
import { _theme } from '../App'
import { motion } from 'framer-motion'

export type TileType = {
    color: string
    position: { x: number, y: number }
    src: null | string
    size?: number
}

interface TileProps extends TileType {
    onClick: (val: TileType) => void
    debug: boolean
}

function Tile({ color, position, src, onClick, debug, size }: TileProps): JSX.Element {
    /* console.log(color) */
    /* '#EDEED1' : '#7FA650' */

    return <>
        <motion.div
        onClick={() => onClick({ color, position, src })}
        style={{ left: `${position.x * 7.5}rem`, top: `${position.y * 7.5}rem` } }
        className={`h-[7.5rem] w-[7.5rem] absolute`}
        animate={{ backgroundColor: color  }}
        transition={{ duration: .3 }}
        >
            <div className='h-full w-full flex justify-center items-center'>
                {debug && <span className='absolute top-0 w-full'>x: {position.y}<br/> y: {position.x}</span>}{src && <img draggable={false} width={`${size ? size : 70}%`} className='cursor-pointer' src={src} />}
            </div>
        </motion.div>
    </>
}

export default React.memo(Tile);