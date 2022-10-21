import { TileType } from './components/Tile';
import { useState } from 'react';

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

const colors = { light: ['#EDEED1', '#7FA650'], dark: ['#70798C', '#2B303A'] };
type position = TileType['position']


export async function getPiece({ x, y }: position): Promise<string | null> {
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

export const getColor = async (__theme: number, { x, y }: position): Promise<string> => (x + y) % 2 === 0 ? colors[__theme === 1 ? 'light' : 'dark'][0] : colors[__theme === 1 ? 'light' : 'dark'][1];

export interface firstType extends TileType {
    src: string
}

export function canStep(first: firstType, target: TileType, tiles: TileType[]): boolean {
    const [tx, ty, fx, fy] = [target.position.x, target.position.y, first.position.x, first.position.y];
    /* pawns done, cant take king */
    /** TODO
   * bishop, queen, knight, rook, king
  */

    const pieceByPos = ({ x, y }: position): TileType => tiles.find(i => i.position.x === x && i.position.y === y) as TileType;

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
                        if (ty < fy - 2 || pieceByPos({ x: tx, y: 5 }).src) return false;
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

// hooks
/**
 * 
*/
export function usePrevious<T>(initial: T | null): [[null | T, null | T], (val: T) => void] {
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
        setState(prev => prev === initial[0] ? initial[1] : initial[0]);
    }
 
    return [state, toggle];
} */

export async function resetBoard(theme: 1 | -1): Promise<TileType[]> {
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