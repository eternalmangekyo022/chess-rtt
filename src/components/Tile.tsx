import React from 'react'

export type TileType = {
    color: string
    position: { x: number, y: number }
    src: null | string
}

interface TileProps extends TileType {
    onClick: React.Dispatch<React.SetStateAction<TileType['position'] | null>>
    debug: boolean
}

function Tile({ color, position, src, onClick, debug }: TileProps): JSX.Element {


    return <>
        <div onClick={() => onClick(src ? position : null)} style={{ left: `${position.x * 7.5}rem`, top: `${position.y * 7.5}rem`, backgroundColor: color } } className={`h-[7.5rem] w-[7.5rem] absolute`}>
            <div className='h-full w-full flex justify-center items-center'>
                {debug && <span className='absolute top-0 w-full'>x: {position.y}<br/> y: {position.x}</span>}{src && <img width={'70%'} src={src} />}
            </div>
        </div>
    </>
}

export default React.memo(Tile);