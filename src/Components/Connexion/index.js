import React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import {Container, Row, Col} from 'react-bootstrap';

import "./css/index.css";

import LogoMaiar from './assets/Logo_maiar.png'


export const PopupConnexion= (props) => {
  const {
    ExtensionLoginButton,
    WalletConnectLoginButton,
    WebWalletLoginButton
  } = DappUI;

  //window.alert(isLoggedIn);

  return (
    <>
    <div className="popup-connexion">
      
      <Container>
      <Row>
        <div onClick={props.handleClose} className='closeButton'>
          <p>Close</p>
          {/*<img src={swords} alt=''/>*/}
        </div>

        <div className='pupupTitle'>
        <h4>Login</h4>
        </div>
      </Row>


      <Row>

        <Col xs={12} sm={12} md={12} lg={4}>
            <div className='btn-light buttonPopup buttonPopup2 my-1'>
            <ExtensionLoginButton
              callbackRoute="/"
              buttonClassName="btn-light buttonPopup"
              redirectAfterLogin={true}
            >
                <>
                <img src={LogoMaiar} alt=''/>
                Web extension
                </>
            </ExtensionLoginButton>
            </div>

        </Col>

        <Col xs={12} sm={12} md={12} lg={4}>
            <div className='btn-light buttonPopup buttonPopup2 my-1'>
            <WebWalletLoginButton
              callbackRoute="/"
              buttonClassName="btn-light buttonPopup"
              redirectAfterLogin={true}
            >
                <>
                <img src={LogoMaiar} alt=''/>
                Web Wallet
                </>
            </WebWalletLoginButton>
            </div>

        </Col>

        <Col xs={12} sm={12} md={12} lg={4}>
                
                <div className='btn-light buttonPopup buttonPopup2 my-1'>
                <WalletConnectLoginButton
                  callbackRoute="/"
                  buttonClassName="btn-light buttonPopup"
                  redirectAfterLogin={true}
                >
                  <>
                    <img src={LogoMaiar} alt=''/>
                    Maiar Connect
                  </>
                </WalletConnectLoginButton>
                </div>
            
        </Col>

      </Row>
      <Row><p>pick a login method</p></Row>
      </Container>
      
    </div>
    <div className='backgroundPopup' onClick={props.close}></div>
    </>
  );
};

export default PopupConnexion;
