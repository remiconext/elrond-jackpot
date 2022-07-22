
import {useState,useRef,useEffect} from "react";
import Wheel from "../Components/Wheel";
import BetBoard from "../Components/BetBoard";
import React from "react";
import jazzAmbiance from "../assets/1930s-ragtime-style-jazz_110bpm_A_minor.wav";
import tokenSound from "../assets/coin_sound.wav";
import victorySound from "../assets/victory_sound.mp3";
import victoryVoice1 from "../assets/victory_sound_voice.wav";
import victoryVoice2 from "../assets/victory_sound_voice_2.wav";
import exitLogo from "../assets/exit.svg";
import PopupWinning from "../Components/PopupWinning";
import soundOnLogo from "../assets/volume-up-fill.svg";
import soundOffLogo from "../assets/volume-mute-fill.svg";
import { Link } from "react-router-dom";
import {Container, Col, Row} from 'react-bootstrap';
import { getResult } from '../apiEndpoints';
import axios from 'axios';
import PopupConnexion from "../Components/Connexion";
import redBetImg from "../assets/red-bet.png";
import whiteBetImg from "../assets/white-bet.png";
import blackBetImg from "../assets/black-bet.png";
import blueBetImg from "../assets/blue-bet.png";
import {useGetLoginInfo,refreshAccount,transactionServices,useGetNetworkConfig,useGetSignedTransactions,useGetAccountProvider,useSignTransactions} from "@elrondnetwork/dapp-core";
import {
    Address,
    ContractFunction,
    Query,
    AbiRegistry,
    SmartContractAbi,
    SmartContract,
    ResultsParser
  } from '@elrondnetwork/erdjs';

import abiFile from "../abi/wheelcontractcaller.abi.json";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers";
import SignTransactionAlert from "../Components/SignTransactionAlert";


