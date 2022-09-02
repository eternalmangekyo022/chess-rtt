import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

type ModalProps = {
    open: boolean
    children: React.ReactNode    
    close: () => void
    theme: 1 | -1
    shadow?: boolean
    flex?: boolean
    closeButton?: boolean
}

function Modal({open, theme, children, flex=false, shadow=false, close, closeButton=false}: ModalProps): JSX.Element {
    

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
                        className={`rounded-xl w-[20%] h-[25%] min-h-[10rem] min-w-[15rem] max-w-[30rem] max-h-[30rem] ${theme === 1 ? 'bg-white' : 'bg-slate-400'} ${flex && 'flex'} justify-center items-center`}
                        initial={{ y: '100vh' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100vh' }}
                    >
                        {children}
                        { closeButton && 
                            <img
                                className='absolute w-10 h-10 top-[5%] right-[5%] cursor-pointer'
                                draggable={false}
                                onClick={close}
                                src='https://www.svgrepo.com/show/180983/cancel-close.svg'
                            />
                        }
                    </motion.div>
                </motion.div>
            }
            </AnimatePresence>
    </>
}

export default Modal