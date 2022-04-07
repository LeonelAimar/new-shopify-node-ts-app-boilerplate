import "@shopify/polaris/build/esm/styles.css";
import { CustomStyleSheet } from "./interfaces/AppInterfaces";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Providers } from "./Providers";


import CustomRouter from "./router/CustomRouter";
import { Button, ButtonGroup } from "@shopify/polaris";
import { useCallback, useEffect, useRef, useState } from "react";

export default function App() {
    const location = useLocation()
    const navigate = useNavigate()
    const nowPath = useRef(location.pathname)

    useEffect(() => {
        nowPath.current = location.pathname
    }, [location.pathname])

    const handleFirstButtonClick = useCallback(() => {
        if (nowPath.current === '/') return;
        navigate('/')
    }, [nowPath])

    const handleSecondButtonClick = useCallback(() => {
        if (nowPath.current === '/config') return;
        navigate('/config')
    }, [nowPath]);

    return (
        <Providers>
            <nav
                style={styles.topNav}
            >
                <ButtonGroup segmented>
                    <Button pressed={location.pathname === '/'} 
                        onClick={handleFirstButtonClick}
                    >
                        Home
                    </Button>
                    <Button pressed={location.pathname === '/config'} 
                        onClick={handleSecondButtonClick}
                    >
                        Config
                    </Button>
                </ButtonGroup>
            </nav>
            <CustomRouter />
        </Providers>
    );
}

const styles: CustomStyleSheet = {
    topNav: {
        marginBottom: '1rem',
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1rem'
    },
    centerNav: {
        width: '20%',
        display: 'flex',
        justifyContent: 'space-between'
    }
}