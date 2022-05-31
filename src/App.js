
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Slotmachine from './Pages/Slotmachine';
import Homepage from './Pages/Homepage';
import { DappProvider,DappUI } from "@elrondnetwork/dapp-core";

function App() {
  return (
    <DappProvider
      environment="devnet"
      customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
    >
      <DappUI.SignTransactionsModals />
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route path="/unlock" element={<Homepage/>}/>
          <Route path="slotmachine" element={<Slotmachine />}/>
        </Routes>
      </Router>
    </DappProvider>
    
  );
}

export default App;
