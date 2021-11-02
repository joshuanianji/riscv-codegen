import React, { createContext, useState, useEffect } from 'react'

/**
 * Provides context for the Navigator permissions
 */

interface Context {
    supported: boolean
}


const defaultCtx: Context = { supported: false }

const NavigatorPermissionsContext: React.Context<Context> = createContext(defaultCtx);


const NavigatorPermissionsProvider: React.FC = ({ children }) => {
    const [supported, setSupported] = useState(false);

    // async useEffect 
    // https://stackoverflow.com/a/53572588
    // I'm getting a `Type '"clipboard-write"' is not assignable to type 'PermissionName'.ts(2322)` error,
    // not sure why it's happening, since MDN docs say it should be available, but Typescript doesn't have it
    useEffect(() => {
        async function getPermissions() {
            try {
                if (navigator.permissions) {
                    const permissions = await navigator.permissions.query({ name: "clipboard-write" });
                    setSupported(permissions.state === 'granted');
                } else {
                    setSupported(false);
                }
            } catch (e) {
                setSupported(false)
            }
        }

        getPermissions()
    }, [])


    const value: Context = { supported }

    return (
        <NavigatorPermissionsContext.Provider value={value}>
            {children}
        </NavigatorPermissionsContext.Provider>
    )
}

const getNavPermissions = (): Context => {
    const context = React.useContext(NavigatorPermissionsContext)
    return context
}

export { NavigatorPermissionsProvider, getNavPermissions }