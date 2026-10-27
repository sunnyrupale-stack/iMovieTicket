import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // In dev, with Vite proxy, connecting to origin or explicit port
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin);

    const s = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    s.on('connect', () => {
      // Socket connected
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
