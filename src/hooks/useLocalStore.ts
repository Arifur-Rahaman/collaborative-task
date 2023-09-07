import { useState } from 'react';

const useLocalStore = (key:string, defaultValue:any)=>{  
    const [store, setStore] = useState<any>(()=>{
        try {
            const value = localStorage.getItem(key)
            if (value) {
                return JSON.parse(value)
            } else {
                localStorage.setItem(key, JSON.stringify(defaultValue));
                return defaultValue
            }
            
        } catch (error) {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue
        }
    })

    const setStoreValue = (value:any) => {
        localStorage.setItem(key, JSON.stringify(value));
        setStore(value)
    }

    return [store, setStoreValue]
}

export default useLocalStore