"use client";

import path from "path";
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { io as clientIO } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const socketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    return useContext(socketContext);
};

export const SocketProvider = ({ children 

} : { children: React.ReactNode }) => {
    const [ socket, setSocket ] = useState(null);
    const [ isConnected, setIsConnected ] = useState(false);
    // After deploying enter your domain URL here instead of NEXT_PUBLIC_SUTE_URL
    useEffect(() => {
        const socketInstance = new (clientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });
        
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
        
    }, [] );

    return (
        <socketContext.Provider value={{ socket, isConnected}}>
            { children }
        </socketContext.Provider>
    )
}