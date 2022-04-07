import { Route, Routes } from "react-router-dom";
import Config from "../pages/Config";
import Index from "../pages/Index";

const CustomRouter = () => {
    return (
        <Routes>
            <Route path="/" element={ <Index /> } />
            <Route path="/config" element={ <Config /> } />
        </Routes>
    )
}

export default CustomRouter