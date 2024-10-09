import { createContext, useEffect, useState } from "react";
//@ts-ignore
import signalr from 'react-native-signalr';
import { hubName, signalrHubUrl } from "./const";

interface Stuff {
    hubStatus: 'connect' | 'slow-connect' | 'not-connect'
}
export const SignalRContext = createContext<Stuff>({ hubStatus: 'not-connect' })
export const SignalrProvider = ({ children }: any) => {
    const [signalRStatus, setSignalRStatus] = useState<'connect' | 'slow-connect' | 'not-connect'>('not-connect');
    useEffect(() => {
        const connection = signalr.hubConnection(signalrHubUrl);
        //connection.logging=true;
        const proxy = connection.createHubProxy(hubName);
        proxy.on('sendSignal', (msg: string, param: string) => {
            // do something
        });
        connection.qs = {
            RestaurantId: '123',
            DeviceId: 'DeviceId'
        };
        connection.start()
            .done(() => {
                setSignalRStatus('connect');
            })
            .fail(() => {
                setSignalRStatus('not-connect');
            });
        connection.connectionSlow(() => {
            setSignalRStatus('not-connect');
        });
        connection.stateChanged((state: any) => {
            //When app disconnect signalr (state=4)=>try to reconnect after 4s
            //1: connected
            //2: reconnectiong
            // 4:disconnected
            if (state.newState == 4) {
                setTimeout(function () {
                    setSignalRStatus('not-connect');
                    connection.start().done(() => {
                        setSignalRStatus('connect');
                    });
                }, 4000);
            }

        });
        connection.stateChanged((error: any) => {
            setSignalRStatus('not-connect');
        });
        return () => {
            connection?.stop();
        };
    }, []);
    return <SignalRContext.Provider value={{ hubStatus: signalRStatus }}>
        {children}
    </SignalRContext.Provider>
}
export default SignalrProvider;