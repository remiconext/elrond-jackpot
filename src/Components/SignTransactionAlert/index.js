import "./css/index.scss";

function SignTransactionAlert(props){
    return(
        <>
        <div className={"sign-transaction-alert-popup"}>
           <h2>Please, sign the transaction to play</h2>
        </div>
        <div className="sign-transaction-alert-popup-bg"></div>
        </>
        
    )
}

export default SignTransactionAlert;