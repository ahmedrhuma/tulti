import React from 'react';
import { useDispatch, Outlet } from '@umijs/max';
// import FastAccess from './FastAccess';

const Layout: React.FC = () => {
    const dispatch = useDispatch();
    dispatch({
        type: 'types/fetch'
    });
    
    return <>
        <Outlet />
        {/* <FastAccess /> */}
    </>
}

export default Layout;