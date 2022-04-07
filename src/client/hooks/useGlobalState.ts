import { useContext } from "react"
import { GlobalContext } from "../contexts/global/GlobalContext"


export const useGlobalState = () => {
    const globalStore = useContext( GlobalContext )

    return {
        ...globalStore,
        has50clicks: globalStore.state.clicks >= 50
    }
}