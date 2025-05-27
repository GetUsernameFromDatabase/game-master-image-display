import "@/app/globals.css";
import { Routes, Route, HashRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import MainPage from "./pages/main-page";
import ViewImagePage from "./pages/view-image-page";

function App() {
  return (
    <TooltipProvider>
      <HashRouter>
        <Routes>
          <Route path="/" index element={<MainPage></MainPage>}></Route>
          <Route
            path="view-image"
            element={<ViewImagePage></ViewImagePage>}
          ></Route>
        </Routes>
      </HashRouter>
    </TooltipProvider>
  );
}

export default App;
