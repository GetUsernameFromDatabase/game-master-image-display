import '@/app/globals.css';
import { TooltipProvider } from './components/ui/tooltip';
import MainPage from './pages/main-page';

function App() {
  return <TooltipProvider><MainPage></MainPage></TooltipProvider>;
}

export default App;
