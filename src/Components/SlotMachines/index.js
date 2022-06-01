import { useEffect,useRef,useState } from 'react';
import "./css/main.css";
import "./css/normalize.css";

import PopupConnexion from "../Connexion";
import Loading from "../Loading";

import {useGetLoginInfo,refreshAccount,transactionServices,useGetNetworkConfig} from "@elrondnetwork/dapp-core";

import { getResult } from '../../apiEndpoints';

import axios from 'axios';


import {
    Address,
    ContractFunction,
    Query,
    AbiRegistry,
    SmartContractAbi,
    SmartContract,
    ResultsParser
  } from '@elrondnetwork/erdjs';

import abiFile from "../../abi/Slotmachine.abi.json";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers";


function SlotGame(){

    let contractAddressSlotMachine=process.env.REACT_APP_SMART_CONTRACT_SLOT_MACHINE;

    const { network } = useGetNetworkConfig();

    const gameCanvasElement=useRef(null);
    const mainLoaderElement=useRef(null);
    const canvasHolderElement=useRef(null);
    const mainLoaderSpanElement=useRef(null);
    const mobileRotateElement=useRef(null);
    const rotateHolderElement=useRef(null);
    const notSupportHolderElement=useRef(null);

    const { sendTransactions } = transactionServices;

    const [showPopup,setShowPopup] = useState(false);

	const handleClosePopup = () => {
		setShowPopup(false);
	}

    const {isLoggedIn}=useGetLoginInfo();

    const [sessionId, setSessionId] = useState(null);

    

    


    ////////////////////////////////////////////////////////////
    // Smartcontract interactions
    ////////////////////////////////////////////////////////////
    const spinSlot = async (bet) => {
        let betEGLD = bet * 10**18;
        const spinTransaction = {
            value: betEGLD.toString(),
            data: 'bet',
            receiver: contractAddressSlotMachine,
            gasLimit: 600_000_000,
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
        }
    }

    ////////////////////////////////////////////////////////////
    // INIT
    ////////////////////////////////////////////////////////////
    var stageWidth,stageHeight=0;
    var isLoaded=false;

    let valueJackpot=0;    
    useEffect(async () => {
        valueJackpot = await getJackpot();
        var resumeAudioContext = function() {
            // handler for fixing suspended audio context in Chrome
            try {
                if (window.createjs.WebAudioPlugin.context.state === "suspended") {
                    window.createjs.WebAudioPlugin.context.resume();
                    // Should only need to fire once
                    window.removeEventListener("click", resumeAudioContext);
                }
            } catch (e) {
                // SoundJS context or web audio plugin may not exist
                console.error("There was an error while trying to resume the SoundJS Web Audio context...");
                console.error(e);
            }
        };
        window.addEventListener("click", resumeAudioContext);
        
        // Check for running exported on file protocol
        if (window.location.protocol.substr(0, 4) === "file"){
            alert("To install the game just upload folder 'game' to your server. The game won't run locally with some browser like Chrome due to some security mode.");
        }
        
        
        window.$(window).resize(function(){
            resizeLoaderFunc();
        });
        resizeLoaderFunc();
        checkBrowser();
        
        return () => {
            removeGameCanvas();
            stopGame();
            window.removeEventListener("click", resumeAudioContext);
            window.createjs.Ticker.removeEventListener("tick", tick);
            buttonStart.removeEventListener("click");
            window.itemHandleAnimate.removeEventListener("click");
            window.buttonInfo.removeEventListener("click");
            window.buttonClose.removeEventListener("click");
            window.buttonLines.removeEventListener("click");
            window.buttonBet.removeEventListener("click");
            window.buttonMaxBet.removeEventListener("click");
            buttonContinue.removeEventListener("click");
            buttonFacebook.removeEventListener("click");
            buttonTwitter.removeEventListener("click");
            buttonWhatsapp.removeEventListener("click");
            buttonSoundOff.removeEventListener("click");
            buttonSoundOn.removeEventListener("click");
            buttonFullscreen.removeEventListener("click");
            window.buttonSettings.removeEventListener("click");
            window.buttonExit.removeEventListener("click");
            window.buttonConfirm.removeEventListener("click");
            window.itemExit.removeEventListener("click");
            window.buttonCancel.removeEventListener("click");
            window.loader.removeEventListener("complete",handleComplete);
            window.loader.removeEventListener("fileload");
            window.buttonSpin.removeEventListener("click");
            window.loader.destroy();
            window.loader.close();
            window.loader.cancel();
        }   
        

    },[]);

    ////////////////////////////////////////////////////////////
    // CANVAS
    ////////////////////////////////////////////////////////////
    var stage
    var canvasW=0;
    var canvasH=0;

    /*!
    * 
    * START GAME CANVAS - This is the function that runs to setup game canvas
    * 
    */
    function initGameCanvas(w,h){
        var gameCanvas = gameCanvasElement.current;
        gameCanvas.width = w;
        gameCanvas.height = h;
        
        canvasW=w;
        canvasH=h;
        stage = new window.createjs.Stage("gameCanvas");
        
        window.createjs.Touch.enable(stage);
        stage.enableMouseOver(20);
        stage.mouseMoveOutside = true;
        
        window.createjs.Ticker.framerate = 60;
        window.createjs.Ticker.addEventListener("tick", tick);	
    }

    var guide = false;
    var canvasContainer, mainContainer, gameContainer, resultContainer;
    var guideline, logo, buttonStart, buttonContinue, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff;

    let columnMask = [];
    let slots = [];
    let slotsWinFrame = [];
    let lines = [];

    /*!
    * 
    * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
    * 
    */
    function buildGameCanvas(){
        canvasContainer = new window.createjs.Container();
        mainContainer = new window.createjs.Container();
        gameContainer = new window.createjs.Container();
        window.infoContainer = new window.createjs.Container();
        window.linesContainer = new window.createjs.Container();
        window.slotContainer = new window.createjs.Container();
        window.slotWinContainer = new window.createjs.Container();
        window.slotWinFrameContainer = new window.createjs.Container();
        window.confirmContainer = new window.createjs.Container();
        window.optionsContainer = new window.createjs.Container();
        resultContainer = new window.createjs.Container();
        
        logo = new window.createjs.Bitmap(window.loader.getResult('logo'));
        
        buttonStart = new window.createjs.Bitmap(window.loader.getResult('buttonStart'));
        centerReg(buttonStart);
        
        buttonStart.x = canvasW/2;
        buttonStart.y = canvasH/100 * 80;
        
        //game
        for(var n = 0; n<slots_arr.length; n++){
            slots[n] = new window.createjs.Bitmap(window.loader.getResult('slot'+n));
            centerReg(slots[n]);
            
            slots[n].x = -500;
            
            var _frameW = slotSettings.width;
            var _frameH = slotSettings.height;
            var _frame = {"regX": _frameW/2, "regY": _frameH/2, "height": _frameH, "count": 10, "width": _frameW};
            var _animations = {static:{frames: [0], speed:1},
                            animate:{frames: [0,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,0], speed:1}};

            var itemSlotData = new window.createjs.SpriteSheet({
                "images": [window.loader.getResult('slotAnimate'+n).src],
                "frames": _frame,
                "animations": _animations
            });
            slots['animate'+n] = new window.createjs.Sprite(itemSlotData, "static");
            slots['animate'+n].framerate = 20;
            slots['animate'+n].x = -200;
            
            gameContainer.addChild(slots[n], slots['animate'+n]);
        }

        
        window.itemMachine = new window.createjs.Bitmap(window.loader.getResult('itemMachine'));
        window.itemShadow = new window.createjs.Bitmap(window.loader.getResult('itemShadow'));
        
        window.buttonInfo = new window.createjs.Bitmap(window.loader.getResult('buttonInfo'));
        

        centerReg(window.buttonInfo);
        
        
        window.buttonLines = new window.createjs.Bitmap(window.loader.getResult('buttonLines'));
        centerReg(window.buttonLines);
        
        
        window.buttonBet = new window.createjs.Bitmap(window.loader.getResult('buttonBet'));
        centerReg(window.buttonBet);
        
        
        window.buttonMaxBet = new window.createjs.Bitmap(window.loader.getResult('buttonMaxBet'));
        centerReg(window.buttonMaxBet);
        
        window.buttonSpin = new window.createjs.Bitmap(window.loader.getResult('buttonSpin'));
        centerReg(window.buttonSpin);
        
        window.itemDisplayLines = new window.createjs.Bitmap(window.loader.getResult('itemDisplay'));
        centerReg(window.itemDisplayLines);
        
        window.itemDisplayBet = new window.createjs.Bitmap(window.loader.getResult('itemDisplay'));
        centerReg(window.itemDisplayBet);
        
        window.itemDisplayMaxBet = new window.createjs.Bitmap(window.loader.getResult('itemDisplay'));
        centerReg(window.itemDisplayMaxBet);
        
        window.itemDisplaySpin = new window.createjs.Bitmap(window.loader.getResult('itemDisplay'));
        centerReg(window.itemDisplaySpin);
        
        window.linesTxt = new window.createjs.Text();
        window.linesTxt.font = "30px bebas_neueregular";
        window.linesTxt.color = "#fff";
        window.linesTxt.textAlign = "center";
        window.linesTxt.textBaseline='alphabetic';
        window.linesTxt.text = 0;
        
        window.betTxt = new window.createjs.Text();
        window.betTxt.font = "30px bebas_neueregular";
        window.betTxt.color = "#fff";
        window.betTxt.textAlign = "center";
        window.betTxt.textBaseline='alphabetic';
        window.betTxt.text = 0;
        
        
        window.maxBetTxt = new window.createjs.Text();
        
        window.maxBetTxt.font = "30px bebas_neueregular";
        window.maxBetTxt.color = "#fff";
        window.maxBetTxt.textAlign = "center";
        window.maxBetTxt.textBaseline='alphabetic';
        window.maxBetTxt.text = 0;
        
        window.spinTxt = new window.createjs.Text();
        window.spinTxt.font = "30px bebas_neueregular";
        window.spinTxt.color = "#fff";
        window.spinTxt.textAlign = "center";
        window.spinTxt.textBaseline='alphabetic';
        window.spinTxt.text = 0;
        
        window.itemCredit = new window.createjs.Bitmap(window.loader.getResult('itemCredit'));
        centerReg(window.itemCredit);
        window.itemCreditAlert = new window.createjs.Bitmap(window.loader.getResult('itemCreditAlert'));
        centerReg(window.itemCreditAlert);
        window.itemCredit.x = window.itemCreditAlert.x = canvasW/2;
        window.itemCredit.y = window.itemCreditAlert.y = layoutPos.creditY;
        
        
        var _frameW = 348;
        var _frameH = 71;
        var _frame = {"regX": _frameW/2, "regY": _frameH/2, "height": _frameH, "count": 5, "width": _frameW};
        var _animations = {animate:{frames: [0,1,2,3,4], speed:1}};
                            
        window.itemCreditData = new window.createjs.SpriteSheet({
            "images": [window.loader.getResult('itemCreditAnimate').src],
            "frames": _frame,
            "animations": _animations
        });
        
        window.itemCreditAnimate = new window.createjs.Sprite(window.itemCreditData, "animate");
        window.itemCreditAnimate.framerate = 20;
        window.itemCreditAnimate.x = canvasW/2;
        window.itemCreditAnimate.y = layoutPos.creditY;
        
        
        window.creditTxt = new window.createjs.Text();
        window.creditTxt.font = "35px bebas_neueregular";
        window.creditTxt.color = "#fff";
        window.creditTxt.textAlign = "center";
        window.creditTxt.textBaseline='alphabetic';
        window.creditTxt.text = 0;
        window.creditTxt.x = window.itemCredit.x;
        window.creditTxt.y = window.itemCredit.y+10;
        
        var objPos_arr = [window.buttonInfo, window.buttonLines, window.buttonBet, window.buttonMaxBet, window.buttonSpin];
        var objDisplayPos_arr = [null, window.itemDisplayLines, window.itemDisplayBet, window.itemDisplayMaxBet, window.itemDisplaySpin];
        var objTextPos_arr = [null, window.linesTxt, window.betTxt, window.maxBetTxt, window.spinTxt];
        
        if(lines_arr.length <= 1){
            window.buttonLines.visible = window.itemDisplayLines.visible = window.linesTxt.visible = false;
            var objPos_arr = [window.buttonInfo, window.buttonBet, window.buttonMaxBet, window.buttonSpin];
            var objDisplayPos_arr = [null, window.itemDisplayBet, window.itemDisplayMaxBet, window.itemDisplaySpin];
            var objTextPos_arr = [null, window.betTxt, window.maxBetTxt, window.spinTxt];	
        }
        
        var spacing = 10;
        var startX = 0;
        var startY = 0;
        var currentX = 0;
        var currentY = 0;
        
        var totalW = 0;
        
        for(var n=0; n<objPos_arr.length; n++){
            var curObj = objPos_arr[n];
            totalW += curObj.image.naturalWidth + spacing;
        }
        totalW -= objPos_arr[0].image.naturalWidth/2;
        totalW -= objPos_arr[objPos_arr.length-1].image.naturalWidth/2;
        totalW -= spacing;
        
        startX = canvasW/2 - (totalW/2);
        currentX = startX;
        currentY = layoutPos.buttonY;
        
        for(var n=0; n<objPos_arr.length; n++){
            var curObj = objPos_arr[n];
            
            if(n!= 0){
                currentX += (curObj.image.naturalWidth/2);
            }
            
            curObj.x = currentX;
            curObj.y = currentY;
            
            if(objDisplayPos_arr[n] != null){
                objDisplayPos_arr[n].x = currentX;
                objDisplayPos_arr[n].y = currentY-43;
            }
            
            if(objTextPos_arr[n] != null){
                objTextPos_arr[n].x = currentX;
                objTextPos_arr[n].y = currentY-43;
            }
            
            currentX += (curObj.image.naturalWidth/2) + spacing;
        }
        
        var _frameW = slotSettings.width;
        var _frameH = slotSettings.height;
        var _frame = {"regX": _frameW/2, "regY": _frameH/2, "height": _frameH, "count": 5, "width": _frameW};
        var _animations = {animate:{frames: [0,1,2,3,4], speed:1}};
                            
        window.itemSlotFrameData = new window.createjs.SpriteSheet({
            "images": [window.loader.getResult('itemSlotFrame').src],
            "frames": _frame,
            "animations": _animations
        });
        
        window.itemSlotFrameAnimate = new window.createjs.Sprite(window.itemSlotFrameData, "animate");
        window.itemSlotFrameAnimate.framerate = 20;
        window.itemSlotFrameAnimate.x = -200;
        
        var _frameW = 60;
        var _frameH = 250;
        var _frame = {"regX": _frameW/2, "regY": _frameH/2, "height": _frameH, "count": 5, "width": _frameW};
        var _animations = {static:{frames: [0], speed:1},
                        animate:{frames: [0,1,2,3,4,3,2,1,0], speed:1, next:'static'}};
                            
        window.itemHandleData = new window.createjs.SpriteSheet({
            "images": [window.loader.getResult('itemHandle').src],
            "frames": _frame,
            "animations": _animations
        });
        
        window.itemHandleAnimate = new window.createjs.Sprite(window.itemHandleData, "static");
        window.itemHandleAnimate.framerate = 20;
        window.itemHandleAnimate.x = canvasW/100 * 89;
        window.itemHandleAnimate.y = canvasH/100 * 42;
        
        //lines
        for(var n = 0; n<lines_arr.length; n++){
            lines['line'+n] = new window.createjs.Shape();
            if(lines_arr[n].path.length > 0){
            
                //shadow
                lines['line'+n].graphics.setStrokeStyle(lineSettings.stroke).beginStroke(lines_arr[n].shadow).moveTo(lines_arr[n].path[0].x, lines_arr[n].path[0].y+lineSettings.shadowY);
                for(var l = 0; l<lines_arr[n].path.length; l++){
                    lines['line'+n].graphics.lineTo(lines_arr[n].path[l].x, lines_arr[n].path[l].y+lineSettings.shadowY);
                }
                lines['line'+n].graphics.endStroke();
                
                //stroke
                lines['line'+n].graphics.setStrokeStyle(lineSettings.stroke).beginStroke(lines_arr[n].color).moveTo(lines_arr[n].path[0].x, lines_arr[n].path[0].y);
                for(var l = 0; l<lines_arr[n].path.length; l++){
                    lines['line'+n].graphics.lineTo(lines_arr[n].path[l].x, lines_arr[n].path[l].y);
                }
                lines['line'+n].graphics.endStroke();
            }
            
            window.linesContainer.addChild(lines['line'+n]);
            
            for(var l = 0; l<lines_arr[n].sign.length; l++){
                lines['lineOn'+n+'_'+l] = new window.createjs.Bitmap(window.loader.getResult('itemLineDisplayOn'));
                centerReg(lines['lineOn'+n+'_'+l]);
                lines['lineOn'+n+'_'+l].x = lines_arr[n].sign[l].x;
                lines['lineOn'+n+'_'+l].y = lines_arr[n].sign[l].y;
                
                lines['lineOff'+n+'_'+l] = new window.createjs.Bitmap(window.loader.getResult('itemLineDisplayOff'));
                centerReg(lines['lineOff'+n+'_'+l]);
                lines['lineOff'+n+'_'+l].x = lines_arr[n].sign[l].x;
                lines['lineOff'+n+'_'+l].y = lines_arr[n].sign[l].y;
                
                lines['lineText'+n+'_'+l] = new window.createjs.Text();
                lines['lineText'+n+'_'+l].font = "25px bebas_neueregular";
                lines['lineText'+n+'_'+l].color = "#fff";
                lines['lineText'+n+'_'+l].textAlign = "center";
                lines['lineText'+n+'_'+l].textBaseline='alphabetic';
                lines['lineText'+n+'_'+l].text = n+1;
                lines['lineText'+n+'_'+l].x = lines_arr[n].sign[l].x;
                lines['lineText'+n+'_'+l].y = lines_arr[n].sign[l].y+10;
                
                if(lineSettings.sign){
                    window.linesContainer.addChild(lines['lineOn'+n+'_'+l], lines['lineOff'+n+'_'+l]);
                }
                if(lineSettings.number){
                    window.linesContainer.addChild(lines['lineText'+n+'_'+l]);	
                }
            }
        }
        
        //info
        window.itemInfo = new window.createjs.Bitmap(window.loader.getResult('itemInfo'));
        window.buttonClose = new window.createjs.Bitmap(window.loader.getResult('buttonClose'));
        centerReg(window.buttonClose);
        window.buttonClose.x = canvasW/2;
        window.buttonClose.y = canvasH/100 * 80;
        
        window.infoContainer.addChild(window.itemInfo, window.buttonClose);
        
        //result
        window.itemResult = new window.createjs.Bitmap(window.loader.getResult('itemResult'));
        
        window.resultTitleTxt = new window.createjs.Text();
        window.resultTitleTxt.font = "60px bebas_neueregular";
        window.resultTitleTxt.color = "#652312";
        window.resultTitleTxt.textAlign = "center";
        window.resultTitleTxt.textBaseline='alphabetic';
        window.resultTitleTxt.text = resultTitleText;
        window.resultTitleTxt.x = canvasW/2;
        window.resultTitleTxt.y = canvasH/100 * 33;
        
        window.resultScoreTxt = new window.createjs.Text();
        window.resultScoreTxt.font = "100px bebas_neueregular";
        window.resultScoreTxt.color = "#ff7900";
        window.resultScoreTxt.textAlign = "center";
        window.resultScoreTxt.textBaseline='alphabetic';
        window.resultScoreTxt.text = 'Jackpot : ';
        window.resultScoreTxt.x = canvasW/2;
        window.resultScoreTxt.y = canvasH/100 * 45;
        
        window.resultShareTxt = new window.createjs.Text();
        window.resultShareTxt.font = "30px bebas_neueregular";
        window.resultShareTxt.color = "#5e5e5e";
        window.resultShareTxt.textAlign = "center";
        window.resultShareTxt.textBaseline='alphabetic';
        window.resultShareTxt.text = shareText;
        window.resultShareTxt.x = canvasW/2;
        window.resultShareTxt.y = canvasH/100 * 52;
        
        buttonFacebook = new window.createjs.Bitmap(window.loader.getResult('buttonFacebook'));
        buttonTwitter = new window.createjs.Bitmap(window.loader.getResult('buttonTwitter'));
        buttonWhatsapp = new window.createjs.Bitmap(window.loader.getResult('buttonWhatsapp'));
        centerReg(buttonFacebook);
        createHitarea(buttonFacebook);
        centerReg(buttonTwitter);
        createHitarea(buttonTwitter);
        centerReg(buttonWhatsapp);
        createHitarea(buttonWhatsapp);
        buttonFacebook.x = canvasW/100 * 42;
        buttonTwitter.x = canvasW/2;
        buttonWhatsapp.x = canvasW/100 * 58;
        buttonFacebook.y = buttonTwitter.y = buttonWhatsapp.y = canvasH/100*58;
        
        buttonContinue = new window.createjs.Bitmap(window.loader.getResult('buttonContinue'));
        centerReg(buttonContinue);
        createHitarea(buttonContinue);
        buttonContinue.x = canvasW/2;
        buttonContinue.y = canvasH/100 * 70;
        
        //option
        buttonFullscreen = new window.createjs.Bitmap(window.loader.getResult('buttonFullscreen'));
        centerReg(buttonFullscreen);
        buttonSoundOn = new window.createjs.Bitmap(window.loader.getResult('buttonSoundOn'));
        centerReg(buttonSoundOn);
        buttonSoundOff = new window.createjs.Bitmap(window.loader.getResult('buttonSoundOff'));
        centerReg(buttonSoundOff);
        buttonSoundOn.visible = false;
        window.buttonExit = new window.createjs.Bitmap(window.loader.getResult('buttonExit'));
        centerReg(window.buttonExit);
        window.buttonSettings = new window.createjs.Bitmap(window.loader.getResult('buttonSettings'));
        centerReg(window.buttonSettings);
        
        createHitarea(buttonFullscreen);
        createHitarea(buttonSoundOn);
        createHitarea(buttonSoundOff);
        createHitarea(window.buttonExit);
        createHitarea(window.buttonSettings);
        
        //exit
        window.itemExit = new window.createjs.Bitmap(window.loader.getResult('itemExit'));
        window.itemExit.hitArea = new window.createjs.Shape(new window.createjs.Graphics().beginFill("#000").drawRect(0, 0, window.itemExit.image.naturalWidth, window.itemExit.image.naturalHeight));
        
        window.buttonConfirm = new window.createjs.Bitmap(window.loader.getResult('buttonConfirm'));
        centerReg(window.buttonConfirm);
        window.buttonConfirm.x = canvasW/100* 42;
        window.buttonConfirm.y = canvasH/100 * 65;
        
        window.buttonCancel = new window.createjs.Bitmap(window.loader.getResult('buttonCancel'));
        centerReg(window.buttonCancel);
        window.buttonCancel.x = canvasW/100 * 58;
        window.buttonCancel.y = canvasH/100 * 65;
        
        window.confirmMessageTxt = new window.createjs.Text();
        window.confirmMessageTxt.font = "50px bebas_neueregular";
        window.confirmMessageTxt.color = "#652312";
        window.confirmMessageTxt.textAlign = "center";
        window.confirmMessageTxt.textBaseline='alphabetic';
        window.confirmMessageTxt.text = exitMessage;
        window.confirmMessageTxt.lineHeight = 50;
        window.confirmMessageTxt.x = canvasW/2;
        window.confirmMessageTxt.y = canvasH/100 *45;
        
        window.confirmContainer.addChild(window.itemExit, window.buttonConfirm, window.buttonCancel, window.confirmMessageTxt);
        window.confirmContainer.visible = false;
        
        if(guide){
            guideline = new window.createjs.Shape();	
            guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
        }
        
        mainContainer.addChild(logo, buttonStart);
        gameContainer.addChild(window.itemSlotFrameAnimate, window.itemMachine, window.itemHandleAnimate, window.slotContainer, window.linesContainer, window.slotWinContainer, window.itemShadow, window.slotWinFrameContainer, window.itemDisplayLines, window.itemDisplayBet, window.itemDisplayMaxBet, window.itemDisplaySpin, window.buttonInfo, window.buttonLines, window.buttonBet, window.buttonMaxBet, window.buttonSpin, window.linesTxt, window.betTxt, window.maxBetTxt, window.spinTxt, window.itemCredit, window.itemCreditAlert, window.itemCreditAnimate, window.creditTxt, window.infoContainer);
        resultContainer.addChild(window.itemResult, window.resultTitleTxt, window.resultScoreTxt, buttonContinue);
        window.optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, window.buttonExit);
        window.optionsContainer.visible = false;
        
        if(shareEnable){
            resultContainer.addChild(window.resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
        }
        
        canvasContainer.addChild(mainContainer, gameContainer, resultContainer, window.confirmContainer, window.optionsContainer, window.buttonSettings, guideline);
        stage.addChild(canvasContainer);
        
        resizeCanvas();
    }


    /*!
    * 
    * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
    * 
    */
    function resizeCanvas(){
        if(canvasContainer!=undefined){
            window.buttonSettings.x = (canvasW - offset.x) - 60;
            window.buttonSettings.y = offset.y + 60;
            
            var distanceNum = 75;
            if(curPage != 'game'){
                window.buttonExit.visible = false;
                buttonSoundOn.x = buttonSoundOff.x = window.buttonSettings.x;
                buttonSoundOn.y = buttonSoundOff.y = window.buttonSettings.y+distanceNum;
                buttonSoundOn.x = buttonSoundOff.x;
                buttonSoundOn.y = buttonSoundOff.y = window.buttonSettings.y+(distanceNum);
                
                buttonFullscreen.x = window.buttonSettings.x;
                buttonFullscreen.y = window.buttonSettings.y+(distanceNum*2);
            }else{
                window.buttonExit.visible = true;
                buttonSoundOn.x = buttonSoundOff.x = window.buttonSettings.x;
                buttonSoundOn.y = buttonSoundOff.y = window.buttonSettings.y+distanceNum;
                buttonSoundOn.x = buttonSoundOff.x;
                buttonSoundOn.y = buttonSoundOff.y = window.buttonSettings.y+(distanceNum);
                
                buttonFullscreen.x = window.buttonSettings.x;
                buttonFullscreen.y = window.buttonSettings.y+(distanceNum*2);
                
                window.buttonExit.x = window.buttonSettings.x;
                window.buttonExit.y = window.buttonSettings.y+(distanceNum*3);
            }
        }

    }

    /*!
    * 
    * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
    * 
    */
    function removeGameCanvas(){
        stage.autoClear = true;
        stage.removeAllChildren();
        stage.update();
        window.createjs.Ticker.removeEventListener("tick", tick);
        window.createjs.Ticker.removeEventListener("tick", stage);
    }

    /*!
    * 
    * CANVAS LOOP - This is the function that runs for canvas loop
    * 
    */ 
    function tick(event) {
        updateGame();
        stage.update(event);
    }

    /*!
    * 
    * CANVAS MISC FUNCTIONS
    * 
    */
    function centerReg(obj){
        obj.regX=obj.image.naturalWidth/2;
        obj.regY=obj.image.naturalHeight/2;

    }

    function createHitarea(obj){
        obj.hitArea = new window.createjs.Shape(new window.createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
    }

    ////////////////////////////////////////////////////////////
    // GAME v1.6
    ////////////////////////////////////////////////////////////

    var playerData = {credit:0, creditSum:0, amount:0, bet:0, win:0, totalWin:0};
    var gameData = {paused:true, resultArray:null};
    var slotData = {spin:false, lines:9, amount:0, extraslot:2, spinComplete:0, array:[], resultArray:[], linesArray:[], winFrameArray:[], winSlotArray:[], lineHighlight:0, creditAlert:0,};
    var oddsData = {spin:{index:0, min:2, max:4, count:0}, joy:{index:0, min:50, max:80, count:0}, extremeCon:false, normal:[], wild:[], extreme:[]};

    /*!
    * 
    * GAME BUTTONS - This is the function that runs to setup button event
    * 
    */
    function buildGameButton(){
        if(enablePercentage){
            createPercentage();
        }
        
        buttonStart.cursor = "pointer";

        buttonStart.addEventListener("click", function handlerBuildGameButton(evt) {
            playSound('soundClick');
            
            //memberpayment
            if(typeof window.memberData != 'undefined' && window.memberSettings.enableMembership){
                if(!window.checkMemberGameType()){
                    window.goMemberPage('user');
                }else{
                    goPage('game');
                }
            }else{
                goPage('game');
            }
        });
        
        window.buttonSpin.cursor = "pointer";
        window.buttonSpin.addEventListener("click", function(evt) {
            gameData.resultArray = [1,1,1];
            if(!isLoggedIn){
                setShowPopup(true);
            }else{
                playSound('soundClick');
                spinSlot(formatCurrency((betAmount_arr[slotData.amount] * (slotData.lines+1))));
                
            
                //multi-line slots
                /*gameData.resultArray = [
                            9,6,4,0,9,
                            2,3,1,6,4,
                            6,2,1,2,3];*/
    
                //classic three line slots
                
    
                //startSpin();
            }

        });

        document.getElementById("mainHolder").addEventListener("spin",function(evt){
            gameData.resultArray = evt.detail.value;
            
            startSpin();
        });
        
        window.itemHandleAnimate.cursor = "pointer";
        window.itemHandleAnimate.addEventListener("click", function(evt) {
            gameData.resultArray = [1,1,1];
            if(!isLoggedIn){
                setShowPopup(true);
            }else{
                playSound('soundClick');
                spinSlot(formatCurrency((betAmount_arr[slotData.amount] * (slotData.lines+1))));
                
            }

        });
        
        window.buttonInfo.cursor = "pointer";
        window.buttonInfo.addEventListener("click", function(evt) {
            if(slotData.spin){
                return;	
            }
            
            playSound('soundClick');
            window.infoContainer.visible = true;
        });
        
        window.buttonClose.cursor = "pointer";
        window.buttonClose.addEventListener("click", function(evt) {
            playSound('soundClick');
            window.infoContainer.visible = false;
        });
        
        window.buttonLines.cursor = "pointer";
        window.buttonLines.addEventListener("click", function(evt) {
            playSound('soundClick');
            toggleBetLines(true);
        });
        
        window.buttonBet.cursor = "pointer";
        window.buttonBet.addEventListener("click", function(evt) {
            playSound('soundClick');
            toggleBetAmount();
        });
        
        window.buttonMaxBet.cursor = "pointer";
        window.buttonMaxBet.addEventListener("click", function(evt) {
            playSound('soundClick');
            toggleBetAmount(true);
            if(!isLoggedIn){
                setShowPopup(true);
            }else{
                playSound('soundClick');
                spinSlot(formatCurrency((betAmount_arr[slotData.amount] * (slotData.lines+1))));
            }

        });
        
        
        buttonContinue.cursor = "pointer";
        buttonContinue.addEventListener("click", function(evt) {
            playSound('soundClick');
            goPage('main');
        });
        
        buttonFacebook.cursor = "pointer";
        buttonFacebook.addEventListener("click", function(evt) {
            share('facebook');
        });
        buttonTwitter.cursor = "pointer";
        buttonTwitter.addEventListener("click", function(evt) {
            share('twitter');
        });
        buttonWhatsapp.cursor = "pointer";
        buttonWhatsapp.addEventListener("click", function(evt) {
            share('whatsapp');
        });
        
        buttonSoundOff.cursor = "pointer";
        buttonSoundOff.addEventListener("click", function(evt) {
            toggleGameMute(true);
            toggleOption();
        });
        
        buttonSoundOn.cursor = "pointer";
        buttonSoundOn.addEventListener("click", function(evt) {
            toggleGameMute(false);
            toggleOption();
        });
        
        buttonFullscreen.cursor = "pointer";
        buttonFullscreen.addEventListener("click", function(evt) {
            toggleFullScreen();
            toggleOption();
        });
        
        window.buttonSettings.cursor = "pointer";
        window.buttonSettings.addEventListener("click", function(evt) {
            toggleOption();
        });
        
        window.buttonExit.cursor = "pointer";
        window.buttonExit.addEventListener("click", function(evt) {
            toggleConfirm(true);
            toggleOption();

        });
        
        window.buttonConfirm.cursor = "pointer";
        window.buttonConfirm.addEventListener("click", function(evt) {
            toggleConfirm(false);
            window.location.href = "/";
            //goPage('result');
        });
        
        window.itemExit.addEventListener("click", function(evt) {
            
        });
        
        window.buttonCancel.cursor = "pointer";
        window.buttonCancel.addEventListener("click", function(evt) {
            toggleConfirm(false);
        });
    }

    function toggleWheelActive(con){
        if(con){
            window.wheelContainer.cursor = "pointer";
        }else{
            window.wheelContainer.cursor = "default";	
        }
    }

    /*!
    * 
    * DISPLAY PAGES - This is the function that runs to display pages
    * 
    */
    var curPage=''
    function goPage(page){
        curPage=page;
        
        mainContainer.visible = false;
        gameContainer.visible = false;
        resultContainer.visible = false;
        
        var targetContainer = null;
        switch(page){
            case 'main':
                targetContainer = mainContainer;
            break;
            
            case 'game':
                targetContainer = gameContainer;
                startGame();
            break;
            
            case 'result':
                targetContainer = resultContainer;
                playSound('soundResult');
                
                stopGame();
                
                //var tweenValue = {value:0}
                /* window.TweenMax.to(tweenValue, 1, {value:playerData.totalWin, overwrite:true, onUpdate:function(){
                    window.resultScoreTxt.text = resultScoreText.replace('[NUMBER]', formatCurrency(tweenValue.value));	
                }}); */
                
                saveGame(playerData.totalWin);
            break;
        }
        
        if(targetContainer != null){
            targetContainer.visible = true;
            targetContainer.alpha = 0;
            window.TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
        }
        
        resizeCanvas();
    }



    function toggleConfirm(con){
        window.confirmContainer.visible = con;
        
        if(con){
            window.TweenMax.pauseAll(true, true);
            gameData.paused = true;
        }else{
            window.TweenMax.resumeAll(true, true)
            gameData.paused = false;
        }
    }

    /*!
    * 
    * START GAME - This is the function that runs to start play game
    * 
    */

    function startGame(){
        window.itemHandleAnimate.visible = spinSettings.handle;
        window.linesContainer.visible = lineSettings.display;
        window.itemCreditAlert.alpha = 0;
        window.creditTxt.alpha =1;
        
        window.infoContainer.visible = false;
        slotData.lines = lines_arr.length-1;
        slotData.amount = 0;
        slotData.spin = false;
        toggleBetLines(false);
        resetHighlightWinSlots();
        
        playerData.credit = creditAmount;
        playerData.bet = 0;
        playerData.win = 0;
        playerData.totalWin = 0;
        playerData.amount = 0;
        
        //memberpayment
        if(typeof window.memberData != 'undefined' && window.memberSettings.enableMembership){
            playerData.credit = window.memberData.point;
        }
        
        oddsData.spin.count = randomIntFromInterval(oddsData.spin.min, oddsData.spin.max);
        oddsData.joy.count = randomIntFromInterval(oddsData.joy.min, oddsData.joy.max);
        shuffle(oddsData.normal);
        oddsData.spin.index = 0;
        shuffle(oddsData.extreme);
        oddsData.joy.index = 0;
        oddsData.extremeCon = false;
        
        window.spinTxt.text = '';
        updateGameStat();
        prepareSlots();
        
        for(var c = 0; c<slotSettings.column; c++){
            slotData.array[c].y = slotData.array[c].posY = ((slotData.array[c].total-slotData.extraslot)-slotSettings.row) * slotSettings.height;
        }
    }

    /*!
    * 
    * STOP GAME - This is the function that runs to stop play game
    * 
    */
    function stopGame(){
        window.TweenMax.killAll();
        
        slotData.resultArray.length = 0;
        slotData.winSlotArray.length = 0;
        slotData.linesArray.length = 0;
        window.slotWinContainer.removeAllChildren();
    }

    /*!
    * 
    * SAVE GAME - This is the function that runs to save game
    * 
    */
    function saveGame(score){
        if ( typeof window.toggleScoreboardSave == 'function' ) { 
            window.$.scoreData.score = score;
            if(typeof window.type != 'undefined'){
                window.$.scoreData.type = window.type;	
            }
            window.toggleScoreboardSave(true);
        }

        /*window.$.ajax({
        type: "POST",
        url: 'saveResults.php',
        data: {score:score},
        success: function (result) {
            console.log(result);
        }
        });*/
    }

    /*!
    * 
    * DRAW SLOTS - This is the function that runs to draw slots
    * 
    */
    function drawSlots(){
        slotData.extraslot = slotSettings.row-1;
        slotData.extraslot = slotData.extraslot <= 0 ? 1 : slotData.extraslot;
        
        //masking
        var totalSlotW = slotSettings.width * slotSettings.column;
        var totalSlotH = slotSettings.height * slotSettings.row;
        slotSettings.startX = ((stageW/2)-(totalSlotW/2))+slotSettings.offsetX;
        slotSettings.startY = ((stageH/2)-(totalSlotH/2))+slotSettings.offsetY;
        var currentX = slotSettings.startX;
        var currentY = slotSettings.startY;
        
        slotData.winFrameArray = [];
        for(var n = 0; n<slotSettings.column; n++){
            
            slotData.winFrameArray[n] = [];
            
            currentY = slotSettings.startY;
                
            columnMask[n] = new window.createjs.Shape();
            columnMask[n].graphics.beginFill('red').drawRect(0, 0, slotSettings.width, slotSettings.height * slotSettings.row);
            columnMask[n].x = currentX;
            columnMask[n].y = currentY;
            columnMask[n].visible = false;
            
            for(var r = 0; r<slotSettings.row; r++){
                
                
                slotData.winFrameArray[n][r] = window.itemSlotFrameAnimate.clone();
                slotData.winFrameArray[n][r].x = currentX + (slotSettings.width/2);
                slotData.winFrameArray[n][r].y = currentY + (slotSettings.height/2);
                slotData.winFrameArray[n][r].visible = false;
                
                currentY += slotSettings.height;
                window.slotWinFrameContainer.addChild(slotData.winFrameArray[n][r]);
            }
            
            currentX += slotSettings.width;
            window.slotContainer.addChild(columnMask[n]);
        }
        
        //slots	
        for(var c = 0; c<slotSettings.column; c++){
            slotData.array.push({y:0, tweenY:0, total:0, slots:[], obj:[], index:0});
            
            for(var n = 0; n<slots_arr.length; n++){
                slotData.array[c].slots.push(n);
            }
        }
        
        //odds
        sortOnObject(paytable_arr, 'pay', true);
        for(var n = 0; n<slots_arr.length; n++){
            var wildNum = wild_arr.indexOf(n);
            if(wildNum != -1){
                oddsData.wild.push(n);
            }else{
                oddsData.normal.push(n);		
            }
            
            for(var p = 0; p<paytable_arr.length; p++){
                if(paytable_arr[p].index.indexOf(n) != -1){
                    var totalInIndex = findTotalIndex(p, n);
                    for(var t = 0; t<totalInIndex; t++){
                        oddsData.extreme.push(n);
                    }
                }
            }
        }
        
        //bet
        betAmount_arr.sort(function(a, b){return a-b});
    }

    function findTotalIndex(p, index){
        var totalIndex = 0;
        for(var n = 0; n<paytable_arr[p].index.length; n++){
            if(paytable_arr[p].index[n] == index){
                totalIndex++;	
            }
        }
        return totalIndex;
    }

    /*!
    * 
    * TOGGLE BET LINES - This is the function that runs to toggle bet lines
    * 
    */
    function toggleBetLines(con){
        if(slotData.spin){
            return;	
        }
        resetHighlightWinSlots();
        
        if(con){
            slotData.lines++;
            slotData.lines = slotData.lines > lines_arr.length-1 ? 0 : slotData.lines;
        }
        
        for(var n = 0; n<lines_arr.length; n++){
            lines['line'+n].visible = false;
            if(n <= slotData.lines){
                lines['line'+n].visible = true;
            }
            
            for(var l = 0; l<lines_arr[n].sign.length; l++){
                lines['lineOn'+n+'_'+l].visible = false;
                lines['lineOff'+n+'_'+l].visible = true;
                
                if(n <= slotData.lines){
                    lines['lineOn'+n+'_'+l].visible = true;
                    lines['lineOff'+n+'_'+l].visible = false;
                }
            }
        }
        
        window.TweenMax.to(window.linesContainer, lineSettings.timer, {overwrite:true, onComplete:function(){
            for(var n = 0; n<lines_arr.length; n++){
                lines['line'+n].visible = false;
            }
            
            if(slotData.linesArray.length > 0){
                displayWinSlots();
            }
        }});
        
        updateGameStat();
    }

    /*!
    * 
    * TOGGLE BET AMOUNT - This is the function that runs to toggle bet amount
    * 
    */
    function toggleBetAmount(con){
        if(slotData.spin){
            return;	
        }
        
        if(con){
            //max bet
            slotData.amount = betAmount_arr.length-1;
        }else{
            slotData.amount++;
            slotData.amount = slotData.amount > betAmount_arr.length-1 ? 0 : slotData.amount;
        }
        
        updateGameStat();
    }

    /*!
    * 
    * PREPARE SLOTS - This is the function that runs to fill new slots
    * 
    */
    function prepareSlots(){

        
        window.slotContainer.removeAllChildren();
        
        for(var c = 0; c<slotSettings.column; c++){
            shuffle(slotData.array[c].slots);
            
            var currentX = slotSettings.startX + (slotSettings.width/2) + (slotSettings.width * c);
            var currentY = slotSettings.startY + (slotSettings.height/2);
            currentY += slotSettings.height * slotSettings.row;
            if(slotData.extraslot > 1){
                currentY += slotSettings.height * (slotData.extraslot-1);
            }
            
            slotData.array[c].total = spinSettings.slots * slotSettings.row;
            slotData.array[c].total += slotData.extraslot;
            
            var previousIndexArray = [];
            if(slotData.array[c].obj.length > 0){
                for(var s = slotData.array[c].obj.length-slotSettings.row; s<slotData.array[c].obj.length; s++){
                    previousIndexArray.push(slotData.array[c].obj[s].slotIndex);	
                }
            }
            slotData.array[c].obj.length = 0;
            
            var previousIndex = 0;
            for(var s = 0; s<slotData.array[c].total; s++){
                var resultSlot = false;
                if(s >= slotData.extraslot && previousIndex < previousIndexArray.length){
                    var slotIndex = previousIndexArray[previousIndex];
                    previousIndex++;
                }else{
                    var index = slotData.array[c].index;
                    var slotIndex = slotData.array[c].slots[index];
                    slotData.array[c].index++;
                    if(slotData.array[c].index > slotData.array[c].slots.length-1){
                        slotData.array[c].index = 0;
                        shuffle(slotData.array[c].slots);
                    }
                }
                
                var slotObj = slots[slotIndex].clone();
                slotObj.slotIndex = slotIndex;
                slotObj.mask = columnMask[c];
                window.slotContainer.addChild(slotObj);
                
                slotData.array[c].obj.push(slotObj);
                
                slotObj.x = currentX;
                slotObj.y = currentY;
                slotObj.oriY = slotObj.y;
                
                currentY -= (slotSettings.height);
            }
        }
        
    }

    /*!
    * 
    * PRESET SLOTS RESULT - This is the function that runs to preset slots result
    * 
    */
    function presetSlotsResult(){
        var slotResultIndex = 0;
        var slotsResult = [];
        
        if(gameData.resultArray == null){
            if(enablePercentage){
                slotsResult = getResultOnPercent();	
            }else {
                slotsResult = fillSlots(true);
            }
        }else{
            slotsResult = gameData.resultArray;
        }
        
        //fill slots
        for(var r = 0; r<slotSettings.row; r++){
            for(var c = 0; c<slotSettings.column; c++){
                var previousIndex = slotData.array[c].obj.length-(r+1);
                var previousObj = slotData.array[c].obj[previousIndex];
                
                var slotIndex = slotsResult[slotResultIndex];
                slotResultIndex++;
                
                var slotObj = slots[slotIndex].clone();

                slotObj.slotIndex = slotIndex;
                slotObj.mask = columnMask[c];
                slotObj.x = previousObj.x;
                slotObj.y = previousObj.y;
                slotObj.oriY = previousObj.y;
                
                window.slotContainer.removeChild(previousObj);
                window.slotContainer.addChild(slotObj);
                slotData.array[c].obj[previousIndex] = slotObj;
            }
        }
    }

    function fillSlots(random){
        var slotsResult = [];
            
        var slotsArray = oddsData.normal;
        if(random){
            if(oddsData.extremeCon){
                oddsData.extremeCon = false;
                oddsData.spin.index = 0;
                shuffle(slotsArray);
            }

            if(oddsData.spin.count <= 0){
                oddsData.extremeCon = true;
                oddsData.spin.count = randomIntFromInterval(oddsData.spin.min, oddsData.spin.max);
                slotsArray = oddsData.extreme;
                shuffle(slotsArray);
                oddsData.spin.index = 0;
            }

            for(var n=0; n<slotSettings.column*slotSettings.row; n++){
                if(oddsData.joy.count <= 0 && oddsData.wild.length > 0){
                    shuffle(oddsData.wild);
                    oddsData.joy.count = randomIntFromInterval(oddsData.joy.min, oddsData.joy.max);
                    slotsResult.push(oddsData.wild[0]);
                }else{
                    slotsResult.push(slotsArray[oddsData.spin.index]);

                    oddsData.spin.index++;
                    if(oddsData.spin.index > slotsArray.length-1){
                        oddsData.spin.index = 0;
                        shuffle(slotsArray);	
                    }
                }
                oddsData.joy.count--;
            }
            oddsData.spin.count--;
        }else{
            shuffle(gameData.slotArray);
            gameData.slotIndex = 0;
            
            for(var n=0; n<slotSettings.column*slotSettings.row; n++){
                slotsResult.push(gameData.slotArray[gameData.slotIndex]);
                gameData.slotIndex++;
                if(gameData.slotIndex > gameData.slotArray.length-1){
                shuffle(gameData.slotArray);
                    gameData.slotIndex = 0;   
                }
            }
        }
        
        return slotsResult;
    }

    /*!
    * 
    * START SPIN - This is the function that runs to start spin
    * 
    */
    function startSpin(){        
        if(slotData.spin){
            return;	
        }
        
        var currentBet = formatCurrency((betAmount_arr[slotData.amount] * (slotData.lines+1)));
        
        

        
        
        playSound('soundPuller');
        slotData.spin = true;
        slotData.resultArray.length = 0;
        slotData.winSlotArray.length = 0;
        slotData.linesArray.length = 0;
        window.slotWinContainer.removeAllChildren();
        
        resetHighlightWinSlots();
        window.TweenMax.to(window.linesContainer, .3, {overwrite:true, onComplete:function(){
            playSoundLoop('soundSpin');
        }});
        
        playerData.amount = betAmount_arr[slotData.amount];
        playerData.bet = currentBet;
        playerData.creditSum = playerData.credit - playerData.bet;
        
        //memberpayment
        if(typeof window.memberData != 'undefined' && window.memberSettings.enableMembership){
            window.updateUserPoint();
        }
        
        updateGameStat();

    
        prepareSlots();
        presetSlotsResult();

        
        slotData.spinComplete = 0;
        window.itemHandleAnimate.gotoAndPlay('animate');
        startSpinBounce();

    }

    function startSpinBounce(){
        for(var c = 0; c<slotSettings.column; c++){
            slotData.array[c].y = 0;
            slotData.array[c].posY = ((slotData.array[c].total-slotData.extraslot)-slotSettings.row) * slotSettings.height;
            window.TweenMax.to(slotData.array[c], spinSettings.startSpeed, {delay:spinSettings.delay*c, y:slotData.array[c].posY/3, ease:window.Back.easeIn, overwrite:true, onComplete:continueSpin, onCompleteParams:[c]});
        }
    }

    function continueSpin(c){
        var tweenSpeed = spinSettings.spinningSpeed + (spinSettings.increaseSpeed * c);
        window.TweenMax.to(slotData.array[c], tweenSpeed, {y:slotData.array[c].posY-100, ease:window.Linear.easeOut, overwrite:true, onComplete:finalSpin, onCompleteParams:[c]});
    }

    function finalSpin(c){
        window.TweenMax.to(slotData.array[c], spinSettings.stopSpeed, {y:slotData.array[c].posY, ease:window.Back.easeOut, overwrite:true, onComplete:completeSpin, onCompleteParams:[c]});
        
    }

    function completeSpin(c){
        playSound('soundStop');
        slotData.spinComplete++;
        
        if(slotData.spinComplete == slotSettings.column){
            stopSoundLoop('soundSpin');
            window.TweenMax.to(window.linesContainer, .5, {overwrite:true, onComplete:function(){
                checkBetLines();
                placeWinAnimateSlots();
                checkWinAmount();
                displayWinSlots();
                
                slotData.spin = false;
                checkEndGame();
            }});
        }
    }

    /*!
    * 
    * CHECK BET LINES - This is the function that runs to check bet lines
    * 
    */
    function checkBetLines(){
        var slots = [];
        slotData.resultArray = [];
        
        //store obj for all slots
        for(var c = 0; c<slotSettings.column; c++){
            slotData.resultArray[c] = [];
            for(var r = 0; r<slotSettings.row; r++){
                var thisIndex = slotData.array[c].obj.length-(r+1);
                var thisObj = slotData.array[c].obj[thisIndex];
                slotData.resultArray[c][r] = thisObj;		
            }
        }
        
        //match slots
        for(var n = 0; n<lines_arr.length; n++){
            var storeLineSlot = [];
            if(n <= slotData.lines){
                for(var l = 0; l<lines_arr[n].slots.length; l++){
                    var thisColumn = lines_arr[n].slots[l].c;
                    var thisRow = lines_arr[n].slots[l].r;
                    var currentIndex = slotData.resultArray[thisColumn][thisRow].slotIndex;	
                    storeLineSlot.push(currentIndex);
                }
                
                var matchSlotArray = [];
                var matchSlot = {startIndex:0, index:[], lastIndex:null, count:0, reset:false}; //type 0,1
                var matchManySlot = {startIndex:0, index:[], lastIndex:null, count:0, reset:false, push:false}; //type 2
                    
                for(var s=0; s<storeLineSlot.length; s++){
                    var currentIndex = storeLineSlot[s];
                    
                    //for single match
                    var matchResultCon = findSlotMatch(currentIndex);
                    matchSlot.reset = false;
                    
                    if(matchResultCon == 0 && matchSlot.index.length == 0){
                        //first index
                        matchSlot.index.push(currentIndex);
                        matchSlot.lastIndex = currentIndex;
                    }else if(matchResultCon == 0 && currentIndex == matchSlot.lastIndex){
                        //same index
                        matchSlot.index.push(currentIndex);
                        matchSlot.lastIndex = currentIndex;
                    }else if(matchResultCon == 1){
                        //wild index
                        matchSlot.index.push(currentIndex);
                    }else{
                        matchSlot.reset = true;
                    }
                    
                    if(s == storeLineSlot.length-1){
                        matchSlot.reset = true;	
                    }
                    
                    if(matchSlot.reset){
                        //store and reset
                        var currentPay = findSlotMatchPay(matchSlot.index);
                        if(currentPay > 0){
                            matchSlotArray.push({index:matchSlot.index, total:matchSlot.index.length, start:matchSlot.startIndex, pay:currentPay});	
                        }
                        
                        //first index
                        matchSlot.index = [];
                        matchSlot.index.push(currentIndex);
                        matchSlot.lastIndex = currentIndex;
                        matchSlot.startIndex = s;	
                    }
                    
                    //for many match
                    var matchResultManyCon = null;
                    matchManySlot.reset = false;
                    matchManySlot.push = false;
                    
                    if(matchManySlot.lastIndex == null){
                        matchManySlot.lastIndex = currentIndex;
                        matchManySlot.index.push(matchManySlot.lastIndex);
                        
                    }else if(matchManySlot.lastIndex != null){
                        matchManySlot.index.push(currentIndex);
                        matchResultManyCon = findManySlotMatch(matchManySlot.index);	
                    
                        if(matchResultManyCon == -1){
                            //reset if no exist
                            matchManySlot.reset = true;
                            matchManySlot.push = true;
                        }else if(matchResultManyCon == 1){
                            //push
                            matchManySlot.push = true;	
                        }
                        
                        if(s == storeLineSlot.length-1){
                            //reset when is last
                            matchManySlot.reset = true;	
                            matchManySlot.push = true;
                        }
                    }
                    
                    matchManySlot.lastIndex = currentIndex;
                    
                    if(matchManySlot.push){
                        //store and reset
                        var currentPay = findSlotMatchPay(matchManySlot.index);
                        if(currentPay > 0){
                            matchSlotArray.push({index:matchManySlot.index, total:matchManySlot.index.length, start:matchManySlot.startIndex, pay:currentPay});	
                        }
                    }
                        
                    if(matchManySlot.reset){
                        //first index
                        matchManySlot.index = [];
                        matchManySlot.index.push(matchManySlot.lastIndex);
                        matchManySlot.startIndex = s;
                    }
                }
                
                //find final match
                sortOnObject(matchSlotArray, 'pay', true);
                for(var l = 0; l<matchSlotArray.length; l++){
                    if(matchSlotArray[l].pay > 0){
                        slotData.linesArray.push({id:n, index:matchSlotArray[l].index, total:matchSlotArray[l].total, start:matchSlotArray[l].start, pay:matchSlotArray[l].pay});
                        l = lines_arr[n].slots.length;
                    }
                }
            }
        }
        
    }

    /*!
    * 
    * PLACE WIN ANIMATE SLOTS - This is the function that runs to place win animation
    * 
    */
    function placeWinAnimateSlots(){
        slotData.winSlotArray = [];
        
        for(var c = 0; c<slotSettings.column; c++){
            slotData.winSlotArray[c] = [];
            for(var r = 0; r<slotSettings.row; r++){
                slotData.winSlotArray[c][r] = null;		
            }
        }
        
        for(var n=0; n<slotData.linesArray.length; n++){
            var linesID = slotData.linesArray[n].id;
            var linesStart = slotData.linesArray[n].start;
            var linesEnd = linesStart + slotData.linesArray[n].total;
            
            for(var w=linesStart; w<linesEnd; w++){
                var thisColumn = lines_arr[linesID].slots[w].c;
                var thisRow = lines_arr[linesID].slots[w].r;
                
                if(slotData.winSlotArray[thisColumn][thisRow] == null){
                    var currentSlotObj = slotData.resultArray[thisColumn][thisRow];
                    
                    var newAnimateObj = slots['animate'+currentSlotObj.slotIndex].clone();
                    newAnimateObj.x = currentSlotObj.x;
                    newAnimateObj.y = currentSlotObj.y;
                    newAnimateObj.gotoAndPlay('animate');
                    
                    slotData.winSlotArray[thisColumn][thisRow] = newAnimateObj;
                    window.slotWinContainer.addChild(newAnimateObj);
                }	
            }
        }
    }

    /*!
    * 
    * CHECK WIN AMOUNT - This is the function that runs to check win amount
    * 
    */
    function checkWinAmount(){
        playerData.win = 0;
        /* for(var n=0; n<slotData.linesArray.length; n++){
            var linesPay = slotData.linesArray[n].pay;
            playerData.win += linesPay * playerData.amount;
        } */
        for(var i in paytable_arr){
            if(paytable_arr[i].index.join() === gameData.resultArray.join()){
                playerData.win=paytable_arr[i].pay;
            }

        }
        
        if(typeof window.memberData == 'undefined'){
            playerData.credit -= playerData.bet;
        }
        playerData.bet = 0;
        playerData.credit += playerData.win;
        playerData.creditSum = playerData.credit;
        playerData.totalWin += playerData.win
        
        //memberpayment
        if(typeof window.memberData != 'undefined' && window.memberSettings.enableMembership){
            window.updateUserPoint();
        }
        
        if(playerData.win > 0){
            playSound('soundWin');
        }
        updateGameStat();
    }

    /*!
    * 
    * DISPLAY WIN SLOTS - This is the function that runs to play slots win animation
    * 
    */
    function displayWinSlots(){
        slotData.lineHighlight = -1;
        highlightWinSlots();
    }

    function resetHighlightWinSlots(){
        window.TweenMax.killTweensOf(window.linesContainer);
        
        //reset
        for(var c = 0; c<slotSettings.column; c++){
            for(var r = 0; r<slotSettings.row; r++){
                if(slotData.resultArray.length > 0){
                    slotData.resultArray[c][r].visible = true;
                }
                
                if(slotData.winSlotArray.length > 0){
                    if(slotData.winSlotArray[c][r] != null){
                        slotData.winSlotArray[c][r].gotoAndPlay('static');
                        slotData.winSlotArray[c][r].visible = false;
                    }
                }
                slotData.winFrameArray[c][r].visible = false;	
            }
        }
/*         console.log("length : "+lines_arr.length);
        for(var n = 0; n<lines_arr.length; n++){
            lines['line'+n].visible = false;	
        } */
    }

    function highlightWinSlots(){
        resetHighlightWinSlots();
        
        //highlight
        for(var n=0; n<slotData.linesArray.length; n++){
            var linesID = slotData.linesArray[n].id;
            var linesStart = slotData.linesArray[n].start;
            var linesEnd = linesStart + slotData.linesArray[n].total;
            
            for(var w=linesStart; w<linesEnd; w++){
                var thisColumn = lines_arr[linesID].slots[w].c;
                var thisRow = lines_arr[linesID].slots[w].r;
                
                if(slotData.lineHighlight == -1 || slotData.lineHighlight == n){
                    if(slotData.winSlotArray[thisColumn][thisRow] != null){
                        slotData.resultArray[thisColumn][thisRow].visible = false;
                        
                        slotData.winSlotArray[thisColumn][thisRow].gotoAndPlay('animate');
                        slotData.winSlotArray[thisColumn][thisRow].visible = true;
                        slotData.winFrameArray[thisColumn][thisRow].visible = true;
                        lines['line'+linesID].visible = true;
                    }
                }
            }	
        }
        
        window.TweenMax.to(window.linesContainer, lineSettings.winTimer, {overwrite:true, onComplete:function(){
            slotData.lineHighlight++
            slotData.lineHighlight = slotData.lineHighlight > slotData.linesArray.length-1 ? -1 : slotData.lineHighlight;
            highlightWinSlots();
        }});
    }

    /*!
    * 
    * CHECK ENG GAME - This is the function that runs to check end game
    * 
    */
    function checkEndGame(){
        if(Number(formatCurrency(playerData.credit)) < Number(formatCurrency(betAmount_arr[0] * 1))){
            window.TweenMax.to(window.linesContainer, 1, {overwrite:true, onComplete:function(){
                goPage('result');
            }});
        }
    }

    /*!
    * 
    * MATCH SLOTS - This is the function that runs to match slots
    * 
    */
    function findSlotMatchPay(index){
        var pay = 0;
        
        for(var n = 0; n<paytable_arr.length; n++){		
            
            var temp_arr = []
            for(var t = 0; t<paytable_arr[n].index.length; t++){
                temp_arr.push(paytable_arr[n].index[t]);
            }
            
            var wildTotal = 0;
            for(var t = 0; t<index.length; t++){
                var foundIndex = temp_arr.indexOf(index[t]);
                var foundWildIndex = wild_arr.indexOf(index[t]);
                
                if(foundIndex != -1){
                    temp_arr.splice(foundIndex, 1);	
                }else if(foundWildIndex != -1){
                    wildTotal++;
                }
            }
            
            if(temp_arr.length-wildTotal == 0 && index.length == paytable_arr[n].index.length){
                pay = paytable_arr[n].pay;
            }
        }
        
        return pay;
    }

    function findSlotMatch(index, type){
        var matchResultCon = -1;
        
        for(var n = 0; n<paytable_arr.length; n++){
            if(window.type == 2){
                if(paytable_arr[n].index.indexOf(index) != -1){
                    matchResultCon = window.type;
                    n = paytable_arr.length;
                }
            }else if(paytable_arr[n].index.indexOf(index) != -1){
                matchResultCon = 0;
                n = paytable_arr.length;
            }
        }
        
        if(matchResultCon == -1){
            if(wild_arr.indexOf(index) != -1){
                matchResultCon = 1;
            }
        }
        
        return matchResultCon;
    }

    function findManySlotMatch(indexArray){
        var matchResultCon = -1;
        
        for(var n = 0; n<paytable_arr.length; n++){
            var existIndex = 0;
            for(var i=0; i<indexArray.length; i++){
                if(paytable_arr[n].index.indexOf(indexArray[i]) != -1){
                    existIndex++;
                }else if(wild_arr.indexOf(indexArray[i]) != -1){
                    existIndex++;
                }
            }
            
            if(existIndex == paytable_arr[n].index.length){
                matchResultCon = 1;
            }else if(existIndex == indexArray.length){
                matchResultCon = 0;	
            }
        }
        
        return matchResultCon;	
    }

    /*!
    * 
    * UPDATE GAME - This is the function that runs to loop game update
    * 
    */
    function updateGame(){
        for(var c = 0; c<slotSettings.column; c++){
            for(var s = 0; s<slotData.array[c].obj.length; s++){
                var thisObj = slotData.array[c].obj[s];
                thisObj.y = thisObj.oriY + slotData.array[c].y;
            }	
        }
    }

    /*!
    * 
    * UPDATE GAME STATS - This is the function that runs to update game stats
    * 
    */
   
    function updateGameStat(){
        window.linesTxt.text = slotData.lines+1;
        window.betTxt.text = formatCurrency(betAmount_arr[slotData.amount]);
        
        var finalAmount = (betAmount_arr[slotData.amount] * (slotData.lines+1));
        window.maxBetTxt.text = maxBetText.replace('[NUMBER]', formatCurrency(finalAmount));
        
        if(playerData.win > 0){
            window.spinTxt.text = winBetText.replace('[NUMBER]', formatCurrency(playerData.win));
        }else{
            window.spinTxt.text = '';
        }
        window.creditTxt.text = creditText.replace('[NUMBER]', valueJackpot);
    }

    function startCreditAlert(){
        slotData.creditAlert = 1;
        animateCreditAlert()
    }

    function animateCreditAlert(){
        slotData.creditAlert--;
        window.itemCreditAlert.alpha = 0;
        window.creditTxt.alpha = 1;
        
        var tweenSpeed = .2;
        window.TweenMax.to(window.creditTxt, tweenSpeed, {alpha:.5, overwrite:true, onComplete:function(){
            window.TweenMax.to(window.creditTxt, tweenSpeed, {alpha:1, overwrite:true, onComplete:function(){
                if(slotData.creditAlert >= 0){
                    animateCreditAlert()
                }
            }});
        }});
        
        window.TweenMax.to(window.itemCreditAlert, tweenSpeed, {alpha:1, overwrite:true, onComplete:function(){
            window.TweenMax.to(window.itemCreditAlert, tweenSpeed, {alpha:0, overwrite:true, onComplete:function(){
                
            }});
        }});
    }

    /*!
    * 
    * PERCENTAGE - This is the function that runs to create result percentage
    * 
    */
    function createPercentage(){
        gameData.percentageArray = [];
        gameData.slotArray = [];
        
        for(var n=0; n<slots_arr.length; n++){
            if(wild_arr.indexOf(n) == -1){
                gameData.slotArray.push(n);
            }
        }
        
        for(var n=0; n<paytable_arr.length; n++){
            paytable_arr[n].id = n;
            
            if(!isNaN(paytable_arr[n].percent)){
                if(paytable_arr[n].percent > 0){
                    for(var p=0; p<paytable_arr[n].percent; p++){
                        gameData.percentageArray.push(n);
                    }
                }
            }
        }
        
        for(var n=gameData.percentageArray.length; n<overallPercent; n++){
            gameData.percentageArray.push(-1);
        }
    }

    function getResultOnPercent(){
        shuffle(gameData.percentageArray);
        
        var slotsResult = fillSlots(true);
        var paytableIndex = paytable_arr.findIndex(x => x.id === gameData.percentageArray[0]);
        
        if(paytableIndex != -1){
            var randomLines = Math.floor(Math.random()*lines_arr.length);

            //fill slots
            var slotResultIndex = 0;
            var startLineIndex = Math.round(Math.random()*(lines_arr[randomLines].slots.length - paytable_arr[paytableIndex].index.length));
            var startPayIndex = 0;

            for(var r = 0; r<slotSettings.row; r++){
                for(var c = 0; c<slotSettings.column; c++){
                    for(var n = startLineIndex; n<lines_arr[randomLines].slots.length; n++){
                        if(startPayIndex < paytable_arr[paytableIndex].index.length){
                            if(lines_arr[randomLines].slots[n].c == c && lines_arr[randomLines].slots[n].r == r){
                                if(wild_arr.indexOf(slotsResult[slotResultIndex]) == -1){
                                    slotsResult[slotResultIndex] = paytable_arr[paytableIndex].index[startPayIndex];
                                }
                                startPayIndex++;
                            }
                        }
                    }
                    slotResultIndex++;
                }
            }
        }else{
            slotsResult = fillSlots(false);
        }
        
        return slotsResult;
    }

    /*!
    * 
    * OPTIONS - This is the function that runs to toggle options
    * 
    */

    function toggleOption(){
        if(window.optionsContainer.visible){
            window.optionsContainer.visible = false;
        }else{
            window.optionsContainer.visible = true;
        }
    }

    /*!
    * 
    * OPTIONS - This is the function that runs to mute and fullscreen
    * 
    */
    function toggleGameMute(con){
        buttonSoundOff.visible = false;
        buttonSoundOn.visible = false;
        toggleMute(con);
        if(con){
            buttonSoundOn.visible = true;
        }else{
            buttonSoundOff.visible = true;	
        }
    }

    function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
        document.exitFullscreen();
        } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        }
    }
    }


    /*!
    * 
    * SHARE - This is the function that runs to open share url
    * 
    */
    function share(action){
        
        var loc = window.location.href;
        loc = loc.substring(0, loc.lastIndexOf("/") + 1);
        
        var title = '';
        var text = '';
        
        title = shareTitle.replace("[SCORE]", addCommas(playerData.totalWin));
        text = shareMessage.replace("[SCORE]", addCommas(playerData.totalWin));
        var shareurl = '';
        
        if( action == 'twitter' ) {
            shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
        }else if( action == 'facebook' ){
            shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
        }else if( action == 'whatsapp' ){
            shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
        }
        
        window.open(shareurl);
    }

    /*!
    * 
    * window.LOADER RESIZE - This is the function that runs to centeralised window.loader when resize
    * 
    */
    function resizeLoaderFunc(){
        stageWidth=window.$(window).width();
        stageHeight=window.$(window).height();
        
        window.$(mainLoaderElement.current).css('left', checkContentWidth(window.$(mainLoaderElement.current)));
        window.$(mainLoaderElement.current).css('top', checkContentHeight(window.$(mainLoaderElement.current)));
    }

    /*!
    * 
    * BROWSER DETECT - This is the function that runs for browser and feature detection
    * 
    */
    var browserSupport=false;
    var isTablet;
    function checkBrowser(){
        isTablet = (/ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
        window.deviceVer=getDeviceVer();
        
        var canvasEl = document.createElement('canvas');
        if(canvasEl.getContext){ 
        browserSupport=true;
        }
        
        if(browserSupport){
            if(!isLoaded){
                isLoaded=true;
                
                //memberpayment
                if(typeof window.memberData != 'undefined' && window.memberSettings.enableMembership){
                    window.initGameSettings();
                }else{
                    initPreload();
                }
            }
        }else{
            //browser not support
            window.$(notSupportHolderElement).show();
        }
    }

    ////////////////////////////////////////////////////////////
    // CANVAS window.LOADER
    ////////////////////////////////////////////////////////////

    /*!
    * 
    * START CANVAS PREwindow.LOADER - This is the function that runs to preload canvas asserts
    * 
    */
    function initPreload(){
        toggleLoader(true);
        
        checkMobileEvent();
        
        window.$(window).resize(function(){
            resizeGameFunc();
        });
        resizeGameFunc();
        
        window.loader = new window.createjs.LoadQueue(false);
        window.manifest=[
                {src:'assets/logo.png', id:'logo'},
                {src:'assets/button_start.png', id:'buttonStart'},
                
                //multi-line slots
                //{src:'assets/multiple/item_machine.png', id:'itemMachine'},
                //{src:'assets/multiple/frame_Spritesheet5x1.png', id:'itemSlotFrame'},
                //{src:'assets/multiple/item_shadow.png', id:'itemShadow'},
                //{src:'assets/multiple/item_info.png', id:'itemInfo'},
            
                //classic three line slots
                {src:'assets/classic/item_machine.png', id:'itemMachine'},
                {src:'assets/classic/frame_Spritesheet5x1.png', id:'itemSlotFrame'},
                {src:'assets/classic/item_shadow.png', id:'itemShadow'},
                {src:'assets/classic/item_info.png', id:'itemInfo'},
            
                {src:'assets/button_close.png', id:'buttonClose'},
                {src:'assets/button_info.png', id:'buttonInfo'},
                {src:'assets/button_lines.png', id:'buttonLines'},
                {src:'assets/button_bet.png', id:'buttonBet'},
                {src:'assets/button_maxbet.png', id:'buttonMaxBet'},
                {src:'assets/button_spin.png', id:'buttonSpin'},
                {src:'assets/item_display.png', id:'itemDisplay'},
                {src:'assets/handle_Spritesheet5x1.png', id:'itemHandle'},
                {src:'assets/credit_Spritesheet3x2.png', id:'itemCreditAnimate'},
                
                {src:'assets/line_display_off.png', id:'itemLineDisplayOff'},
                {src:'assets/line_display_on.png', id:'itemLineDisplayOn'},
                
                {src:'assets/item_credit.png', id:'itemCredit'},
                {src:'assets/item_credit_alert.png', id:'itemCreditAlert'},
                
                {src:'assets/button_confirm.png', id:'buttonConfirm'},
                {src:'assets/button_cancel.png', id:'buttonCancel'},
                {src:'assets/item_exit.png', id:'itemExit'},
                
                {src:'assets/button_continue.png', id:'buttonContinue'},
                {src:'assets/item_result.png', id:'itemResult'},
                {src:'assets/button_facebook.png', id:'buttonFacebook'},
                {src:'assets/button_twitter.png', id:'buttonTwitter'},
                {src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
                {src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
                {src:'assets/button_sound_on.png', id:'buttonSoundOn'},
                {src:'assets/button_sound_off.png', id:'buttonSoundOff'},
                {src:'assets/button_exit.png', id:'buttonExit'},
                {src:'assets/button_setting.png', id:'buttonSettings'}];

        //memberpayment
        if(typeof window.memberData != 'undefined' && window.memberSettings.enableMembership){
            window.addMemberRewardAssets();
        }
                
        for(var n = 0; n<slots_arr.length; n++){
            window.manifest.push({src:slots_arr[n].static, id:'slot'+n});
            window.manifest.push({src:slots_arr[n].animate, id:'slotAnimate'+n});
        }
        
        if ( typeof window.addScoreboardAssets == 'function' ) { 
            window.addScoreboardAssets();
        }
        
        soundOn = true;
        if(window.$.browser.mobile || isTablet){
            if(!enableMobileSound){
                soundOn=false;
            }
        }
        
       if(soundOn){
            window.manifest.push({src:'assets/sounds/click.ogg', id:'soundClick',type:window.createjs.Types.SOUND});
            window.manifest.push({src:'assets/sounds/result.ogg', id:'soundResult',type:window.createjs.Types.SOUND});
            window.manifest.push({src:'assets/sounds/puller.ogg', id:'soundPuller',type:window.createjs.Types.SOUND});
            window.manifest.push({src:'assets/sounds/stop.ogg', id:'soundStop',type:window.createjs.Types.SOUND});
            window.manifest.push({src:'assets/sounds/spin.ogg', id:'soundSpin',type:window.createjs.Types.SOUND});
            window.manifest.push({src:'assets/sounds/win.ogg', id:'soundWin',type:window.createjs.Types.SOUND});
            window.manifest.push({src:'assets/sounds/alert.ogg', id:'soundAlert',type:window.createjs.Types.SOUND});
            
            window.createjs.Sound.removeAllSounds();
            window.createjs.Sound.alternateExtensions = ["mp3"];
            window.loader.installPlugin(window.createjs.Sound);
        }
        
        
        window.loader.addEventListener("complete", handleComplete);
        window.loader.addEventListener("fileload", fileComplete);
        window.loader.on("progress", handleProgress,this);
        window.loader.loadManifest(window.manifest);
        
    }

    /*!
    * 
    * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
    * 
    */
    function fileComplete(evt) {
        var item = evt.item;
        //
    }



    /*!
    * 
    * CANVAS PREwindow.LOADER UPDATE - This is the function that runs to update preloder progress
    * 
    */
    function handleProgress() {
        window.$(mainLoaderSpanElement).html(Math.round(window.loader.progress/1*100)+'%');
    }

    /*!
    * 
    * CANVAS PREwindow.LOADER COMPLETE - This is the function that runs when prewindow.loader is complete
    * 
    */
    function handleComplete() {
        
        toggleLoader(false);
        
        initMain();
    };

    /*!
    * 
    * TOGGLE window.LOADER - This is the function that runs to display/hide window.loader
    * 
    */
    function toggleLoader(con){
        if(con){
            window.$(mainLoaderElement.current).show();
        }else{
            window.$(mainLoaderElement.current).hide();
        }
    }

    ////////////////////////////////////////////////////////////
    // MAIN
    ////////////////////////////////////////////////////////////
    var stageW=1280;
    var stageH=768;
    var contentW = 1024;
    var contentH = 650;

    /*!
    * 
    * START BUILD GAME - This is the function that runs build game
    * 
    */
    function initMain(){
        
        if(!window.$.browser.mobile || !isTablet){
            window.$(canvasHolderElement.current).show();	
        }
        
        initGameCanvas(stageW,stageH);
        buildGameCanvas();
        buildGameButton();
        if ( typeof window.buildScoreBoardCanvas == 'function' ) { 
            window.buildScoreBoardCanvas();
        }
        drawSlots();

        //memberpayment
        if(typeof window.memberData != 'undefined' && window.memberSettings.enableMembership){
            window.buildMemberRewardCanvas();
        }
        
        goPage('game');
        
        resizeCanvas();
    }

    var windowW=0;
    var windowH=0;
    var scalePercent=0;
    var offset = {x:0, y:0, left:0, top:0};

    /*!
    * 
    * GAME RESIZE - This is the function that runs to resize and centralize the game
    * 
    */
    function resizeGameFunc(){
        setTimeout(function() {
            window.$(mobileRotateElement.current).css('left', checkContentWidth(window.$(mobileRotateElement.current)));
            window.$(mobileRotateElement.current).css('top', checkContentHeight(window.$(mobileRotateElement.current)));
            
            windowW = window.innerWidth;
            windowH = window.innerHeight;
            
            scalePercent = windowW/contentW;
            if((contentH*scalePercent)>windowH){
                scalePercent = windowH/contentH;
            }
            
            scalePercent = scalePercent > 1 ? 1 : scalePercent;
            
            if(windowW > stageW && windowH > stageH){
                if(windowW > stageW){
                    scalePercent = windowW/stageW;
                    if((stageH*scalePercent)>windowH){
                        scalePercent = windowH/stageH;
                    }	
                }
            }
            
            var newCanvasW = ((stageW)*scalePercent);
            var newCanvasH = ((stageH)*scalePercent);
            
            offset.left = 0;
            offset.top = 0;
            
            if(newCanvasW > windowW){
                offset.left = -((newCanvasW) - windowW);
            }else{
                offset.left = windowW - (newCanvasW);
            }
            
            if(newCanvasH > windowH){
                offset.top = -((newCanvasH) - windowH);
            }else{
                offset.top = windowH - (newCanvasH);	
            }
            
            offset.x = 0;
            offset.y = 0;
            
            if(offset.left < 0){
                offset.x = Math.abs((offset.left/scalePercent)/2);
            }
            if(offset.top < 0){
                offset.y = Math.abs((offset.top/scalePercent)/2);
            }
            
            window.$('canvas').css('width', newCanvasW);
            window.$('canvas').css('height', newCanvasH);
            
            window.$('canvas').css('left', (offset.left/2));
            window.$('canvas').css('top', (offset.top/2));
            
            window.$(window).scrollTop(0);
            
            resizeCanvas();
            if ( typeof window.resizeScore == 'function' ) { 
                window.resizeScore();
            }

            //memberpayment
            if(typeof window.memberData != 'undefined' && window.memberSettings.enableMembership){
                window.resizeMemberReward();
            }
        }, 100);

    }

    ////////////////////////////////////////////////////////////
    // MOBILE
    ////////////////////////////////////////////////////////////
    var rotateInstruction = true; //enable rotate instruction for mobile
    var forPortrait=false; //for portrait only, set false for landscape mode

    /*!
    * 
    * START MOBILE CHECK - This is the function that runs for mobile event
    * 
    */
    function checkMobileEvent(){
        if(window.$.browser.mobile || isTablet){
            if(!rotateInstruction){
                window.$(canvasHolderElement.current).show();
                window.$(rotateHolderElement).hide();
                return;	
            }
            
            window.$( window ).off('orientationchange').on( "orientationchange", function( event ) {
                window.$(canvasHolderElement.current).hide();
                window.$(rotateHolderElement).hide();
                
                setTimeout(function() {
                    checkMobileOrientation();
                }, 1000);
            });
            checkMobileOrientation();
        }
    }

    /*!
    * 
    * MOBILE ORIENTATION CHECK - This is the function that runs to check mobile orientation
    * 
    */
    function checkMobileOrientation() {
        var o = window.orientation;
        var isLandscape=false;
        
        if(window.innerWidth>window.innerHeight){
            isLandscape=true;
        }
        
        var display = false;
        if(!isLandscape){
            //Portrait
            if(forPortrait){
                display=true;
            }
        } else {
            //Landscape
            if(!forPortrait){
                display=true;
            }
        }
        
        if(!display){
            toggleRotate(true);
        }else{
            toggleRotate(false);
            window.$(canvasHolderElement.current).show();
        }
    }

    /*!
    * 
    * TOGGLE ROTATE MESSAGE - This is the function that runs to display/hide rotate instruction
    * 
    */
    function toggleRotate(con){
        if(con){
            window.$(rotateHolderElement).fadeIn();
        }else{
            window.$(rotateHolderElement).fadeOut();		
        }
        
        resizeGameFunc();
    }

    // Place any jQuery/helper plugins in here.
    function checkContentHeight(target){
        var stageHeight=window.$( window ).height();
        var newHeight = (stageHeight/2)-(target.height()/2);
        return newHeight;
    }

    function checkContentWidth(target){
        var stageWidth=window.$( window ).width();
        var newWidth = (stageWidth/2)-(target.width()/2);
        return newWidth;
    }

    function getDeviceVer() {
        var ua = navigator.userAgent;
        var uaindex;
        
        // determine OS
        if ( ua.match(/(iPad|iPhone|iPod touch)/) ){
            window.userOS = 'iOS';
            uaindex = ua.indexOf( 'OS ' );
        }else if ( ua.match(/Android/) ){
            window.userOS = 'Android';
            uaindex = ua.indexOf( 'Android ' );
        }else{
            window.userOS = 'unknown';
        }
        
        // determine version
        if ( window.userOS === 'iOS' && uaindex > -1 ){
            window.userOSver = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
        }else if ( window.userOS === 'Android'  &&  uaindex > -1 ){
            window.userOSver = ua.substr( uaindex + 8, 3 );
        }else{
            window.userOSver = 'unknown';
        }
        return Number(window.userOSver)
    }

    function shuffle(array) {
        var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;
        
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        
        return array;
    }

    function randomBoolean(){
        return Math.random() < 0.5;
    }

    function sortOnObject(array, object, rev) {
        if(rev){
            array.sort(function(a, b){
                var a1= a[object], b1= b[object];
                if(a1== b1) return 0;
                return a1< b1? 1: -1;
            });
        }else{
            array.sort(function(a, b){
                var a1= a[object], b1= b[object];
                if(a1== b1) return 0;
                return a1> b1? 1: -1;
            });
        }
        return array;
    }

    function randomIntFromInterval(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function isEven(num){
        // if(num % 2 == 0){return true;}else{return false;} //<–old
        return !(num%2);//shorter
        // return !(num & 1);//seems the fastest one
    }

    function addCommas(nStr) {
        nStr += '';
        window.x = nStr.split('.');
        window.x1 = window.x[0];
        window.x2 = window.x.length > 1 ? '.' + window.x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(window.x1)) {
            window.x1 = window.x1.replace(rgx, '$1' + ',' + '$2');
        }
        return window.x1 + window.x2;
    }

    function setDirection(obj, toObj) {
        var radiance = 180/Math.PI;
        var walkdirection = -(Math.atan2(toObj.x-obj.x, toObj.y-obj.y))*radiance;
        obj.rotation = walkdirection+180;
    }

    function formatCurrency(total) {
        var neg = false;
        if(total < 0) {
            neg = true;
            total = Math.abs(total);
        }
        return (neg ? "-" : '') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1,").toString();
    }

    function unique(list) {
        var result = [];
        window.$.each(list, function(i, e) {
            if (window.$.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }

    ////////////////////////////////////////////////////////////
    // SETTINGS
    ////////////////////////////////////////////////////////////

    var creditAmount = 30; //game start credit

    //bet amount array
    var betAmount_arr = [
                            0.05,
                            0.10,
                            0.50
                        ];
                        
    var layoutPos = {
                        creditY:160,  //credit postion y
                        buttonY:610  //machine button postion y
                    };

    var creditText = "Jackpot: [NUMBER] EGLD"; //credit text display
    var maxBetText = "BET: [NUMBER]"; //max bet text display
    var winBetText = "WIN: [NUMBER]"; //win text display

    //slot settings
    var slotSettings = {
                            width:260, //slot width
                            height:260, //slot height
                            row:1, //total row
                            column:3, //total column
                            offsetX:0, //offset position x
                            offsetY:-20 //offset position y
                        };


    //slots array			
    var slots_arr = [
                        {static:"assets/classic/slot_01.png", animate:"assets/classic/slot_01_Spritesheet4x3.png"},
                        {static:"assets/classic/slot_02.png", animate:"assets/classic/slot_02_Spritesheet4x3.png"},
                        {static:"assets/classic/slot_03.png", animate:"assets/classic/slot_03_Spritesheet4x3.png"},
                        {static:"assets/classic/slot_04.png", animate:"assets/classic/slot_04_Spritesheet4x3.png"},
                        {static:"assets/classic/slot_05.png", animate:"assets/classic/slot_05_Spritesheet4x3.png"}
                    ];


    //pay table array
    var enablePercentage = false; //option to have result base on percentage
    var overallPercent = 200;
    var paytable_arr = [
                        {index:[0,0,0], pay:0.50, percent:0, isJackpot:false},
                        {index:[1,1,1], pay:0.70, percent:0, isJackpot:false},
                        {index:[2,2,2], pay:0.10, percent:0, isJackpot:false},
                        {index:[3,3,3], pay:0.20, percent:0, isJackpot:false},
                        {index:[4,4,4], pay:0, percent:0, isJackpot:true},
                    ];

    //wild array
    var wild_arr = [];


    //line settings
    var lineSettings = {
                            display:false, //display line
                            stroke:5, //stroke size
                            shadowY:4, //shadow position y
                            timer:2, //display timer
                            winTimer:2, //win display timer
                            sign:true, //display sign
                            number:true //display number
                            
                        };

    //lines array
    var lines_arr = [
                        {
                            color:"#E02828",
                            shadow:"#8C1414",
                            sign:[],
                            path:[],
                            slots:[{c:0,r:0},{c:1,r:0},{c:2,r:0}]
                        }
                    ];


    //spin settings	
    var spinSettings = {
                            slots:15, //total row of slots to spin
                            startSpeed:1, //start speed
                            delay:0.2, //delay for each column
                            spinningSpeed:1, //spinning speed
                            increaseSpeed:0.3, //increase speed for each column
                            stopSpeed:0.3, //stop speed
                            handle:true //show pull handle
                        };

    var exitMessage = "ARE YOUR SURE YOU\nWANT TO QUIT THE GAME?"; //exit game message

    var resultTitleText = "YOU HAVE WON"; //result title text
    var resultScoreText = "[NUMBER]"; //result score text



    //Social share, [SCORE] will replace with game score
    var shareEnable = true; //toggle share
    var shareText = "SHARE YOUR SCORE"; //social share message
    var shareTitle = "Highscore on Slot Machine Game is window.$[SCORE].";//social share score title
    var shareMessage = "window.$[SCORE] is mine new highscore on Slot Machine Game! Play it now!"; //social share score message

    ////////////////////////////////////////////////////////////
    // SOUND
    ////////////////////////////////////////////////////////////
    var enableMobileSound = true;
    var soundOn;

    function playSound(target, loop){
        if(soundOn){
            var isLoop;
            if(loop){
                isLoop = -1;
                window.createjs.Sound.stop();
                var props = new window.createjs.PlayPropsConfig().set({interrupt: window.createjs.Sound.INTERRUPT_NONE, loop: isLoop})
                window.musicLoop = window.createjs.Sound.play(target, props);
                if (window.musicLoop == null || window.musicLoop.playState == window.createjs.Sound.PLAY_FAILED) {
                    return;
                }else{
                    window.musicLoop.removeAllEventListeners();
                    window.musicLoop.addEventListener ("complete", function(musicLoop) {
                        
                    });
                }
            }else{
                isLoop = 0;
                window.createjs.Sound.play(target);
            }
        }
    }

    function stopSound(){
        window.createjs.Sound.stop();
    }


    /*!
    * 
    * PLAY MUSIC - This is the function that runs to play and stop music
    * 
    */
    window.$.sound = {};
    function playSoundLoop(sound){
        if(soundOn){
            if(window.$.sound[sound]==null){
                window.$.sound[sound] = window.createjs.Sound.play(sound);
                window.$.sound[sound].removeAllEventListeners();
                window.$.sound[sound].addEventListener ("complete", function() {
                    window.$.sound[sound].play();
                });
            }
        }
    }

    function stopSoundLoop(sound){
        if(soundOn){
            if(window.$.sound[sound]!=null){
                window.$.sound[sound].stop();
                window.$.sound[sound]=null;
            }
        }
    }

    function setSoundVolume(sound, vol){
        if(soundOn){
            if(window.$.sound[sound]!=null){
                window.$.sound[sound].volume = vol;
            }
        }
    }

    /*!
    * 
    * TOGGLE MUTE - This is the function that runs to toggle mute
    * 
    */
    function toggleMute(con){
        window.createjs.Sound.muted = con;	
    }

    /*!
    Blockchain interfactions
    */

    const triggerSplinSlotAnimation = () => {
        axios.get(getResult(network.apiAddress,transactionStatus.transactions[0].hash))
        .then(function(response){
            let result = Buffer.from(response.data.logs.events[0].data,"base64").toString().split("@")[2];
            let possibleValues=[1,2,3,4];
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
            switch (result){
                case '01':
                    value=[0,0,0];
                    break;
                case '02':
                    value=[1,1,1];
                    break;
                case '03':
                    value=[2,2,2];
                    break;
                case '04':
                    value=[3,3,3];
                    break;
                case '05':
                    value=[4,4,4];
                    break;
            }
            const triggerEvent = new CustomEvent("spin", {
                detail : {"value":value},
                bubbles: true,
                cancelable: true,
                composed: false,
            });
            let mainElementHolder= document.getElementById("mainHolder");
            mainElementHolder.dispatchEvent(triggerEvent);
        })
    }

    const getJackpot=async ()=>{
        let abiRegistry = AbiRegistry.create(abiFile);
        let abi = new SmartContractAbi(abiRegistry, ["Slotmachine"]);

        let contract = new SmartContract({ address: new Address(contractAddressSlotMachine), abi: abi });
        const proxy = new ProxyNetworkProvider(network.apiAddress);

        const queryCurrentJackpot= new Query({
          address: new Address(contractAddressSlotMachine),
          func: new ContractFunction('jackpot'),
          args: []
        });
        
        let queryResponse=await proxy.queryContract(queryCurrentJackpot)
        let endpointDefinition = contract.getEndpoint("jackpot");
        let { firstValue }  = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);
        return(parseInt(firstValue.value,10)/(10**18));
    }

    const transactionStatus = transactionServices.useTrackTransactionStatus({
        transactionId: sessionId ?? null,
        onSuccess:triggerSplinSlotAnimation,
    });

    const queryParams = new URLSearchParams(window.location.search);
    const signSession = queryParams.get('signSession');

    if (signSession && sessionId != signSession) {
        setSessionId(signSession);
    }

    

    return(
        <>
            {transactionStatus.isPending && <Loading />}
            {showPopup && <PopupConnexion close={handleClosePopup}/>}
            {/* PERCENT window.LOADER START */}
            <div id="mainLoader" ref={mainLoaderElement}><img src="assets/loader.png" /><br/><span ref={mainLoaderSpanElement}>0</span></div>
            {/* PERCENT window.LOADER END */}
            
            {/* CONTENT START */}
            <div id="mainHolder">
            
                {/* BROWSER NOT SUPPORT START */}
                <div id="notSupportHolder" ref={notSupportHolderElement}>
                    <div class="notSupport">YOUR BROWSER ISN'T SUPPORTED.<br/>PLEASE UPDATE YOUR BROWSER IN ORDER TO RUN THE GAME</div>
                </div>
                {/* BROWSER NOT SUPPORT END */}
                
                {/* ROTATE INSTRUCTION START */}
                <div id="rotateHolder" ref={rotateHolderElement}>
                    <div class="mobileRotate" ref={mobileRotateElement}>
                        <div class="rotateDesc">
                            <div class="rotateImg"><img src="assets/rotate.png" /></div>
                            Rotate your device <br/>to landscape
                        </div>
                    </div>
                </div>
                {/* ROTATE INSTRUCTION END */}
                
                {/*!-- CANVAS START */}
                <div id="canvasHolder" ref={canvasHolderElement}>
                    <canvas ref={gameCanvasElement} id="gameCanvas" width="768" height="1024"></canvas>
                </div>
                {/* CANVAS END */}
                
            </div>
            {/* CONTENT END*/}
        </>
    )
}

export default SlotGame;