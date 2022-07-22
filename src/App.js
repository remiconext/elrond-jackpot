
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Slotmachine from './Pages/Slotmachine';
import NewSlotmachine from './Pages/NewSlotmachine';
import Homepage from './Pages/Homepage';
import WheelRoom from './Pages/WheelRoom';
import { DappProvider,DappUI } from "@elrondnetwork/dapp-core";

function App() {
  return (
    <DappProvider
      environment="testnet"
      customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
    >
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route path="/unlock" element={<Homepage/>}/>
          <Route path="slotmachine" element={<NewSlotmachine />}/>
          <Route path="wheelroom" element={<WheelRoom />}/>
        </Routes>
      </Router>
    </DappProvider>
    
  );
}

export default App;
