import { base } from "./constants";
import Layout from "./page/layout";
import Home from "./page/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const Routers = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path={`/${base}/*`} element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Routers;