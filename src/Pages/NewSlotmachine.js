import {useState,useRef,useEffect} from "react";

import slotBase from "../images/slotmachine/slot_machine.png";

import levier from "../images/slotmachine/levier.png";
import { Link } from "react-router-dom";


import slotBackground from "../images/slotmachine/slot_bg.png";

import slotBet1 from "../images/slotmachine/bet_1.png";
import slotBet2 from "../images/slotmachine/bet_2.png";
import slotBet3 from "../images/slotmachine/bet_3.png";
import exitLogo from "../assets/exit.svg";
import soundOnLogo from "../assets/volume-up-fill.svg";
import soundOffLogo from "../assets/volume-mute-fill.svg";

import axios from 'axios';
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers";


import abiFile from "../abi/Slotmachine.abi.json";

import PopupConnexion from "../Components/Connexion";
import { getResult } from '../apiEndpoints';

import audioAmbiance from "../assets/gambling.mp3";
import audioClickSound from "../assets/click.mp3";
import audioPullerSound from "../assets/click.mp3";
import audioStopSound from "../assets/stop.mp3";
import audioSpinSound from "../assets/spin.mp3";
import audioWinSound from "../assets/win.mp3";

import Loading from "../Components/Loading";

import SignTransactionAlert from "../Components/SignTransactionAlert";
import PopupWinning from "../Components/PopupWinning";




import {
    Address,
    ContractFunction,
    Query,
    AbiRegistry,
    SmartContractAbi,
    SmartContract,
    ResultsParser
  } from '@elrondnetwork/erdjs';


import {useGetLoginInfo,refreshAccount,transactionServices,useGetNetworkConfig,useGetSignedTransactions,useGetAccountProvider,useSignTransactions} from "@elrondnetwork/dapp-core";





