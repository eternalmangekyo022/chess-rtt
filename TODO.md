whenever a tile changes, it tracks it down, so that
the next time I click on a piece if its not the same piece its going to
replace piece[0] with piece[1]


tile changes, if prev tile !== null then current tile = prev

function usePrevious<T>(initial?: T = null): [null | T, null | T] {
    <!-- [prev, current], because append works similarly -->
    const [state, setState] = useState<[null | T, null | T]>([null, initial]);

    function mutateState(val: T): void {
        setState(prev => [prev[1], val])
    }

    return state

}