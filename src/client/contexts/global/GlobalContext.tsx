import { createContext } from "react";
import { GlobalStore } from "../../interfaces/AppInterfaces";

export const GlobalContext = createContext<GlobalStore>({} as GlobalStore)