import "./css/index.css";
import redBetImg from "../../assets/red-bet.png";
import whiteBetImg from "../../assets/white-bet.png";
import blackBetImg from "../../assets/black-bet.png";
import blueBetImg from "../../assets/blue-bet.png";

function Token(props){
    let color="";
    switch (props.amount){

        case 0.05:
            color="white";
            break;
        case 0.1:
            color="red";
            break;
        case 0.15:
            color="blue";
            break;
        case 0.2:
            color="black";
            break;
    }
    return(
        <div className={"cdChip cdChipActive "+color}>
            {color==="red" && <><img src={redBetImg}/><span className="bet-amount-chip white-bet">{props.amount}</span></>}
            {color==="white" && <><img src={whiteBetImg}/><span className="bet-amount-chip black-bet">{props.amount}</span></>}
            {color==="black" && <><img src={blackBetImg}/><span className="bet-amount-chip white-bet">{props.amount}</span></>}
            {color==="blue" && <><img src={blueBetImg}/><span className="bet-amount-chip white-bet">{props.amount}</span></>}
        </div>
    )
}

export default Token;