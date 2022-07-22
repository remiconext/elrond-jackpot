import {useEffect, useRef} from "react";
import "./css/index.css";
import spinSound from '../../assets/mixkit-bike-wheel-spinning.mp3';
import ballSpinSound from '../../assets/roulette-ball.mp3';


function Wheel(props){
    const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]; 
    let audioWheel = useRef();
    let ballSound = useRef();


    useEffect(() => {
        audioWheel.current = new Audio(spinSound)
        audioWheel.current.loop=true;
        ballSound.current = new Audio (ballSpinSound);
        ballSound.current.loop=true;
        return () => {
            audioWheel.current.pause()
            ballSound.current.pause()
        }
    }, [])

    useEffect(() => {
        if(props.spin){
            audioWheel.current.play(); 
            ballSound.current.play();
        }else{
            audioWheel.current.pause();
            ballSound.current.pause();
        }
    })
    let wheelRef=useRef();
    let ballRef=useRef();
    useEffect(() => {
        if(props.spin){
            wheelRef.current.style='animation : wheelRotate 4s linear infinite;';
            ballRef.current.style='animation : ballRotate 1s linear infinite;';
        }else if (props.resultSpin!==undefined){
            function endAnimation(event){
                let style = document.createElement('style');
                style.type = 'text/css';
                style.innerText = '@keyframes ballStop {from {transform: rotate(0deg);}to{transform: rotate(3deg);}}';
                if (event.animationName==="ballRotate"){
                    let degree = numbers.indexOf(props.resultSpin) * (359 / 37);
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerText = '@keyframes ballStop {from {transform: rotate(0deg);}to{transform: rotate(-'+(360-degree)+'deg);}}';
                    document.head.appendChild(style);
                    ballRef.current.style="animation : ballStop 1s ease-out;animation-fill-mode: forwards;";
                    wheelRef.current.removeEventListener('animationiteration',endAnimation);
                    function endWheel(){
                        wheelRef.current.style="";
                        ballRef.current.style="transform: rotate(-"+(360-degree)+"deg)";
                        style.remove();
                        wheelRef.current.removeEventListener('animationiteration',endWheel);
                    }
                    wheelRef.current.addEventListener('animationiteration',endWheel);
                }
            }
            wheelRef.current.addEventListener('animationiteration',endAnimation);
        }
    },[props.spin])
    return(
        <div className="wheel" ref={wheelRef}>
            <div className="outerRim"></div>
            {numbers.map((nb,index)=>(

                <div id={"sect"+(index+1)} className="sect">
                    <span className={nb < 10 ? "single" : "double"}>{nb}</span>
                    <div className="block"></div>
                </div>
            ))}
            <div className="pocketsRim"></div>
            <div className="ballTrack" ref={ballRef} Style={"transform: rotate(-605.25deg);"}>
                <div className="ball"></div>
            </div>
            <div className="pockets"></div>
            <div className="cone"></div>
            <div className="turret"></div>
            <div className="turretHandle">
                <div className="thendOne"></div>
                <div className="thendTwo"></div>
            </div>
        </div>
    )
}

export default Wheel;