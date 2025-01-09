import { Box } from '@mui/material'
import React, { ReactNode } from 'react'


interface BackgroundProps {
    children: ReactNode;
    isMainLayout?: boolean;
}

const Background = ({
    children,
    isMainLayout,
}: BackgroundProps) => {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                '&::after': {
                    position: 'absolute',
                    ...isMainLayout ? {
                        right: '-15%',
                        top: '-25%',
                        width: '50%',
                        height: '50%',
                        filter: 'blur(300px)',
                        opacity: 0.1,
                    } : {
                        right: '-95%',
                        top: '-95%',
                        width: 439,
                        height: 470,
                        opacity: 0.2,
                        filter: 'blur(197px)',
                    },
                    background: '#1597F5',
                    content: "''",

                    zIndex: - 1,
                },
                '&::before': {
                    position: 'absolute',
                    ...isMainLayout ? {
                        right: 0,
                        bottom: '-50%',
                        width: '50%',
                        height: '50%',
                        filter: 'blur(300px)',
                        opacity: 0.1,

                    } : {
                        left: '-90%',
                        bottom: '-90%',
                        opacity: 0.2,
                        width: 378,
                        height: 523,
                        filter: 'blur(197px)',
                    },

                    background: '#00019F',

                    content: "''",

                    zIndex: - 1,
                }

            }}
        >
            {isMainLayout && (
                <Box
                    sx={{
                        position: 'absolute',
                        width: '536px',
                        height: '536px',
                        left: 97,
                        bottom: -80,
                        background: '#00019F',
                        opacity: 0.1,
                        filter: 'blur(250px)',
                    }}
                />
            )}

            {children}


        </Box>
    )
}

export default Background