import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';


const RootStyle = styled('div')({
    height: '100vh',
    overflow: 'auto',
});

export default function AuthLayout() {
  
    return (
        <RootStyle>
            <Outlet />
        </RootStyle>
    );
}

