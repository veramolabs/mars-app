import React, { useContext } from "react";

interface MobileContextValue {
  mobileOpen: boolean,
  setMobileOpen: (value: boolean) => void
}

export const MobileContext = React.createContext<MobileContextValue>({mobileOpen: false, setMobileOpen: () => {}});
export const useMobile = () => useContext(MobileContext);

const MobileProvider: React.FC = ({children}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (<MobileContext.Provider value={{
    mobileOpen,
    setMobileOpen
  }}>
    {children}
  </MobileContext.Provider>)
}
export default MobileProvider