function NewSlotmachine (){
    const {
        callbackRoute,
        transactions,
        error,
        onAbort,
        hasTransactions
      } = useSignTransactions();
    const [soundOn, setSoundOn] = useState(true);

    let bet1Ref = useRef();
    let bet2Ref = useRef();
    let bet3Ref = useRef();

    const [popupWinning,setPopupWinning]=useState(false);


    const [spin,setSpin]=useState(false);
    const [resultSpin,setResultSpin]=useState();
    const [bet, setBet]=useState(0.05);
    const [sessionId, setSessionId] = useState(null);
    const [valueJackpot, setValueJackpot] = useState(1);
    const [waitingTransaction,setWaitingTransaction]=useState(false);
    const [isLoading,setIsLoading]=useState(true)


    const {isLoggedIn}=useGetLoginInfo();

    const [showPopup,setShowPopup] = useState(false);

    const { sendTransactions } = transactionServices;

    const contractAddressSlotMachine=process.env.REACT_APP_SMART_CONTRACT_SLOT_MACHINE;
    const handleClosePopup = () => {
		setShowPopup(false);
	}
    const {signedTransactions} = useGetSignedTransactions();


    const contractAddressSlotMachineCaller=process.env.REACT_APP_SMART_CONTRACT_SLOT_MACHINE_CALLER;

    const { network } = useGetNetworkConfig();



    const result = {"cherry":-4,"elrond":-14,"bar":-21,"jackpot":-30,"diamond":-39};


    useEffect(() => {
        const onPageLoad = () => {
          setIsLoading(false);
        };
    
        // Check if the page has already loaded
        if (document.readyState === "complete") {
          onPageLoad();
        } else {
          window.addEventListener("load", onPageLoad);
          // Remove the event listener when component unmounts
          return () => window.removeEventListener("load", onPageLoad);
        }
      }, []);

    function triggerSetSound(){
        if (soundOn){
            audio.current.pause();
        }else{
            audio.current = new Audio(audioAmbiance)
            audio.current.loop=true;
            audio.current.play();
        }
        setSoundOn(!soundOn);
    }

    let audio = useRef();
    let audioClick = useRef();
    let audioPuller = useRef();
    let audioStop = useRef();
    let audioSpin = useRef();
    let audioWin = useRef();
    useEffect(() => {
        audio.current = new Audio(audioAmbiance);
        audioClick.current=new Audio(audioClickSound);
        audioPuller.current=new Audio(audioPullerSound);
        audioStop.current=new Audio(audioStopSound);
        audioSpin.current=new Audio(audioSpinSound);
        audioWin.current=new Audio(audioWinSound);

        audio.current.loop=true;
        audioSpin.current.loop=true;
        audio.current.play();
        return () => {
            audioSpin.current.pause();
            audio.current.pause();
        }
    }, [])

    useEffect(() => {
        if(spin){
            bet1Ref.current.style='animation: spinSlot .2s linear infinite;';
            bet2Ref.current.style='animation: spinSlot .3s linear infinite;animation-delay: 0.3s;';
            bet3Ref.current.style='animation: spinSlot .5s linear infinite;animation-delay: 0.6s;';
        }else if (resultSpin!=undefined){
            function endAnimation(event){
                let style = document.createElement('style');
                style.type = 'text/css';
                if (event.animationName==="spinSlot" && bet1Ref.current===event.target ){
                    audioStop.current.cloneNode(true).play();
                    let motif="";
                    switch (resultSpin[0]){
                        case 1:
                            motif="cherry";
                            break;
                        case 2:
                            motif="bar";
                            break;
                        case 3:
                            motif="diamond";
                            break;
                        case 4:
                            motif="elrond";
                            break;
                        case 5:
                            motif="jackpot";
                            break;
                    }
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerText = '@keyframes slot1Stop {from {transform: translateY(-49vw);}to{transform:translateY('+result[motif]+'vw);}}';
                    document.head.appendChild(style);
                    bet1Ref.current.style="animation : slot1Stop 1s ease-out;animation-fill-mode: forwards;";
                    bet1Ref.current.removeEventListener('animationiteration',endAnimation);
                    function endBet2(){
                        audioStop.current.cloneNode(true).play();
                        let motif="";
                        switch (resultSpin[1]){
                            case 1:
                                motif="cherry";
                                break;
                            case 2:
                                motif="bar";
                                break;
                            case 3:
                                motif="diamond";
                                break;
                            case 4:
                                motif="elrond";
                                break;
                            case 5:
                                motif="jackpot";
                                break;
                        }
                        let style = document.createElement('style');
                        style.type = 'text/css';
                        style.innerText = '@keyframes slot2Stop {from {transform: translateY(-49vw);}to{transform:translateY('+result[motif]+'vw);}}';
                        document.head.appendChild(style);
                        bet2Ref.current.style="animation : slot2Stop 1s ease-out;animation-fill-mode: forwards;";
                        bet2Ref.current.removeEventListener('animationiteration',endBet2);

                        function endBet3(){
                            audioSpin.current.pause();
                            audioStop.current.cloneNode(true).play();
                            let motif="";
                            switch (resultSpin[2]){
                                case 1:
                                    motif="cherry";
                                    break;
                                case 2:
                                    motif="bar";
                                    break;
                                case 3:
                                    motif="diamond";
                                    break;
                                case 4:
                                    motif="elrond";
                                    break;
                                case 5:
                                    motif="jackpot";
                                    break;
                            }
                            let style = document.createElement('style');
                            style.type = 'text/css';
                            style.innerText = '@keyframes slot3Stop {from {transform: translateY(-49vw);}to{transform:translateY('+result[motif]+'vw);}}';
                            document.head.appendChild(style);
                            bet3Ref.current.style="animation : slot3Stop 1s ease-out;animation-fill-mode: forwards;";
                            bet3Ref.current.removeEventListener('animationiteration',endBet3);
                            if (resultSpin[2]===resultSpin[0] && resultSpin[0]===resultSpin[1]){
                                audioWin.current.play();
                                setTimeout(()=>{
                                    setPopupWinning(true);
                                },2000);
                                
                            }
                        }
                        bet3Ref.current.addEventListener('animationiteration',endBet3);
                    }
                    bet2Ref.current.addEventListener('animationiteration',endBet2);

                }
            }
            bet1Ref.current.addEventListener('animationiteration',endAnimation);
        }
    },[spin])

    useEffect(()=>{
        if(signedTransactions[sessionId] != undefined && signedTransactions[sessionId].status === "sent"){
            setWaitingTransaction(false);
            audioPuller.current.cloneNode(true).play();
            audioSpin.current.play();
            setSpin(true);
            let interval = setInterval(function(){
                axios.get(getResult(network.apiAddress,signedTransactions[sessionId].transactions[0].hash))
                .then(function(response){
                    let data="";
                    if(response.data.results!=undefined){
                        response.data.results.map((result)=>{
                            if(result.callType==2){
                                data=result.data;
                                clearInterval(interval);
                                resultChange(data);
                                setSpin(false);
                            }
                        });
                    }

                })
            },3000)
        }
    },[signedTransactions])

    useEffect(async ()=>{
        let abiRegistry = AbiRegistry.create(abiFile);
        let abi = new SmartContractAbi(abiRegistry, ["Slotmachine"]);

        let contract = new SmartContract({ address: new Address(contractAddressSlotMachineCaller), abi: abi });
        const proxy = new ProxyNetworkProvider(network.apiAddress);

        const queryCurrentJackpot= new Query({
          address: new Address(contractAddressSlotMachine),
          func: new ContractFunction('jackpot'),
          args: []
        });
        
        let queryResponse=await proxy.queryContract(queryCurrentJackpot)
        let endpointDefinition = contract.getEndpoint("jackpot");
        let { firstValue }  = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);
        setValueJackpot(parseInt(firstValue.value,10)/(10**18));
    },[]);

    const resultChange = (data) => {
        let possibleValues=[1,2,3,4,5];
        let values=[];
        for (let nb1 in possibleValues){
            for (let nb2 in possibleValues){
                for (let nb3 in possibleValues){
                    if(nb3 !== nb2 || nb3 !== nb1 ){
                        let newValue=[nb1,nb2,nb3];
                        values.push(newValue);
                    }
                }
            }
        }
        let index = Math.floor(Math.random() * (values.length - 0)) + 0;
        let value=values[index];
        if(data!==""){
            let result = Buffer.from(data,"base64").toString().split("@")[2];                
            
            switch (result){
                case '01':
                    value=[1,1,1];
                    break;
                case '02':
                    value=[2,2,2];
                    break;
                case '03':
                    value=[3,3,3];
                    break;
                case '04':
                    value=[4,4,4];
                    break;
                case '05':
                    value=[5,5,5];
                    break;
            }
            setResultSpin(value);
        }
    }
    

    const play = async () =>{
        audioClick.current.cloneNode(true).play();
        if(!spin && !waitingTransaction){
            if(!isLoggedIn){
                setShowPopup(true);
            }else{
                let betEGLD =(Math.round(bet*100)/100) * 10**18;
                const spinTransaction = {
                    value: betEGLD.toString(),
                    data: 'bet',
                    receiver: contractAddressSlotMachineCaller,
                    gasLimit: 30_000_000,
                };            
                await refreshAccount();
                const { sessionId, error } = await sendTransactions({
                    transactions: spinTransaction,
                    transactionsDisplayInfo:{
                        processingMessage: 'Processing transaction',
                        errorMessage: 'An error has occured during transaction',
                        successMessage: 'Success'
                    },
                    redirectAfterSign: false
                });
                if (sessionId != null){
                    setSessionId(sessionId);
                    setWaitingTransaction(true);
                }

            }

        }
        
        setTimeout(function(){
            
        },10000)
    }

    const transactionStatus = transactionServices.useTrackTransactionStatus({
        transactionId: sessionId,
        onFail:()=>{setWaitingTransaction(false)},
        onCancelled:()=>{setWaitingTransaction(false)},
      });

    const changeBet=()=>{
        audioClick.current.cloneNode(true).play();
        switch(bet){
            case 0.05:
                setBet(0.1);
                break;
            case 0.1:
                setBet(0.5);
                break;
            case 0.5:
                setBet(0.05);
                break;
        }
    }
    
    let disabled;
    if(spin){
        disabled="disabled";
    }else{
        disabled="";
    }
    return(
        <>
            {isLoading && <Loading />}
            {showPopup && !isLoggedIn && <PopupConnexion close={handleClosePopup}/>}
            {waitingTransaction && <SignTransactionAlert/>}
            {popupWinning && <PopupWinning close={()=>setPopupWinning(false)}/>}
            <Link to="/"><img className="exit" src={exitLogo}/></Link>

            {soundOn ? (<img className="music" src={soundOnLogo} onClick={triggerSetSound}/>) : (<img className="music" src={soundOffLogo} onClick={triggerSetSound}/>)}

            <div className="slot-dapp">
                <div className="jackpot-vol">
                    <div>Jackpot : {valueJackpot}EGLD</div>
                </div>
                <div  className="game-slot">
                    <img className="slot-background" src={slotBackground}/>

                    <div className="bet-slot">
                        <img className="slot-bet-1" ref={bet1Ref} src={slotBet1}/>
                        <img className="slot-bet-2" ref={bet2Ref} src={slotBet2}/>
                        <img className="slot-bet-3" ref={bet3Ref} src={slotBet3}/>
                    </div>
                    
                    {/*<img className="bg" src={bg}/>*/}
                    
                    <img className="slot-base" src={slotBase}/>
                    
                    <img className="levier" onClick={play} src={levier}/>
                </div>
                <div className="button-wheel">
                    <div className="container-bet"><div className="amount-bet">{bet} EGLD</div><div onClick={changeBet} className={"yellow-btn-bet "+disabled}><div>Bet</div></div></div>
                    <div className={"yellow-btn-bet "+disabled} onClick={()=>{setBet(0.5);play();}}><div>Max</div></div>
                    <div className={"yellow-btn-bet "+disabled} onClick={play}><div>{isLoggedIn ? "SPIN" : "Connect Wallet"}</div></div>
                </div>
            </div>
        </>
    )
}

export default NewSlotmachine;