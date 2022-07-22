import {useState,useEffect} from 'react';
import headerLogo from "../images/logo.png";
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
	let contractAddressSlotMachine=process.env.REACT_APP_SMART_CONTRACT_SLOT_MACHINE_CALLER;

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
					let bet=0;
					let win;
					let betValue=parseInt(data.results[0].value,10)/(10**18)
					if(data.results!=undefined){
						data.results.map((result)=>{
							if(result.callType==="2"){
								win=Buffer.from(result.data,"base64").toString().split("@")[2]; 
							}
						});
						

						let winValue;
						switch (win){
							case '01':
								winValue=0.05;
								break;
							case '02':
								winValue=0.07;
								break;
							case '03':
								winValue=0.1;
								break;
							case '04':
								winValue=0.2;
								break;
							case '05':
								winValue="Jackpot"
								break;
						
						}


						if(winValue!==null && winValue!==undefined){
							if(winValue!=="Jackpot"){
								winValue=winValue*(betValue/0.05)
							}
							allWinsFetch.push({sender:data.sender,value:winValue});
							i++;
						}


					}
					if(j<15){
						allTransactionsFetch.push({hash:data.txHash,value:betValue});
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
							<li><a href="#games">Games</a></li>
							<li><a href="#start">How to play ?</a></li>
							<li><a href="#control">Membership</a></li>
							<li><a href="#faq">FAQ</a></li>
							<li><a href="#jackpots">Statistics</a></li>
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
            <div className="button"><i id="more-less-menu" className="more-less fa fa-align-right"></i></div>
            <ul>
				<li className="list-menu-mobile"><a href="#banner">Home</a></li>
				<li className="list-menu-mobile"><a href="#control">Membership</a></li>
				<li className="list-menu-mobile"><a href="#start">How to play ?</a></li>
				<li className="list-menu-mobile"><a href="#jackpots">Statistics</a></li>
				<li className="list-menu-mobile"><a href="#faq">FAQ</a></li>
				<li className="list-menu-mobile login_menu navbar-right nav-sign">
					{!isLoggedIn ? <li className="login" onClick={handleConnect}>CONNECT WALLET</li> : <li className="login" onClick={handleLogout}>Logout</li>}
				</li>
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

						<h1 className="title">Elrond Vegas Club</h1>
						<h3>New Gambling Experience</h3>
						<p>Elrond Vegas Club is the 1st community casino built on Elrond Network. Play and try to multiply your $eGold on our new generation gambling games.</p>

						<a href="#project-img">
							<div className="casino-btn btn-4 yellow-btn">play now</div>
						</a>
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

	{/* Related other games Start */}

	<section id="project-img" className="project-img in-project back-light section">
		<div className="container">

			<div className="row justify-content-center text-center" id="games">
				<div className="col-lg-6">
					<div className="heading">
						<h2>The games</h2>
						<img src={headingBorderEffect} className="img-fluid" alt="effect"/>
					</div>
				</div>
			</div>
			 {/*<div className="row justify-content-center text-center pro-row">
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
            </div>*/}
            
            <div className="row mx-0">
            <div className="col-lg-12 px-0">
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-all" role="tabpanel"
                        aria-labelledby="pills-all-tab">
                        <div className="row mx-0">
                        	<div className="offset-md-2 col-md-4">
								<div className="port_img">
									<img src={relatedGameImage1} className="img-fluid" alt=""/>
							
									<div className="overlay1">
										<div className="overlay-text">
											<div className="port-text">
												<div className="casino-btn">
													<Link to="/wheelroom">play now</Link>
												</div>
												<div className="port-text-btm">
													<h3>Roulette</h3>
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
													<Link to="/slotmachine">play now</Link>
												</div>
												<div className="port-text-btm">
													<h3>Slot Machine</h3>
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
			{/*<div className="row justify-content-center text-center">
				<div className="col-md-12">
					<div className="casino-btn start-btn">
						<a href="games.html" className="btn-4 yellow-btn">Browse All</a></div>
				</div>
			</div>*/}

		</div>
	</section>
	{/* Related other game End */}

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
									<h3>1. Connect your wallet and & choose your game</h3>
									
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
									<h3>2. Choose your bet</h3>
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
									<h3>3. Start the game & wait for the result</h3>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row ">
					<p Style="padding:15px">0% bet fees
					<br/>40% of casino revenue for holders</p>
				</div>

			</div>
		</div>
	</section>
	{/* How to Start */}
	

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
									<h3>REWARDS</h3>
									<p>40% of casino winnings + 30% of royalties go to our NFT holders, in EGLD every week. We manage the casino's income as an investment fund and we can offer investments to increase the rewards, which the holders will vote for</p>
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
									<h3>DAO</h3>
									<p>For the 1st community casino on Elrond we opted for the DAO. This will be the first DAO for Elrond gambling. The decisions belong to the investors. Holders will be able to offer new games that we will develop and more. 1 NFT = 1 vote</p>
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
									<h3>COMMUNITY</h3>
									<p>We believe in a strong community model. We are planning discord animations for holders with several prizes to be won. Discord roles giving access to several advantages will be available (giveaways, free games, advantages of our partners)</p>
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
									<h3>PARTNERSHIP</h3>
									<p>Partnerships with Elrond projects only will be established to increase the volume of games. We plan to integrate our casino with different Elrond partners (ecosystems, websites, dapp, metaverse). Our technical skills allow us to implement the casino with our partners</p>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</section>
	{/* Control End */}


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

						<p>Elrond Vegas Club is created by passionate developers from the Elrond community. Our ambition is to build the 1st community casino in EGLD. Our investors will receive rewards and will have real decision-making power over the evolution of the casino (partnerships, new games, rewards). We plan to implement the casino with partner projects who want to offer gambling experiences to their members. Our technical skills allow us to work on different supports (dapp, website, metaverse).
						</p><br/>
						<p>Our strength is the technicality and the passion that we share for Elrond and web3 gambling. Let's develop together the Elrond community casino of tomorrow !</p>

						<Link to="/slotmachine">
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
								<h3>01. What are the rewards of the holders ?</h3>
								<p>40% of all revenue generated by the casino + 30% of secondary market royalties are for the card holders.</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="faq-inner f-padding">
								<h3>02. What is casino revenue ?</h3>
								<p>Casino revenue is not calculated on all bets but only on losing bets and the value we create with partnerships.</p>
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
								<h3>03. How many NFT's available ?</h3>
								<p>Only 555 membership cards are available for 1 EGLD each. This is your lifetime membership card as a casino investor.</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="faq-inner f-padding">
								<h3>04. How much betting commission ?</h3>
								<p>The casino takes 0% on bets and it is wanted. So you can play for free 1 egld committed = 1 egld bet.</p>
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