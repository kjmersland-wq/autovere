import { createContext, useContext, useState, ReactNode } from "react";

interface EVNavContextType {
  open: boolean;
  toggle: () => void;
  setOpen: (v: boolean) => void;
}

const EVNavContext = createContext<EVNavContextType>({
  open: false,
  toggle: () => {},
  setOpen: () => {},
});

export const EVNavProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  return (
    <EVNavContext.Provider value={{ open, toggle, setOpen }}>
      {children}
    </EVNavContext.Provider>
  );
};

export const useEVNav = () => useContext(EVNavContext);
