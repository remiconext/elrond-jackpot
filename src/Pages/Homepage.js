import {useState,useEffect} from 'react';
import headerLogo from "../images/header-logo.png";
import headingBorderEffect from "../images/heading-border-effect.png";
import borderEffect from "../images/border-effect.png";
import relatedGameImage1 from "../images/related-game-image-1.jpg";
import relatedGameImage2 from "../images/related-game-image-2.jpg";
import relatedGameImage3 from "../images/related-game-image-3.jpg";
import relatedGameImage4 from "../images/related-game-image-4.jpg";
import relatedGameImage5 from "../images/related-game-image-5.jpg";
import relatedGameImage6 from "../images/related-game-image-6.jpg";
import relatedGameImage7 from "../images/related-game-image-7.jpg";
import relatedGameImage8 from "../images/related-game-image-8.jpg";
import relatedGameImage9 from "../images/related-game-image-9.jpg";
import freeSpinImage from "../images/our-passion.png";
import country1 from "../images/country1.png";
import country2 from "../images/country2.png";
import country3 from "../images/country3.png";
import country4 from "../images/country4.png";
import country5 from "../images/country5.png";
import taunamentBorder from "../images/taunament-border.png";
import runningJackpot1 from "../images/running-jackpot-1.jpg";
import runningJackpot2 from "../images/running-jackpot-2.jpg";
import runningJackpot3 from "../images/running-jackpot-3.jpg";
import upcomingJackpot1 from "../images/upcomming-jackpot-1.jpg";
import upcomingJackpot2 from "../images/upcomming-jackpot-2.jpg";
import upcomingJackpot3 from "../images/upcomming-jackpot-3.jpg";
import faqBorder from "../images/faq-border.png";
import faqBorder2 from "../images/faq-border-2.png";
import paymentImage1 from "../images/payment/payment-image-1.jpg";
import paymentImage2 from "../images/payment/payment-image-2.jpg";
import paymentImage3 from "../images/payment/payment-image-3.jpg";
import paymentImage4 from "../images/payment/payment-image-4.jpg";
import paymentImage5 from "../images/payment/payment-image-5.jpg";
import { getTransaction } from '../apiEndpoints';
import {useGetNetworkConfig} from "@elrondnetwork/dapp-core";



import "../Design/font-awesome.min.css";
import "../font/flaticon.css";
import "../Design/bootstrap.min.css";
import "../Design/slick.css";
import "../Design/animate.min.css";
import "../Design/magnific-popup.css";
import "../Design/YouTubePopUp.css";
import "../Design/menu.css";
import "../Design/style.css";
import "../Design/responsive.css";

import PopupConnexion from "../Components/Connexion";

import {useGetLoginInfo, logout} from "@elrondnetwork/dapp-core";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";

import axios from 'axios';



