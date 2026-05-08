import type React from "react";
import { createContext, useContext, useState } from "react";

interface MenuContextValue {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuContext = createContext<MenuContextValue | null>(null)

export const useMenu = () => {
    const ctx = useContext(MenuContext)
    if (!ctx) throw new Error("useMenu must be used within MenuProvider")
    
    return ctx
}

export default function MenuProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <MenuContext.Provider value={{ open, setOpen }}>
            {children}
        </MenuContext.Provider>
    )
}