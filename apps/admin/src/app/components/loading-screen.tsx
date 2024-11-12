import { styled, SxProps } from '@mui/material/styles';
import ProgressBar from './progress-bar/progress-bar';
import { motion } from 'framer-motion';
import Logo from './logo';
import { Box } from '@mui/material';

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  //backgroundColor: theme.palette.background.paper,
  backgroundColor: '#f5f5f5',
  '& .wrapper': {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: '-100px',
    marginTop: '-100px',
    width: '200px',
    height: '200px',
    backgroundColor: 'transparent',
  },
  '& .box-wrap': {
    width: '70%',
    height: '70%',
    margin: 'calc((100% - 70%) / 2) calc((100% - 70%) / 2)',
    position: 'relative',
    transform: 'rotate(-45deg)',
  },
  '& .box': {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    background: `linear-gradient(
      to right,
      #141562,
      #486fbc,
      #eab5a1,
      #8dd6ff,
      #4973c9,
      #d07ca7,
      #f4915e,
      #f5919e,
      #b46f89,
      #141562,
      #486fbc
    )`,
    backgroundSize: '1000% 1000%',
  }
}));

// ----------------------------------------------------------------------

type Props = {
  isDashboard?: boolean;
  sx?: SxProps;
};

export function LoadingScreen({ isDashboard = true, ...other }: Props) {
  return (
    <>
      <ProgressBar />

      {!isDashboard && (
        <RootStyle {...other}>
          <Box
            sx={{
              position: 'relative',
              width: 225,
              height: 225,
            }}
          >
            {/* Animated rotating and growing arc */}
            <Box
              component={motion.svg}
              width="225"
              height="225"
              viewBox="0 0 50 50"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              sx={{ position: 'absolute', top: 0, left: 0 }}
              borderColor={['#0b1436', '#363392', '#d21e3f']}
            >
              <defs>
                <linearGradient id="gradientArc" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#0b1436" />
                  <stop offset="50%" stopColor="#363392" />
                  <stop offset="100%" stopColor="#d21e3f" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="25"
                cy="25"
                r="20"
                stroke="url(#gradientArc)" // Apply gradient
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="125"
                strokeDashoffset="100"
                animate={{
                  strokeDashoffset: [100, 0], // Progress animation
                  //stroke: ['#0b1436', '#363392', '#d21e3f'], // Color change animation
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3, // Total duration for color and progress animation
                  ease: 'easeInOut',
                  //  times: [0, 0.5, 1], // Ensure smooth transition through colors
                }}
              // transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              />
            </Box>


            <Logo sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} />
          </Box>
          {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[0, 1, 2, 3, 4].map((index) => (
                <motion.div
                  key={index}
                  variants={blockVariants}
                  
                  animate="animate"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10%',
                    backgroundColor: colors[index % colors.length],
                  }}
                />
              ))}
            </Box>
          </Box> */}
        </RootStyle>
      )}
    </>
  );
}
