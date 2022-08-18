import React from 'react'

type TileProps = {
    color: 'black' | 'white'
    position: { x: number, y: number }
}

export interface TileType extends TileProps {}

function Tile({ color, position }: TileProps): JSX.Element {


    return <>
        <div style={{ left: `${position.x * 7.5}rem`, top: `${position.y * 7.5}rem`, backgroundColor: color } } className={`h-[7.5rem] w-[7.5rem] absolute bg-${color === 'white' ? 'white' : 'black'}`}></div>
    </>
}

export default React.memo(Tile);