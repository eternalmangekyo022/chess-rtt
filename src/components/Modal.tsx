import { AnimatePresence, motion } from 'framer-motion'
import React, { Children } from 'react'

type ModalProps = {
    open: boolean
    children: React.ReactNode    
    shadow?: boolean
    flex?: boolean
    close: () => void
}

function Modal({open, children, flex=false, shadow=false, close}: ModalProps): JSX.Element {
    

    return <>
        <AnimatePresence>
            {open && 
                <motion.div /* mainframe */ 
                    className={`z-[50] w-screen h-screen absolute ${shadow && 'bg-gray-500 bg-opacity-40'} flex justify-center items-center`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`rounded-xl w-[20%] h-[25%] min-h-[10rem] min-w-[15rem] max-w-[30rem] max-h-[30rem] bg-white ${flex && 'flex'}`}
                        initial={{ y: '100vh' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100vh' }}
                    >
                        {children}
                        <button 
                            onClick={close}
                            className='absolute w-10 h-10 top-[5%] right-[5%] bg-slate-400'
                        ></button>
                        
                    </motion.div>
                </motion.div>
            }
            </AnimatePresence>
    </>
}

export default Modal