function Homepage() {
	const { network } = useGetNetworkConfig();
	let contractAddressSlotMachine=process.env.REACT_APP_SMART_CONTRACT_SLOT_MACHINE;

	const {isLoggedIn}=useGetLoginInfo();
	const [showPopup,setShowPopup] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const [allTransactions, setAllTransactions] = useState([]);
	const [allWin, setAllWin] = useState([]);


	const handleConnect = () => {
		setShowPopup(true);
	}

	const handleClosePopup = () => {
		setShowPopup(false);
	}

	const handleLogout = () => {
		logout();
	}


	const getTransactions = () => {
		let allTransactionsFetch=[];
		let allWinsFetch=[];
		axios.get(getTransaction(network.apiAddress,contractAddressSlotMachine))
        .then(function(response){
			let i = 0;
			let j=0;
			response.data.map(data => {
				if(data.function==="bet" && i<15){
					if(data.results!=undefined){
						allWinsFetch.push({sender:data.sender,value:(parseInt(data.results[0].value,10)/(10**18))});
						i++;
					}
					if(j<15){
						allTransactionsFetch.push({hash:data.txHash,value:(parseInt(data.value,10)/(10**18))});
						j++;
					}
				}
			});
			setAllTransactions(allTransactionsFetch);
			setAllWin(allWinsFetch);
		});
	

	}

	// This will run one time after the component mounts
	useEffect(() => {
		getTransactions();
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

    return(
    <>
	{isLoading && <Loading />}
	{showPopup && !isLoggedIn && <PopupConnexion close={handleClosePopup}/>}
    {/* Header */}
	<section id="header">

		{/* NAV AREA CSS */}
		<nav id="nav-part" className="navbar header-nav other-nav custom_nav full_nav sticky-top navbar-expand-md hidden-main">
			<div className="container">


				<a className="navbar-brand" href="/"><img src={headerLogo} className="img-fluid logo-color" alt="logo"/></a>

				<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
					<span className="sr-only">Toggle navigation</span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
				</button>
				<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<div className="nav-res">
						<ul className="nav navbar-nav m-auto menu-inner tog-nav">
							<li><a href="#banner">Home</a></li>
							<li><a href="#control">Membership</a></li>
							<li><a href="#start">How to play ?</a></li>
							<li><a href="#jackpots">Statistics</a></li>
							<li><a href="#faq">FAQ</a></li>
							<li className="more-less"><i id="test" className="fa fa-align-right"></i>
								<i className="fa fa-times"></i>
							</li>

						</ul>
					</div>
					<ul className="login_menu navbar-right nav-sign">
						{!isLoggedIn ? <li className="login" onClick={handleConnect}>CONNECT WALLET</li> : <li className="login" onClick={handleLogout}>Logout</li>}
					</ul>
				</div>
			</div>
		</nav>
		{/* mobile menu */}		
        <nav id='cssmenu' className="hidden mobile">
            <div className="logo">
                <a href="index.html" className="logo">
                    <img src={headerLogo} className="img-responsive" alt="" />
                </a>
            </div>
            <div id="head-mobile"></div>
            <div className="button"><i className="more-less fa fa-align-right"></i></div>
            <ul>
                <li><a href="#banner" className="active">Home</a></li>
							<li><a href="about-us.html">About us</a></li>
							<li><a href="games.html">Games</a></li>
							<li><a href="tournaments.html">Tournaments</a></li>
							<li><a href="faq.html">FAQ</a></li>
							<li className="dropdown"><a href="" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Pages</a>
                    <ul className="dropdown-menu maindrop_menu">
                        <li><a href="contact-us.html">contact us</a></li>

                        <li><a href="404-page.html">404 page</a></li>
                    </ul>
                </li>
							
              
						<li className="login"><a href="#" className="btn-4 yellow-bg yellow-btn">Signup</a></li>
						<li className="login"><a href="#" className="btn-4 yellow-bg">Login</a></li>
					
            </ul>

        </nav>

		{/* End mobile menu */}
	</section>
	
	{/* Header End */}

	<section id="banner" className="banner-inner main_page">
		<div className="container">
			<div className="row">

				<div className="col-md-6 offset-md-6 banner-center">
					<div className="banner_text">

						<h1 className="title">Elrond Jackpot</h1>
						<h3>New Gambling Experience</h3>
						<p>Elrond Jackpot is a new gambling experience built on Elrond Network. Play our slot machines and try to win the EGLD Jackpot !</p>

						<Link to="slotmachine">
							<div className="casino-btn btn-4 yellow-btn">play now</div>
						</Link>
					</div>

				</div>
			</div>
		</div>
	</section>

	{/* Banner End */}

	{/* Counter */}

	{/*<section id="counter" className=" back-light">
		<div className="container">
			<div className="row conter-res yellow-bg text-center">
				<div className="col-md-5 counter-left text-center">
					<div>
						<h4>Today you can Win upto</h4>
					</div>
				</div>
				<div className="col-md-7 col-12 text-center counterinner">
					<ul>
						<li className="counter-text border-count">
							<h3 className="counter-after">$</h3>

						</li>
						<li className="counter-text border-count">
							<h3 className="counter counter-after">1</h3>

						</li>
						<li className="counter-text border-count">
							<h3 className="counter counter-after">2</h3>

						</li>
						<li className="counter-text border-count">
							<h3 className="counter counter-after">3</h3>

						</li>
						<li className="counter-text border-count">
							<h3 className="counter counter-after">4</h3>

						</li>
						<li className="counter-text border-count">
							<h3 className="counter counter-after">5</h3>

						</li>
						<li className="counter-text border-count">
							<h3 className="counter counter-after">6</h3>

						</li>
						<li className="counter-text border-count">
							<h3 className="counter counter-after">7</h3>

						</li>
					</ul>

				</div>

			</div>
		</div>
	</section>*/}
	

	{/* Control Start */}

	<section id="control" className="control back-light section">
		<div className="container">
			<div className="row justify-content-center text-center">
				<div className="col-lg-6">
					<div className="heading">
						<h2>555 lifetime membership cards</h2>
						<img src={headingBorderEffect} className="img-fluid" alt="effect" />
					</div>
				</div>
				<div className="row ">
					<div className="col-lg-6 col-md-12">
						<div className="row control-inner cont-bot">
							<div className="col-lg-3 col-md-2 col-4">
								<div className="control-img">
									<i className="fa flaticon-bill"></i>
								</div>
							</div>
							<div className="col-lg-9 col-md-10 col-8">
								<div className="control-text">
									<h3>Rewards</h3>
									<p>5% of EGLD bets from all of our games go into the holders' wallets (weekly distribution)</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-6 col-md-12">
						<div className="row control-inner">
							<div className="col-lg-3 col-md-2 col-4">
								<div className="control-img">
									<i className="fa flaticon-money"></i>
								</div>
							</div>
							<div className="col-lg-9 col-md-10 col-8">
								<div className="control-text">
									<h3>Community</h3>
									<p>Discord role that gives access to contests and advantages in the community (reserved channels, giveaway, contest)</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row control-pad">
					<div className="border-effect1">
						<img src={borderEffect} className="img-fluid" alt="effect"/>
					</div>
					<div className="border-effect2">
						<img src={borderEffect} className="img-fluid" alt="effect"/>
					</div>
				</div>

				<div className="row">
					<div className="col-lg-6 col-md-12">
						<div className="row control-inner cont-bot">
							<div className="col-lg-3 col-md-2 col-4">
								<div className="control-img">
									<i className="fa flaticon-loss"></i>
								</div>
							</div>
							<div className="col-lg-9 col-md-10 col-8">
								<div className="control-text">
									<h3>Partnership</h3>
									<p>Different benefits negotiated with other Elrond projects for holders (WL, free mint, airdrop)</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-6 col-md-12">
						<div className="row control-inner">
							<div className="col-lg-3 col-md-2 col-4">
								<div className="control-img">
									<i className="fa flaticon-wallet-1"></i>
								</div>
							</div>
							<div className="col-lg-9 col-md-10 col-8">
								<div className="control-text">
									<h3>Free Game</h3>
									<p>Free spin draws every month for holders. To give you chances to win the Jackpot.</p>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</section>
	{/* Control End */}
	{/* How to Start */}

	<section id="start" className="how-start back-light section">
		<div className="container">
			<div className="row justify-content-center text-center">
				<div className="col-lg-6">
					<div className="heading">
						<h2>How to Play ?</h2>
						<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
					</div>
				</div>
				<div className="row ">
					<div className="col-md-4">
						<div className="row control-inner">
							<div className="col-lg-3 col-md-12 col-3">
								<div className="start-img">
									<i className="fa flaticon-bill"></i>
								</div>
							</div>
							<div className="col-lg-9 col-md-12 col-9">
								<div className="start-text">
									<h3>Choose your slot machine</h3>
									
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className="row control-inner">
							<div className="col-lg-3 col-md-12 col-3">
								<div className="start-img">
									<i className="fa flaticon-wallet"></i>
								</div>
							</div>
							<div className="col-lg-9 col-md-12 col-9">
								<div className="start-text">
									<h3>Bet your $EGLD</h3>
								</div>
							</div>
						</div>
					</div>


					<div className="col-md-4">
						<div className="row control-inner">
							<div className="col-lg-3 col-md-12 col-3">
								<div className="start-img">
									<i className="fa flaticon-casino"></i>
								</div>
                            </div>
							<div className="col-lg-9 col-md-12 col-9">
								<div className="start-text">
									<h3>Try to win a prize or the Super Jackpot ! </h3>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row ">
					<p>For each bet, 10% goes into the jackpot which will be won randomly by a random player. 
					<br/>The more players there are, the bigger the Jackpot will be.</p>
				</div>

			</div>
		</div>
	</section>
	{/* How to Start */}

	{/* Related other games Start */}

	{/*<section id="project-img" className="project-img in-project back-light section">
		<div className="container">

			<div className="row justify-content-center text-center">
				<div className="col-lg-6">
					<div className="heading">
						<h2>The games</h2>
						<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
					</div>
				</div>
			</div>
			 <div className="row justify-content-center text-center pro-row">
                <div className="col-lg-9 m-auto col-12 text-center button-group">
                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-menu active" id="pills-all-tab" data-toggle="pill" href="#pills-all"
                                role="tab" aria-controls="pills-all" aria-selected="true">all</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-menu" id="pills-illustrations-tab" data-toggle="pill"
                                href="#pills-illustrations" role="tab" aria-controls="pills-illustrations"
                                aria-selected="false">slots</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-menu midl-btn" id="pills-logo-tab" data-toggle="pill" href="#pills-logo" role="tab"
                                aria-controls="pills-logo" aria-selected="false">Roulette</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-menu" id="pills-web-tem-tab" data-toggle="pill" href="#pills-web-tem"
                                role="tab" aria-controls="pills-web-tem" aria-selected="false">Black Jack</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-menu" id="pills-busi-card-tab" data-toggle="pill" href="#pills-busi-card"
                                role="tab" aria-controls="pills-busi-card" aria-selected="false">Poker Games</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-menu last-btn" id="pills-flyer-tab" data-toggle="pill" href="#pills-flyer"
                                role="tab" aria-controls="pills-flyer" aria-selected="false">other</a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="row mx-0">
            <div className="col-lg-12 px-0">
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-all" role="tabpanel"
                        aria-labelledby="pills-all-tab">
                        <div className="row mx-0">
                           <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage1} className="img-fluid" alt=""/>
						
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#" className="btn-4 yellow-btn">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Roulette</h3>
											<p>Catagory: Roulette</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                           </div>
                               <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage2} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Roulette</h3>
											<p>Catagory: Roulette</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                                <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage3} className="img-fluid" alt=""/>
						
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free slots</h3>
											<p>Catagory: slots</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>                            
                        
                        </div>
                    </div>
                    
                    <div className="tab-pane fade" id="pills-illustrations" role="tabpanel"
                        aria-labelledby="pills-illustrations-tab">
                        <div className="row mx-0">
                            <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage2} className="img-fluid" alt=""/>
						
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#" className="btn-4 yellow-btn">play now</a></div>
										<div className="port-text-btm">
											<h3>Free slots</h3>
											<p>Catagory: slots</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                           </div>
                               <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage4} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free slots</h3>
											<p>Catagory: slots</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                                <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage5} className="img-fluid" alt=""/>
						
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free slots</h3>
											<p>Catagory: slots</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>   
                            
                        </div>
                    </div>
                    <div className="tab-pane fade" id="pills-logo" role="tabpanel" aria-labelledby="pills-logo-tab">
                        <div className="row mx-0">
                        <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage3} className="img-fluid" alt=""/>
						
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#" className="btn-4 yellow-btn">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Roulette</h3>
											<p>Catagory: Roulette</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                           </div>
                               <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage6} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Roulette</h3>
											<p>Catagory: Roulette</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                            <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage7} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Roulette</h3>
											<p>Catagory: Roulette</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="pills-web-tem" role="tabpanel" aria-labelledby="pills-web-tem-tab">
                       <div className="row mx-0">
                        <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage1} className="img-fluid" alt=""/>
						
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#" className="btn-4 yellow-btn">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Black Jack</h3>
											<p>Catagory: Black Jack</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                           </div>
                               <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage2} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Black Jack</h3>
											<p>Catagory: Black Jack</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                            <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage6} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Black Jack</h3>
											<p>Catagory: Black Jack</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="tab-pane fade" id="pills-busi-card" role="tabpanel"
                        aria-labelledby="pills-busi-card-tab">
                       <div className="row mx-0">
                        <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage1} className="img-fluid" alt=""/>
						
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#" className="btn-4 yellow-btn">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Poker</h3>
											<p>Catagory: Poker</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                           </div>
                               <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage4} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Poker</h3>
											<p>Catagory: Poker</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                            <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage8} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Poker</h3>
											<p>Catagory: Poker</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="pills-flyer" role="tabpanel" aria-labelledby="pills-flyer-tab">
                      <div className="row mx-0">
                        <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage4} className="img-fluid" alt=""/>
						
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#" className="btn-4 yellow-btn">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Poker</h3>
											<p>Catagory: Poker</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                           </div>
                               <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage7} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Black Jack</h3>
											<p>Catagory: Black Jack</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                            <div className="col-md-4">
                            <div className="port_img">
						<img src={relatedGameImage9} className="img-fluid" alt=""/>
					
							<div className="overlay1">
								<div className="overlay-text">
									<div className="port-text">
										<div className="casino-btn">
											<a href="#">play now</a></div>
										<div className="port-text-btm">
											<h3>Free Roulette</h3>
											<p>Catagory: Roulette</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
			<div className="row justify-content-center text-center">
				<div className="col-md-12">
					<div className="casino-btn start-btn">
						<a href="games.html" className="btn-4 yellow-btn">Browse All</a></div>
				</div>
			</div>

		</div>
</section>*/}
	{/* Related other game End */}

	{/* Unlock free spin Start */}
	<section id="free-spin" className="free-spin back-light section">
		<div className="container">
			<div className="row justify-content-center text-center">
				<div className="col-lg-6">
					<div className="heading">
						<h2>Our Passion</h2>
						<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6 no-padding">
					<div className="spin-img">
						<img src={freeSpinImage} alt="casino"/>
					</div>
				</div>

				<div className="col-md-6">
					<div className="spin-text">

						<p>Elrond Jackpot is created by passionate developers who want to innovate on Elrond gambling. Discover the first slot machines with $EGLD jackpot built on Elrond Network. 
						</p><br/>
						<p>For each bet 20% goes into the jackpot which will be won by a random player.</p>

						<Link to="slotmachine">
							<div className="casino-btn">
								play now
							</div>
						</Link>

					</div>

				</div>
			</div>
		</div>
	</section>

	{/* Unlock free spin End */}
	
	{/* Casino Jackpots Start */}
	<section id="jackpots" className="jackpots back-dark section">
		<div className="container">
			<div className="row justify-content-center text-center">
				<div className="col-lg-6">
					<div className="heading">
						<h2>Statistics</h2>
						<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
					</div>
				</div>
			</div>
			<div className="row">

				<div className="col-lg-6 col-md-6">
					<div className="sub-heading">
						<h3>Last Transactions</h3>
					</div>

					<div className="row score-slick">
						{
							allTransactions.map(data => 
								<div className="col-md-12 scl_pad">
									<div className="row">
										<div className="col-lg-6 col-6 col-md-6">
											<div className="winner-name tun_border">
												<h5><a href={network.explorerAddress+"/transactions/"+data.hash} target="_blank">{data.hash.substring(0,14)+"..."+data.hash.substring(50)}</a></h5>
											</div>
										</div>
										<div className="col-lg-6 col-6 col-md-6 text-right">
											<div className="winner-name tun_border">
												<p>Bet : {data.value} $EGLD</p>
											</div>
										</div>
										<img src={taunamentBorder} alt="border" className="img-fluid jack-bor"/>
									</div>
								</div>
							)
						}
						
					</div>
				</div>
				<div className="col-lg-6 col-md-6">
					<div className="sub-heading">
						<h3>Last Winners</h3>
					</div>

					<div className="row score-slick">
						{
							allWin.map(data => 
								<div className="col-md-12 scl_pad">
									<div className="row">
										<div className="col-lg-6 col-6 col-md-6">
											<div className="winner-name tun_border">
												<h5><a href={network.explorerAddress+"/accounts/"+data.sender} target="_blank">{data.sender.substring(0,14)+"..."+data.sender.substring(50)}</a></h5>
											</div>
										</div>
										<div className="col-lg-6 col-6 col-md-6 text-right">
											<div className="winner-name tun_border">
												<p>{data.value} $EGLD</p>
											</div>
										</div>
										<img src={taunamentBorder} alt="border" className="img-fluid jack-bor"/>
									</div>
								</div>
							)
						}
					</div>
				</div>
			</div>
		</div>
	</section>
	{/* Casino Jackpots End */}
	
	{/* FAQ Start */}
	<section id="faq" className="faq back-light section">
		<div className="container">

			<div className="row justify-content-center text-center">
				<div className="col-lg-6">
					<div className="heading">
						<h2>Frequently Ask Questions</h2>
						<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-12 col-md-12">
					<div className="row">
						<div className="col-md-6">
							<div className="faq-inner">
								<h3>01. How much NFT do you plan to sell, at what price ?</h3>
								<p>There will be exactly 555 NFT mintable at 1 EGLD.</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="faq-inner f-padding">
								<h3>02. There are any utilities behind the NFTs ?</h3>
								<p>Sure, the NFT owners will receive 50% from the casino's income every week.</p>
							</div>
						</div>
					</div>
					<div className="row faq-border">
						<img src={faqBorder} className="img-fluid" alt="effect"/>
					</div>
					<div className="row faq-pad justify-content-center text-center">
        			<img src={faqBorder2} className="img-fluid" alt="effect"/>

					</div>

					<div className="row">
						<div className="col-md-6">
							<div className="faq-inner">
								<h3>03. Do you plan to enhance this online Elrond casino ?</h3>
								<p>Yes, we plan to add game quite frequently. We count on the community to share their wish for the next games. It could be slot machine, roulette, poket, etc. Everything that can be fun.</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="faq-inner f-padding">
								<h3>04. Can I join us on social media ?</h3>
								<p>You can join our Discord. There, you will be able to share with the community, relax, having fun and co-build the future of this casino.</p>
							</div>
						</div>
					</div>
				</div>

				{/*<div className="col-lg-3 col-md-12">
					<div className="faq-form">

						<form>

							<div className="form-group col-sm-12">
								<input type="text" className="form-control" name="name" placeholder="Enter Your Name"/>
							</div>
							<div className="form-group col-sm-12">
								<input type="text" className="form-control" name="email" placeholder="Enter Your Email"/>
							</div>
							<div className="form-group col-sm-12">

								<textarea name="meassage" placeholder="Enter Comments"></textarea>

							</div>
							<div className="casino-btn col-sm-12">
								<a href="#" className="btn-4 yellow-btn faq-btn">send</a></div>
						</form>

					</div>

				</div>*/}
			</div>
		</div>
	</section>
	{/* FAQ End */}
	
	
	{/* Casino Contact start */}
	{/*
	<section id="contact-us" className="contact-us back-dark contact section">
		<div className="container">
			<div className="row">

				<div className="col-lg-5 col-md-4">
					<div className="contact-about">
						<div className="heading">
							<h2>ABOUT Gambling</h2>
							<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
						</div>
						<p className="mb30">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><br/>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna ua.</p>
					</div>
				</div>
				<div className="col-lg-3 col-md-4">
					<div className="app-icon">
						<div className="heading">
							<h2>Get this App</h2>
							<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
						</div>
						<div className="contact-app">
							<ul>
								<li><a href="#"><i className="fa flaticon-app"></i></a><br/>ios</li>
								<li><a href="#"><i className="fa flaticon-android-character-symbol"></i></a><br/>Android</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-lg-4 col-md-4">
				<div className="row">
				<div className="col-lg-12">
					<div className="payments">
						<div className="heading">
							<h2>Payment Methods</h2>
							<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
						</div>
						<ul>
                            <li><a href="#"><img src={paymentImage1} className="img-fluid" alt="effect"/></a></li>
                            <li><a href="#"><img src={paymentImage2} className="img-fluid" alt="effect"/></a></li>
                            <li><a href="#"><img src={paymentImage3} className="img-fluid" alt="effect"/></a></li>
                            <li><a href="#"><img src={paymentImage4} className="img-fluid" alt="effect"/></a></li>
                            <li><a href="#"><img src={paymentImage5} className="img-fluid" alt="effect"/></a></li>
						</ul>
                    </div>
                    </div></div>
                    <div className="row">
                    <div className="col-lg-12">
					<div className="subscribe">
						<div className="heading">
							<h3>Subscribe for offers</h3>
							<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
						</div>
						<div className="sub-form">
							<form>
								<div className="form-group col-sm-12">
									<input type="text" className="form-control" name="email" placeholder="Enter Your Email"/>
								</div>
								<div className="casino-btn newsletter">
									<a href="#" className="btn-4 yellow-btn">send</a></div>
							</form>
                        </div></div>
					</div></div>
				</div>
			</div>
			<div className="row control-pad">
				<div className="border-effect1">
					<img src={borderEffect} className="img-fluid" alt="effect"/>
				</div>
				<div className="border-effect2">
					<img src={borderEffect} className="img-fluid" alt="effect"/>
				</div>
			</div>
			<div className="row justify-content-center text-center">
				<div className="col-md-12 bot-menu">
					<div className="foot-menu">
						<ul>
							<li><a href="about-us.html" className="">About Us</a></li>
							<li><a href="games.html">Games</a></li>
							<li><a href="tournaments.html" className="active">Tournaments</a></li>
							<li><a href="#">Contact</a></li>
							<li><a href="404-page.html">404 Page</a></li>
						</ul>
					</div>
				</div>
				<div className="col-md-12">
					<div className="copy-right">
						<h6>Copyright 2019. All rights reserved by DESIGNER</h6>
					</div>
				</div>
			</div>
		</div>

	</section>*/}
	{/* Casino Contact End */}
    </>
    )
};

export default Homepage;