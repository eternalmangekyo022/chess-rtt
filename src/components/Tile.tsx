import React from 'react'
import { motion } from 'framer-motion'

export type TileType = {
    color: string
    position: { x: number, y: number }
    src: null | string
    selected: boolean
}

interface TileProps extends TileType {
    onClick: (val: TileType) => void
    debug?: boolean
}

const size = {
    default: 60,
    active: 70
}

function Tile({ color, position, src, onClick, debug=false, selected }: TileProps): JSX.Element {
    /* '#EDEED1' : '#7FA650' */
    return <>
            <motion.div
            onClick={() => onClick({ color, position, src, selected })}
            style={{ left: `${position.x * 12.5}%`, top: `${position.y * 12.5}%` } }
            className={`h-[12.5%] w-[12.5%] absolute`}
            animate={{ backgroundColor: color  }}
            transition={{ duration: .3 }}
            >
                <div className='h-full w-full flex justify-center items-center'>
                    {debug && <span className='absolute top-0 w-full'>x: {position.y}<br/> y: {position.x}</span>}
                    {src &&
                        <motion.img
                            key={selected.toString()}
                            initial={{ width: `${selected ? size.default : size.active}%` }}
                            animate={{ width: `${selected ? size.active : size.default}%` }}
                            transition={{ duration: .15 }}
                            draggable={false} 
                            className='absolute cursor-pointer' 
                            src={src}
                        />
                    }
                </div>
            </motion.div>
    </>
}

export default React.memo(Tile);