function WheelRoom (){
    const contractWheelCaller=process.env.REACT_APP_SMART_CONTRACT_WHEEL_CALLER;
    const numberColor={32:"red",15:"black",19:"red",4:"black",21:"red",2:"black",25:"red",17:"black",34:"red",6:"black",27:"red",13:"black",36:"red",11:"black",30:"red",8:"black",23:"red",10:"black",5:"red",24:"black",16:"red",33:"black",1:"red",20:"black",14:"red",31:"black",9:"red",22:"black",18:"red",29:"black",7:"red",28:"black",12:"red",35:"black",3:"red",26:"black",0:"green"}
    const [waitingTransaction,setWaitingTransaction]=useState(false);
    const {isLoggedIn}=useGetLoginInfo();
    const [showPopup,setShowPopup] = useState(false);


    const [popupWinning,setPopupWinning]=useState(false);

    const [currentBet,setCurrentBet]=useState(0.05);

    const [lastWinningNumbers, setLastWinningNumbers]=useState([12,21,33,2,1,21,9,8,35,23,31,34,12,26,7,8,19,2]);

    const [resultSpin, setResultSpin] = useState();
    const { network } = useGetNetworkConfig();
    const {signedTransactions} = useGetSignedTransactions();
    const {
        callbackRoute,
        transactions,
        error,
        onAbort,
        hasTransactions
      } = useSignTransactions();

    const { sendTransactions } = transactionServices;
    const [sessionId, setSessionId] = useState(null);

    const [winningNumbers, setWinningNumbers] = useState([]);


    const [spin, setSpin] = useState(false);
    const [soundOn, setSoundOn] = useState(true);

    const [totalBet,setTotalBet] = useState(0);

    const [betPlein, setBetPlein] = useState({"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,
    "18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0});

    const [betCheval, setBetCheval] = useState({"3_6":0,"6_9":0,"9_12":0,"12_15":0,"15_18":0,"18_21":0,"21_24":0,"24_27":0,"27_30":0,"30_33":0,"33_36":0,
    "2_5":0,"5_8":0,"8_11":0,"11_14":0,"14_17":0,"17_20":0,"20_23":0,"23_26":0,"26_29":0,"29_32":0,"32_35":0,
    "1_4":0,"4_7":0,"7_10":0,"10_13":0,"13_16":0,"16_19":0,"19_22":0,"22_25":0,"25_28":0,"28_31":0,"31_34":0,"0_1":0,"0_2":0,"0_3":0,
    "2_3":0,"5_6":0,"8_9":0,"11_12":0,"14_15":0,"17_18":0,"20_21":0,"23_24":0,"26_27":0,"29_30":0,"32_33":0,"35_36":0,
    "1_2":0,"4_5":0,"7_8":0,"10_11":0,"13_14":0,"16_17":0,"19_20":0,"22_23":0,"25_26":0,"28_29":0,"31_32":0,"34_35":0});

    const [betCarre, setBetCarre] = useState({"2_3_5_6":0,"1_2_4_5":0,"5_6_8_9":0,"4_5_7_8":0,"7_8_10_11":0,"8_9_11_12":0,"11_12_14_15":0,"10_11_13_14":0,"14_15_17_18":0,"13_14_16_17":0,
    "17_18_20_21":0,"16_17_19_20":0,"20_21_23_24":0,"19_20_22_23":0,"23_24_26_27":0,"22_23_25_26":0,"26_27_29_30":0,"25_26_28_29":0,"29_30_32_33":0,"28_29_31_32":0,
    "32_33_35_36":0,"31_32_34_35":0});

    const [betTransversale,setBetTransversale] = useState({"0_2_3":0,"0_1_2":0});

    const [bet1to18, setBet1to18] = useState(0);

    const [bet19to36, setBet19to36] = useState(0);


    const [betCol1to34, setBetCol1to34] = useState(0);
    const [betCol2to35, setBetCol2to35] = useState(0);
    const [betCol3to36, setBetCol3to36] = useState(0);

    const [bet1to12, setBet1to12] = useState(0);

    const [bet13to24, setBet13to24] = useState(0);

    const [bet25to36, setBet25to36] = useState(0);

    const [betEven, setBetEven] = useState(0);
    const [betOdd, setBetOdd] = useState(0);
    const [betRed, setBetRed] = useState(0);
    const [betBlack, setBetBlack] = useState(0);

	const handleClosePopup = () => {
		setShowPopup(false);
	}


    function triggerSetBetCheval(nb){
        let newBet = betCheval;
        if(betCheval[nb] + currentBet<=0.2 && !spin){
            soundToken.current.play();
            newBet[nb] = Math.round((betCheval[nb] + currentBet)*100)/100;
            setBetCheval(newBet);
            setTotalBet(totalBet + currentBet);
        }
    }

    function triggerSetBet1to18(){
        if(bet1to18+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBet1to18(Math.round((bet1to18 + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBet19to36(){
        if(bet19to36+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBet19to36(Math.round((bet19to36 + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBetCol1to34(){
        if(betCol1to34+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBetCol1to34(Math.round((betCol1to34 + 0.05)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBetCol2to35(){
        if(betCol2to35+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBetCol2to35(Math.round((betCol2to35 + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBetCol3to36(){
        if(betCol3to36+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBetCol3to36(Math.round((betCol3to36 + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBet1to12(){
        if(bet1to12+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBet1to12(Math.round((bet1to12 + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBet13to24(){
        if(bet13to24+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBet13to24(Math.round((bet13to24 + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBet25to36(){
        if(bet25to36+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBet25to36(Math.round((bet25to36 + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBetEven(){
        if(betEven+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBetEven(Math.round((betEven + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBetOdd(){
        if(betOdd+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBetOdd(Math.round((betOdd + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBetRed(){
        if(betRed+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBetRed(Math.round((betRed + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBetBlack(){
        if(betBlack+currentBet<=0.2 && !spin){
            soundToken.current.play();
            setBetBlack(Math.round((betBlack + currentBet)*100)/100);
            setTotalBet(totalBet + currentBet);
        }

    }

    function triggerSetBetPlein(nb){
        
        let newBet = betPlein;
        if(betPlein[nb]+currentBet<=0.2 && !spin){
            soundToken.current.play();
            newBet[nb] = Math.round((betPlein[nb] + currentBet)*100)/100;
            setBetPlein(newBet);
            setTotalBet(totalBet + currentBet);
        }
    }
    
    function triggerSetBetTransversale(nb){
        
        let newBet = betTransversale;
        if(betTransversale[nb]+currentBet<=0.2 && !spin){
            soundToken.current.play();
            newBet[nb] = Math.round((betTransversale[nb] + currentBet)*100)/100;
            setBetTransversale(newBet);
            setTotalBet(totalBet + currentBet);
        }
    }

    function triggerSetBetCarre(nb){
        let newBet = betCarre;
        if(betCarre[nb]+currentBet<=0.2 && !spin){
            soundToken.current.play();
            newBet[nb] = Math.round((betCarre[nb] + currentBet)*100)/100;
            setBetCarre(newBet);
            setTotalBet(totalBet + currentBet);
        }
    }

    

    function clearAll(){
        if(!spin){
            setTotalBet(0);
            setBetPlein({"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,
            "18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0});
            
            setBetCheval({"3_6":0,"6_9":0,"9_12":0,"12_15":0,"15_18":0,"18_21":0,"21_24":0,"24_27":0,"27_30":0,"30_33":0,"33_36":0,
            "2_5":0,"5_8":0,"8_11":0,"11_14":0,"14_17":0,"17_20":0,"20_23":0,"23_26":0,"26_29":0,"29_32":0,"32_35":0,
            "1_4":0,"4_7":0,"7_10":0,"10_13":0,"13_16":0,"16_19":0,"19_22":0,"22_25":0,"25_28":0,"28_31":0,"31_34":0,"0_1":0,"0_2":0,"0_3":0,
            "2_3":0,"5_6":0,"8_9":0,"11_12":0,"14_15":0,"17_18":0,"20_21":0,"23_24":0,"26_27":0,"29_30":0,"32_33":0,"35_36":0,
            "1_2":0,"4_5":0,"7_8":0,"10_11":0,"13_14":0,"16_17":0,"19_20":0,"22_23":0,"25_26":0,"28_29":0,"31_32":0,"34_35":0});

            setBetCarre({"2_3_5_6":0,"1_2_4_5":0,"5_6_8_9":0,"4_5_7_8":0,"7_8_10_11":0,"8_9_11_12":0,"11_12_14_15":0,"10_11_13_14":0,"14_15_17_18":0,"13_14_16_17":0,
            "17_18_20_21":0,"16_17_19_20":0,"20_21_23_24":0,"19_20_22_23":0,"23_24_26_27":0,"22_23_25_26":0,"26_27_29_30":0,"25_26_28_29":0,"29_30_32_33":0,"28_29_31_32":0,
            "32_33_35_36":0,"31_32_34_35":0});

            setBet1to18(0)

            setBet19to36(0)

            setBetCol1to34(0)
            setBetCol2to35(0)
            setBetCol3to36(0)

            setBet1to12(0)

            setBet13to24(0)

            setBet25to36(0)

            setBetEven(0)
            setBetOdd(0)
            setBetRed(0)
            setBetBlack(0)

            setBetTransversale({"0_2_3":0,"0_1_2":0});
        }
    }

    let audio = useRef();
    let soundToken = useRef();
    let soundVictory = useRef();
    let soundVoice=useRef();
    let soundVoice2=useRef();
    
    useEffect(() => {
        audio.current = new Audio(jazzAmbiance);
        soundToken.current=new Audio(tokenSound);
        soundVictory.current=new Audio(victorySound);
        soundVoice.current=new Audio(victoryVoice1);
        soundVoice2.current=new Audio(victoryVoice2);

        audio.current.loop=true;
        audio.current.play();
        return () => {
            audio.current.pause();
        }
    }, [])

    function triggerSetSound(){
        if (soundOn){
            audio.current.pause();
        }else{
            audio.current = new Audio(jazzAmbiance)
            audio.current.loop=true;
            audio.current.play();
        }
        setSoundOn(!soundOn);
    }

    function preparePleinArg(){
        let args= "";
        let nb=0;
        let nb1;
        let arrayNb=Array();
        Object.keys(betPlein).map(function(key){
            if (betPlein[key] > 0){
                nb1=parseInt(key,10);
                arrayNb.push(nb1);
                let hexNb = parseInt(key,10).toString(16);
                if (hexNb.length == 1) {
                    hexNb = "0"+hexNb;
                }
                let EGLDBet=betPlein[key]*10**18;
                let betHex = EGLDBet.toString(16);
                let lenBetHex = betHex.length;
                if (lenBetHex % 2 !== 0 ) {
                    betHex = "0"+betHex;
                    lenBetHex ++;
                }
                let nbBytesBigUint = lenBetHex / 2;
                let nbBytesBigUintHex = nbBytesBigUint.toString(16);
                let diff = 8 - nbBytesBigUintHex.length;
                for (let i = 0; i < diff; i ++ ){
                    nbBytesBigUintHex = "0"+nbBytesBigUintHex;
                }

                args+=hexNb+nbBytesBigUintHex+betHex;
                nb ++;
            }
        });
        return [arrayNb,args];
    }

    function prepareChevalArg(){
        let args= "";
        let nb=0;
        let nbWin=Array();
        Object.keys(betCheval).map(function(key){
            if (betCheval[key] > 0){
                let keyArr=key.split("_");
                let nb1=parseInt(keyArr[0],10);
                let nb2=parseInt(keyArr[1],10);
                nbWin.push(nb1);
                nbWin.push(nb2);
                let hexNb1 = parseInt(keyArr[0],10).toString(16);
                let hexNb2 = parseInt(keyArr[1],10).toString(16);
                if (hexNb1.length == 1) {
                    hexNb1 = "0"+hexNb1;
                }
                if (hexNb2.length == 1) {
                    hexNb2 = "0"+hexNb2;
                }
                let EGLDBet=betCheval[key]*10**18;
                let betHex = EGLDBet.toString(16);
                let lenBetHex = betHex.length;
                if (lenBetHex % 2 !== 0 ) {
                    betHex = "0"+betHex;
                    lenBetHex ++;
                }
                let nbBytesBigUint = lenBetHex / 2;
                let nbBytesBigUintHex = nbBytesBigUint.toString(16);
                let diff = 8 - nbBytesBigUintHex.length;
                for (let i = 0; i < diff; i ++ ){
                    nbBytesBigUintHex = "0"+nbBytesBigUintHex;
                }

                args+=hexNb1+hexNb2+nbBytesBigUintHex+betHex;
                nb ++;
            }
        });
        return [nbWin,args];
    }

    function prepareCarreArg(){
        let args= "";
        let nb=0;
        let nbWin;
        Object.keys(betCarre).map(function(key){
            if (betCarre[key] > 0){
                let keyArr=key.split("_");
                let nb1=parseInt(keyArr[0],10);
                let nb2=parseInt(keyArr[1],10);
                let nb3=parseInt(keyArr[2],10);
                let nb4=parseInt(keyArr[3],10);
                nbWin.push(nb1);
                nbWin.push(nb2);
                nbWin.push(nb3);
                nbWin.push(nb4);
                

                let hexNb1 = parseInt(keyArr[0],10).toString(16);
                let hexNb2 = parseInt(keyArr[1],10).toString(16);
                let hexNb3 = parseInt(keyArr[2],10).toString(16);
                let hexNb4 = parseInt(keyArr[3],10).toString(16);
                if (hexNb1.length == 1) {
                    hexNb1 = "0"+hexNb1;
                }
                if (hexNb2.length == 1) {
                    hexNb2 = "0"+hexNb2;
                }
                if (hexNb3.length == 1) {
                    hexNb3 = "0"+hexNb3;
                }
                if (hexNb4.length == 1) {
                    hexNb4 = "0"+hexNb4;
                }
                let EGLDBet=betCarre[key]*10**18;
                let betHex = EGLDBet.toString(16);
                let lenBetHex = betHex.length;
                if (lenBetHex % 2 !== 0 ) {
                    betHex = "0"+betHex;
                    lenBetHex ++;
                }
                let nbBytesBigUint = lenBetHex / 2;
                let nbBytesBigUintHex = nbBytesBigUint.toString(16);
                let diff = 8 - nbBytesBigUintHex.length;
                for (let i = 0; i < diff; i ++ ){
                    nbBytesBigUintHex = "0"+nbBytesBigUintHex;
                }

                args+=hexNb1+hexNb2+hexNb3+hexNb4+nbBytesBigUintHex+betHex;
                nb ++;
            }
        });
        return [nbWin,args];
    }

    function prepareTransversaleArg(){
        let args= "";
        let nb=0;
        let nbWin;
        Object.keys(betTransversale).map(function(key){
            if (betTransversale[key] > 0){
                let keyArr=key.split("_");
                let nb1=parseInt(keyArr[0],10);
                let nb2=parseInt(keyArr[1],10);
                let nb3=parseInt(keyArr[2],10);
                nbWin.push(nb1);
                nbWin.push(nb2);
                nbWin.push(nb3);

                let hexNb1 = parseInt(keyArr[0],10).toString(16);
                let hexNb2 = parseInt(keyArr[1],10).toString(16);
                let hexNb3 = parseInt(keyArr[2],10).toString(16);
                if (hexNb1.length == 1) {
                    hexNb1 = "0"+hexNb1;
                }
                if (hexNb2.length == 1) {
                    hexNb2 = "0"+hexNb2;
                }
                if (hexNb3.length == 1) {
                    hexNb3 = "0"+hexNb3;
                }
                let EGLDBet=betTransversale[key]*10**18;
                let betHex = EGLDBet.toString(16);
                let lenBetHex = betHex.length;
                if (lenBetHex % 2 !== 0 ) {
                    betHex = "0"+betHex;
                    lenBetHex ++;
                }
                let nbBytesBigUint = lenBetHex / 2;
                let nbBytesBigUintHex = nbBytesBigUint.toString(16);
                let diff = 8 - nbBytesBigUintHex.length;
                for (let i = 0; i < diff; i ++ ){
                    nbBytesBigUintHex = "0"+nbBytesBigUintHex;
                }

                args+=hexNb1+hexNb2+hexNb3+nbBytesBigUintHex+betHex;
                nb ++;
            }
        });
        return [nbWin,args];
    }

    function prepareAmoutEGLD(amount){
        amount = amount *10**18;
        let amountHex=amount.toString(16);
        if (amountHex.length % 2 !== 0) {
            amountHex = "0"+amountHex;
        }
        return amountHex;
    }


    
    const play = async () => {
        if(!spin && !waitingTransaction){
            if(!isLoggedIn){
                setShowPopup(true);
            }
            let winningNumbersNew=Array();
            let [arr,args] = preparePleinArg();
            winningNumbersNew=winningNumbersNew.concat(arr);
            let [arr2,argsCheval] = prepareChevalArg();
            winningNumbersNew=winningNumbersNew.concat(arr2);
            let [arr3,argsCarre] = prepareCarreArg();
            winningNumbersNew=winningNumbersNew.concat(arr3);
            let [arr4,argsTransversale] = prepareTransversaleArg();
            winningNumbersNew=winningNumbersNew.concat(arr4);

            if (betEven > 0 ){
                for(let i=1; i<=36; i++) {
                    if(i%2===0){
                        winningNumbersNew.push(i);
                    }
                }
            }
            if (betOdd > 0 ){
                for(let i=1; i<=36; i++) {
                    if(i%2===1){
                        winningNumbersNew.push(i);
                    }
                }
            }

            if(betRed > 0){
                winningNumbersNew.push(1,3,5,7,9,12,14,16,18,21,23,25,27,28,30,32,34,36);
            }

            if(betBlack > 0){
                winningNumbersNew.push(2,4,6,8,10,11,13,15,17,19,20,22,24,26,29,31,33,35);
            }

            if (bet1to12>0){
                for (let i=1;i<=12;i++){
                    winningNumbersNew.push(i);
                }
            }
            if (bet13to24>0){
                for (let i=13;i<=24;i++){
                    winningNumbersNew.push(i);
                }
            }
            if (bet25to36>0){
                for (let i=25;i<=36;i++){
                    winningNumbersNew.push(i);
                }
            }
            if(betCol3to36>0){
                winningNumbersNew.push(3,6,9,12,15,18,21,24,27,30,33,36);
            }
            if(betCol2to35>0){
                winningNumbersNew.push(2,5,8,11,14,17,20,23,26,29,32,35);
            }
            if(betCol1to34>0){
                winningNumbersNew.push(1,4,7,10,13,16,19,22,25,28,31,34);
            }

            setWinningNumbers(winningNumbersNew);

            let betEGLD =(Math.round(totalBet*100)/100) * 10**18;
            const spinTransaction = {
                value: betEGLD.toString(),
                data: 'runWheel@'+args+"@"+argsCheval+"@"+argsTransversale+"@"+argsCarre+"@@"+prepareAmoutEGLD(betEven)+"@"+prepareAmoutEGLD(betOdd)+"@"+prepareAmoutEGLD(betRed)+"@"+prepareAmoutEGLD(betBlack)+"@"+prepareAmoutEGLD(bet1to18)+"@"+prepareAmoutEGLD(bet19to36)+"@"+prepareAmoutEGLD(bet1to12)+"@"+prepareAmoutEGLD(bet13to24)+"@"+prepareAmoutEGLD(bet25to36)+"@"+prepareAmoutEGLD(betCol3to36)+"@"+prepareAmoutEGLD(betCol2to35)+"@"+prepareAmoutEGLD(betCol1to34),
                receiver: contractWheelCaller,
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



    const transactionStatus = transactionServices.useTrackTransactionStatus({
        transactionId: sessionId,
        onFail:()=>{setWaitingTransaction(false)},
        onCancelled:()=>{setWaitingTransaction(false)},
      });

    useEffect(async () => {
        let abiRegistry = AbiRegistry.create(abiFile);
        let abi = new SmartContractAbi(abiRegistry, ["Wheel"]);

        let contract = new SmartContract({ address: new Address(contractWheelCaller), abi: abi });
        const proxy = new ProxyNetworkProvider(network.apiAddress);
        parseWinningNumbers(contract,proxy);
        let intervalParseWinningNumbers=setInterval(()=>parseWinningNumbers(contract,proxy),6000);
        return () => clearInterval(intervalParseWinningNumbers);

    },[]);

    const parseWinningNumbers= async (contract,proxy)=>{
        const queryWinningNumbers= new Query({
          address: new Address(contractWheelCaller),
          func: new ContractFunction('getIntervalParseWinningNumbers'),
          args: []
        });
        try{
            let queryResponse=await proxy.queryContract(queryWinningNumbers)
            let endpointDefinition = contract.getEndpoint("getIntervalParseWinningNumbers");
            let { firstValue }  = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);
            let newWinningNumbers=[...lastWinningNumbers];
            let j=0;
            for (let i=firstValue.items.length-1;i>=0;i--){
                newWinningNumbers[j]=parseInt(firstValue.items[i]["value"],10);
                j++;
            }
            setLastWinningNumbers(newWinningNumbers);
        }catch(error){
            //window.alert(error);
        }

    }

    useEffect(()=>{
        if(signedTransactions[sessionId] != undefined && signedTransactions[sessionId].status === "sent"){
            setSpin(true);
            setWaitingTransaction(false);
            let interval = setInterval(function(){
                axios.get(getResult(network.apiAddress,signedTransactions[sessionId].transactions[0].hash))
                .then(function(response){
                    let data="";
                    if(response.data.results!=undefined){
                        response.data.results.map((result)=>{
                            if(result.callType==0 && result.data!=undefined){
                                data = result.data;
                                data = Buffer.from(data,"base64").toString().split("@")[2];
                                let dataDecimal = parseInt(data,"16");
                                if (dataDecimal ==undefined || dataDecimal==null || dataDecimal==""){
                                    dataDecimal=0;
                                }
                                
                                if (winningNumbers.includes(dataDecimal)){
                                    soundVictory.current.play();
                                    let randNum=Math.floor(Math.random() * 8);
                                    if(randNum===0){
                                        soundVoice.current.play();
                                    }else if (randNum === 1){
                                        soundVoice2.current.play();
                                    }
                                    setTimeout(function(){
                                        setPopupWinning(true);
                                    },2000);
                                    
                                }
                                setResultSpin(dataDecimal);
                                setSpin(false);
                                clearInterval(interval);
                                
                            }
                        });
                    }

                })
            },3000)
       }
   },[signedTransactions]);

   let disabled;
   if(spin){
        disabled="disabled";
   }else{
        disabled="";
   }

    return(
        <div className="wheelRoom">
            {showPopup && !isLoggedIn && <PopupConnexion close={handleClosePopup}/>}
            {waitingTransaction && <SignTransactionAlert/>}
            {popupWinning && <PopupWinning close={()=>setPopupWinning(false)}/>}
            <Link to="/"><img className="exit" src={exitLogo}/></Link>

            {soundOn ? (<img className="music" src={soundOnLogo} onClick={triggerSetSound}/>) : (<img className="music" src={soundOffLogo} onClick={triggerSetSound}/>)}

            <Container className="game">
                <Row>
                    <Col md={12} className="text-center">
                        <h2>Roulette</h2>
                    </Col>
                    
                </Row>
                <Row>
                    <Col lg={5} sm={12}>
                        <Wheel spin={spin} resultSpin={resultSpin}/>
                    </Col>
                    <Col sm={12} className="d-block d-lg-none">
                        <div className="row-winning-numbers-mobile">
                            {
                            lastWinningNumbers.slice(0,10).map((number)=>{
                                return(
                                    
                                        <div className={"winning-numbers-mobile winning-numbers-"+numberColor[number]}><div>{number}</div></div>
                                        
                                );
                            })}
                        </div>
                    </Col>
                    <Col sm={12} className="d-block d-lg-none">
                        <Row>
                            <Col sm={6} xs={6}>
                                <div className="mobileButton clean-all-mobile" onClick={clearAll}><div>Clean All</div></div>
                            </Col>
                            <Col sm={6} xs={6}>
                                <div className="mobileButton place-bet-mobile" onClick={play}><div>Place Bet</div></div>
                            </Col>
                        </Row>

                        
                    </Col>
                    <Col lg={7}>
                        <BetBoard
                                
                                setBet1to18={triggerSetBet1to18}
                                setBet19to36={triggerSetBet19to36}
                                setBetCol1to34={triggerSetBetCol1to34}
                                setBetCol2to35={triggerSetBetCol2to35}
                                setBetCol3to36={triggerSetBetCol3to36}
                                setBet1to12={triggerSetBet1to12}
                                setBet13to24={triggerSetBet13to24}
                                setBet25to36={triggerSetBet25to36}
                                setBetEven={triggerSetBetEven}
                                setBetOdd={triggerSetBetOdd}
                                setBetRed={triggerSetBetRed}
                                setBetBlack={triggerSetBetBlack}

                                setBetPlein={triggerSetBetPlein}
                                setBetCheval={triggerSetBetCheval}
                                setBetTransversale={triggerSetBetTransversale}
                                
                                
                                setBetCarre={triggerSetBetCarre}



                                betPlein={betPlein}
                                betCheval={betCheval}
                                betTransversale={betTransversale}
                                betCarre={betCarre}

                                bet1to18={bet1to18}
                                bet19to36={bet19to36}

                                betCol1to34={betCol1to34}

                                betCol2to35={betCol2to35}
                                betCol3to36={betCol3to36}

                                bet1to12={bet1to12}
                                bet13to24={bet13to24}
                                bet25to36={bet25to36}

                                betEven={betEven}
                                betOdd={betOdd}
                                betRed={betRed}
                                betBlack={betBlack}
                            

                                

                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={5} className="d-none d-lg-block">
                        <div className="last-winning-numbers">
                            <Container>
                                <h3>Last winning numbers</h3>
                                <Row>
                                    {lastWinningNumbers.map((number)=>{
                                        return(
                                            
                                            <Col className="row-winning-numbers" md={2}>
                                                <div className={"winning-numbers winning-numbers-"+numberColor[number]}>{number}</div>
                                            </Col>
                                                
                                        );
                                    })}
                                </Row>
                            </Container>
                        </div>
                    </Col>
                    <Col lg={7} className="d-none d-lg-block">
                        <Row>
                            <div className="bet-selector">
                                <div className="bet-img" onClick={()=>setCurrentBet(0.05)}>
                                    <img src={whiteBetImg}/>
                                    <span className="bet-amount">0.05</span>
                                    {currentBet===0.05&&<span className="selector"></span>}
                                </div>
                                <div className="bet-img"  onClick={()=>setCurrentBet(0.10)}>
                                    <img src={redBetImg}/>
                                    <span className="bet-amount white">0.10</span>
                                    {currentBet===0.10&&<span className="selector"></span>}
                                </div>
                                <div className="bet-img white"  onClick={()=>setCurrentBet(0.15)}>
                                    <img src={blueBetImg}/>
                                    <span className="bet-amount white">0.15</span>
                                    {currentBet===0.15&&<span className="selector"></span>}
                                </div>
                                <div className="bet-img"  onClick={()=>setCurrentBet(0.20)}>
                                    <img src={blackBetImg}/>
                                    <span className="bet-amount white">0.20</span>
                                    {currentBet===0.20&&<span className="selector"></span>}
                                </div>
                                <div className={"clear-all-btn "+disabled} onClick={clearAll}>Clear All</div>
                            </div>
                        </Row>
                        <Row>
                            {isLoggedIn && <div className={"place-bet-btn "+disabled} onClick={play}>Place Bet</div>}
                            {!isLoggedIn && <div className={"place-bet-btn "+disabled} onClick={play}>Connect Wallet</div>}
                        </Row>
                    </Col>
                </Row>
{/*                 <Row className="button-bet-board">
                    <Col className="text-center">
                        <button className="button-wheel-room button-red" disabled={waitingTransaction} onClick={clearAll}>Clear All</button>
                        <button className="button-wheel-room button-black" disabled={waitingTransaction} onClick={play}>Spin</button>
                    </Col>
                    
                </Row> */}
            </Container>
            
            
            

            
        </div>
    )
}

export default WheelRoom;