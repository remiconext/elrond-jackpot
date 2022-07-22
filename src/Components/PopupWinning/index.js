import "./css/index.scss";

function PopupWinning(props){
    return(
        <>
        <div className={"winning-popup"}>
           <h2>Congratulations ! You won</h2>
           <div className="button-win" onClick={props.close}>Play Again</div>
           
        </div>
        <div className="winning-popup-bg"></div>
        </>
        
    )
}

export default PopupWinning;