import "./css/index.css";
import Token from "../Token";

function BetBoard(props){

    return(
        <div id="betting_board">
            <div className="winning_lines">
                <div id="wlttb_1" className="wlttb">
                    <div className="ttbbetblock_1" onClick={()=>props.setBetTransversale("0_2_3")}>
                        {props.betTransversale["0_2_3"]!==0 && <Token amount={props.betTransversale["0_2_3"]}/>}
                    </div>
                    <div className="ttbbetblock_2" onClick={()=>props.setBetCarre("2_3_5_6")}>
                        {props.betCarre["2_3_5_6"]!==0 && <Token amount={props.betCarre["2_3_5_6"]}/>}

                    </div>
                    <div className="ttbbetblock_3" onClick={()=>props.setBetCarre("5_6_8_9")}>
                        {props.betCarre["5_6_8_9"]!==0 && <Token amount={props.betCarre["5_6_8_9"]}/>}
                    </div>
                    <div className="ttbbetblock_4" onClick={()=>props.setBetCarre("8_9_11_12")}>
                        {props.betCarre["8_9_11_12"]!==0 && <Token amount={props.betCarre["8_9_11_12"]}/>}
                    </div>
                    <div className="ttbbetblock_5" onClick={()=>props.setBetCarre("11_12_14_15")}>
                        {props.betCarre["11_12_14_15"]!==0 && <Token amount={props.betCarre["11_12_14_15"]}/>}
                    </div>
                    <div className="ttbbetblock_6" onClick={()=>props.setBetCarre("14_15_17_18")}>
                        {props.betCarre["14_15_17_18"]!==0 && <Token amount={props.betCarre["14_15_17_18"]}/>}
                    </div>
                    <div className="ttbbetblock_7" onClick={()=>props.setBetCarre("17_18_20_21")}>
                        {props.betCarre["17_18_20_21"]!==0 && <Token amount={props.betCarre["17_18_20_21"]}/>}
                    </div>
                    <div className="ttbbetblock_8" onClick={()=>props.setBetCarre("20_21_23_24")}>
                        {props.betCarre["20_21_23_24"]!==0 && <Token amount={props.betCarre["20_21_23_24"]}/>}
                    </div>
                    <div className="ttbbetblock_9" onClick={()=>props.setBetCarre("23_24_26_27")}>
                        {props.betCarre["23_24_26_27"]!==0 && <Token amount={props.betCarre["23_24_26_27"]}/>}
                    </div>
                    <div className="ttbbetblock_10" onClick={()=>props.setBetCarre("26_27_29_30")}>
                        {props.betCarre["26_27_29_30"]!==0 && <Token amount={props.betCarre["26_27_29_30"]}/>}
                    </div>
                    <div className="ttbbetblock_11" onClick={()=>props.setBetCarre("29_30_32_33")}>
                        {props.betCarre["29_30_32_33"]!==0 && <Token amount={props.betCarre["29_30_32_33"]}/>}
                    </div>
                    <div className="ttbbetblock_12" onClick={()=>props.setBetCarre("32_33_35_36")}>
                        {props.betCarre["32_33_35_36"]!==0 && <Token amount={props.betCarre["32_33_35_36"]}/>}
                    </div>
                    <div className="ttbbetline_1" onClick={()=>props.setBetCheval("2_3")}>{props.betCheval["2_3"]!==0 && <Token amount={props.betCheval["2_3"]}/>}</div>
                    <div className="ttbbetline_2" onClick={()=>props.setBetCheval("5_6")}>{props.betCheval["5_6"]!==0 && <Token amount={props.betCheval["5_6"]}/>}</div>
                    <div className="ttbbetline_3" onClick={()=>props.setBetCheval("8_9")}>{props.betCheval["8_9"]!==0 && <Token amount={props.betCheval["8_9"]}/>}</div>
                    <div className="ttbbetline_4" onClick={()=>props.setBetCheval("11_12")}>{props.betCheval["11_12"]!==0 && <Token amount={props.betCheval["11_12"]}/>}</div>
                    <div className="ttbbetline_5" onClick={()=>props.setBetCheval("14_15")}>{props.betCheval["14_15"]!==0 && <Token amount={props.betCheval["14_15"]}/>}</div>
                    <div className="ttbbetline_6" onClick={()=>props.setBetCheval("17_18")}>{props.betCheval["17_18"]!==0 && <Token amount={props.betCheval["17_18"]}/>}</div>
                    <div className="ttbbetline_7" onClick={()=>props.setBetCheval("20_21")}>{props.betCheval["20_21"]!==0 && <Token amount={props.betCheval["20_21"]}/>}</div>
                    <div className="ttbbetline_8" onClick={()=>props.setBetCheval("23_24")}>{props.betCheval["23_24"]!==0 && <Token amount={props.betCheval["23_24"]}/>}</div>
                    <div className="ttbbetline_9" onClick={()=>props.setBetCheval("26_27")}>{props.betCheval["26_27"]!==0 && <Token amount={props.betCheval["26_27"]}/>}</div>
                    <div className="ttbbetline_10" onClick={()=>props.setBetCheval("29_30")}>{props.betCheval["29_30"]!==0 && <Token amount={props.betCheval["29_30"]}/>}</div>
                    <div className="ttbbetline_11" onClick={()=>props.setBetCheval("32_33")}>{props.betCheval["32_33"]!==0 && <Token amount={props.betCheval["32_33"]}/>}</div>
                    <div className="ttbbetline_12" onClick={()=>props.setBetCheval("35_36")}>{props.betCheval["35_36"]!==0 && <Token amount={props.betCheval["35_36"]}/>}</div>
                </div>
                <div id="wlttb_2" className="wlttb">
                    <div className="ttbbetblock_1" onClick={()=>props.setBetTransversale("0_1_2")}>
                            {props.betTransversale["0_1_2"]!==0 && <Token amount={props.betTransversale["0_1_2"]}/>}
                    </div>
                    <div className="ttbbetblock_2" onClick={()=>props.setBetCarre("1_2_4_5")}>
                            {props.betCarre["1_2_4_5"]!==0 && <Token amount={props.betCarre["1_2_4_5"]}/>}

                    </div>
                    <div className="ttbbetblock_3" onClick={()=>props.setBetCarre("4_5_7_8")}>
                        {props.betCarre["4_5_7_8"]!==0 && <Token amount={props.betCarre["4_5_7_8"]}/>}
                    </div>
                    <div className="ttbbetblock_4" onClick={()=>props.setBetCarre("7_8_10_11")}>
                        {props.betCarre["7_8_10_11"]!==0 && <Token amount={props.betCarre["7_8_10_11"]}/>}
                    </div>
                    <div className="ttbbetblock_5" onClick={()=>props.setBetCarre("10_11_13_14")}>
                        {props.betCarre["10_11_13_14"]!==0 && <Token amount={props.betCarre["10_11_13_14"]}/>}
                    </div>
                    <div className="ttbbetblock_6" onClick={()=>props.setBetCarre("13_14_16_17")}>
                        {props.betCarre["13_14_16_17"]!==0 && <Token amount={props.betCarre["13_14_16_17"]}/>}
                    </div>
                    <div className="ttbbetblock_7" onClick={()=>props.setBetCarre("16_17_19_20")}>
                        {props.betCarre["16_17_19_20"]!==0 && <Token amount={props.betCarre["16_17_19_20"]}/>}
                    </div>
                    <div className="ttbbetblock_8" onClick={()=>props.setBetCarre("19_20_22_23")}>
                        {props.betCarre["19_20_22_23"]!==0 && <Token amount={props.betCarre["19_20_22_23"]}/>}
                    </div>
                    <div className="ttbbetblock_9" onClick={()=>props.setBetCarre("22_23_25_26")}>
                        {props.betCarre["22_23_25_26"]!==0 && <Token amount={props.betCarre["22_23_25_26"]}/>}
                    </div>
                    <div className="ttbbetblock_10" onClick={()=>props.setBetCarre("25_26_28_29")}>
                        {props.betCarre["25_26_28_29"]!==0 && <Token amount={props.betCarre["25_26_28_29"]}/>}
                    </div>
                    <div className="ttbbetblock_11" onClick={()=>props.setBetCarre("28_29_31_32")}>
                        {props.betCarre["28_29_31_32"]!==0 && <Token amount={props.betCarre["28_29_31_32"]}/>}
                    </div>
                    <div className="ttbbetblock_12" onClick={()=>props.setBetCarre("31_32_34_35")}>
                        {props.betCarre["31_32_34_35"]!==0 && <Token amount={props.betCarre["31_32_34_35"]}/>}
                    </div>
                    <div className="ttbbetline_1" onClick={()=>props.setBetCheval("1_2")}>{props.betCheval["1_2"]!==0 && <Token amount={props.betCheval["1_2"]}/>}</div>
                    <div className="ttbbetline_2" onClick={()=>props.setBetCheval("4_5")}>{props.betCheval["4_5"]!==0 && <Token amount={props.betCheval["4_5"]}/>}</div>
                    <div className="ttbbetline_3" onClick={()=>props.setBetCheval("7_8")}>{props.betCheval["7_8"]!==0 && <Token amount={props.betCheval["7_8"]}/>}</div>
                    <div className="ttbbetline_4" onClick={()=>props.setBetCheval("10_11")}>{props.betCheval["10_11"]!==0 && <Token amount={props.betCheval["10_11"]}/>}</div>
                    <div className="ttbbetline_5" onClick={()=>props.setBetCheval("13_14")}>{props.betCheval["13_14"]!==0 && <Token amount={props.betCheval["13_14"]}/>}</div>
                    <div className="ttbbetline_6" onClick={()=>props.setBetCheval("16_17")}>{props.betCheval["16_17"]!==0 && <Token amount={props.betCheval["16_17"]}/>}</div>
                    <div className="ttbbetline_7" onClick={()=>props.setBetCheval("19_20")}>{props.betCheval["19_20"]!==0 && <Token amount={props.betCheval["19_20"]}/>}</div>
                    <div className="ttbbetline_8" onClick={()=>props.setBetCheval("22_23")}>{props.betCheval["22_23"]!==0 && <Token amount={props.betCheval["22_23"]}/>}</div>
                    <div className="ttbbetline_9" onClick={()=>props.setBetCheval("25_26")}>{props.betCheval["25_26"]!==0 && <Token amount={props.betCheval["25_26"]}/>}</div>
                    <div className="ttbbetline_10" onClick={()=>props.setBetCheval("28_29")}>{props.betCheval["28_29"]!==0 && <Token amount={props.betCheval["28_29"]}/>}</div>
                    <div className="ttbbetline_11" onClick={()=>props.setBetCheval("31_32")}>{props.betCheval["31_32"]!==0 && <Token amount={props.betCheval["31_32"]}/>}</div>
                    <div className="ttbbetline_12" onClick={()=>props.setBetCheval("34_35")}>{props.betCheval["34_35"]!==0 && <Token amount={props.betCheval["34_35"]}/>}</div>
                </div>
                <div id="wlttb_3" className="wlttb">
                    <div className="ttbbetblock_1"></div>
                    <div className="ttbbetblock_2"></div>
                    <div className="ttbbetblock_3"></div>
                    <div className="ttbbetblock_4"></div>
                    <div className="ttbbetblock_5"></div>
                    <div className="ttbbetblock_6"></div>
                    <div className="ttbbetblock_7"></div>
                    <div className="ttbbetblock_8"></div>
                    <div className="ttbbetblock_9"></div>
                    <div className="ttbbetblock_10"></div>
                    <div className="ttbbetblock_11"></div>
                    <div className="ttbbetblock_12"></div>
                    <div className="ttbbetline_1"></div>
                    <div className="ttbbetline_2"></div>
                    <div className="ttbbetline_3"></div>
                    <div className="ttbbetline_4"></div>
                    <div className="ttbbetline_5"></div>
                    <div className="ttbbetline_6"></div>
                    <div className="ttbbetline_7"></div>
                    <div className="ttbbetline_8"></div>
                    <div className="ttbbetline_9"></div>
                    <div className="ttbbetline_10"></div>
                    <div className="ttbbetline_11"></div>
                    <div className="ttbbetline_12"></div>
                </div>
                <div id="wlrtl_1" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("0_3")}>{props.betCheval["0_3"]!==0 && <Token amount={props.betCheval["0_3"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("0_2")}>{props.betCheval["0_2"]!==0 && <Token amount={props.betCheval["0_2"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("0_1")}>{props.betCheval["0_1"]!==0 && <Token amount={props.betCheval["0_1"]}/>}</div>
                </div>
                <div id="wlrtl_2" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("3_6")}>{props.betCheval["3_6"]!==0 && <Token amount={props.betCheval["3_6"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("2_5")}>{props.betCheval["2_5"]!==0 && <Token amount={props.betCheval["2_5"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("1_4")}>{props.betCheval["1_4"]!==0 && <Token amount={props.betCheval["1_4"]}/>}</div>
                </div>
                <div id="wlrtl_3" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("6_9")}>{props.betCheval["6_9"]!==0 && <Token amount={props.betCheval["6_9"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("5_8")}>{props.betCheval["5_8"]!==0 && <Token amount={props.betCheval["5_8"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("4_7")}>{props.betCheval["4_7"]!==0 && <Token amount={props.betCheval["4_7"]}/>}</div>
                </div>
                <div id="wlrtl_4" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("9_12")}>{props.betCheval["9_12"]!==0 && <Token amount={props.betCheval["9_12"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("8_11")}>{props.betCheval["8_11"]!==0 && <Token amount={props.betCheval["8_11"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("7_10")}>{props.betCheval["7_10"]!==0 && <Token amount={props.betCheval["7_10"]}/>}</div>
                </div>
                <div id="wlrtl_5" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("12_15")}>{props.betCheval["12_15"]!==0 && <Token amount={props.betCheval["12_15"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("11_14")}>{props.betCheval["11_14"]!==0 && <Token amount={props.betCheval["11_14"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("10_13")}>{props.betCheval["10_13"]!==0 && <Token amount={props.betCheval["10_13"]}/>}</div>
                </div>
                <div id="wlrtl_6" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("15_18")}>{props.betCheval["15_18"]!==0 && <Token amount={props.betCheval["15_18"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("14_17")}>{props.betCheval["14_17"]!==0 && <Token amount={props.betCheval["14_17"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("13_16")}>{props.betCheval["13_16"]!==0 && <Token amount={props.betCheval["13_16"]}/>}</div>
                </div>
                <div id="wlrtl_7" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("18_21")}>{props.betCheval["18_21"]!==0 && <Token amount={props.betCheval["18_21"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("17_20")}>{props.betCheval["17_20"]!==0 && <Token amount={props.betCheval["17_20"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("16_19")}>{props.betCheval["16_19"]!==0 && <Token amount={props.betCheval["16_19"]}/>}</div>
                </div>
                <div id="wlrtl_8" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("21_24")}>{props.betCheval["21_24"]!==0 && <Token amount={props.betCheval["21_24"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("20_23")}>{props.betCheval["20_23"]!==0 && <Token amount={props.betCheval["20_23"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("19_22")}>{props.betCheval["19_22"]!==0 && <Token amount={props.betCheval["19_22"]}/>}</div>
                </div>
                <div id="wlrtl_9" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("24_27")}>{props.betCheval["24_27"]!==0 && <Token amount={props.betCheval["24_27"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("23_26")}>{props.betCheval["23_26"]!==0 && <Token amount={props.betCheval["23_26"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("22_25")}>{props.betCheval["22_25"]!==0 && <Token amount={props.betCheval["22_25"]}/>}</div>
                </div>
                <div id="wlrtl_10" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("27_30")}>{props.betCheval["27_30"]!==0 && <Token amount={props.betCheval["27_30"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("26_29")}>{props.betCheval["26_29"]!==0 && <Token amount={props.betCheval["26_29"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("25_28")}>{props.betCheval["25_28"]!==0 && <Token amount={props.betCheval["25_28"]}/>}</div>
                </div>
                <div id="wlrtl_11" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("30_33")}>{props.betCheval["30_33"]!==0 && <Token amount={props.betCheval["30_33"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("29_32")}>{props.betCheval["29_32"]!==0 && <Token amount={props.betCheval["29_32"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("28_31")}>{props.betCheval["28_31"]!==0 && <Token amount={props.betCheval["28_31"]}/>}</div>
                </div>
                <div id="wlrtl_12" className="wlrtl">
                    <div className="rtlbb1" onClick={()=>props.setBetCheval("33_36")}>{props.betCheval["33_36"]!==0 && <Token amount={props.betCheval["33_36"]}/>}</div>
                    <div className="rtlbb2" onClick={()=>props.setBetCheval("32_35")}>{props.betCheval["32_35"]!==0 && <Token amount={props.betCheval["32_35"]}/>}</div>
                    <div className="rtlbb3" onClick={()=>props.setBetCheval("31_34")}>{props.betCheval["31_34"]!==0 && <Token amount={props.betCheval["31_34"]}/>}</div>
                </div>
            </div>


            <div className="bbtop">
                <div className="bbtoptwo" onClick={props.setBet1to18}>{props.bet1to18!==0 && <Token amount={props.bet1to18}/>}1 to 18</div>
                <div className="bbtoptwo" onClick={props.setBet19to36}>{props.bet19to36!==0 && <Token amount={props.bet19to36}/>}19 to 36</div>
            </div>
            <div className="number_board">
                <div className="number_0" onClick={()=>props.setBetPlein(0)}>
                    {props.betPlein[0]!==0 && <Token amount={props.betPlein[0]}/>}
                    <div className="nbn">0</div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(3)}>
                    {props.betPlein[3]!==0 && <Token amount={props.betPlein[3]}/>}
                    <div className="nbn">
                        3
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(6)}>
                    {props.betPlein[6]!==0 && <Token amount={props.betPlein[6]}/>}
                    <div className="nbn">
                        6
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(9)}>
                    {props.betPlein[9]!==0 && <Token amount={props.betPlein[9]}/>}
                    <div className="nbn">
                        9
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(12)}>
                    {props.betPlein[12]!==0 && <Token amount={props.betPlein[12]}/>}
                    <div className="nbn">
                        12
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(15)}>
                    {props.betPlein[15]!==0 && <Token amount={props.betPlein[15]}/>}
                    <div className="nbn">
                        15
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(18)}>
                    {props.betPlein[18]!==0 && <Token amount={props.betPlein[18]}/>}
                    <div className="nbn">
                        18
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(21)}>
                    {props.betPlein[21]!==0 && <Token amount={props.betPlein[21]}/>}
                    <div className="nbn">
                        21
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(24)}>
                    {props.betPlein[24]!==0 && <Token amount={props.betPlein[24]}/>}
                    <div className="nbn">
                        24
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(27)}>
                    {props.betPlein[27]!==0 && <Token amount={props.betPlein[27]}/>}
                    <div className="nbn">
                        27
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(30)}>
                    {props.betPlein[30]!==0 && <Token amount={props.betPlein[30]}/>}
                    <div className="nbn">
                        30
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(33)}>
                    {props.betPlein[33]!==0 && <Token amount={props.betPlein[33]}/>}
                    <div className="nbn">
                        33
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(36)}>
                    {props.betPlein[36]!==0 && <Token amount={props.betPlein[36]}/>}
                    <div className="nbn">
                        36
                    </div>
                </div>
                <div className="tt1_block" onClick={props.setBetCol1to34}>
                    {props.betCol1to34!==0 && <Token amount={props.betCol1to34}/>}
                    <div className="nbn">2-1</div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(2)}>
                    {props.betPlein[2]!==0 && <Token amount={props.betPlein[2]}/>}
                    <div className="nbn">
                        2
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(5)}>
                    {props.betPlein[5]!==0 && <Token amount={props.betPlein[5]}/>}
                    <div className="nbn">
                        5
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(8)}>
                    {props.betPlein[8]!==0 && <Token amount={props.betPlein[8]}/>}
                    <div className="nbn">
                        8
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(11)}>
                    {props.betPlein[11]!==0 && <Token amount={props.betPlein[11]}/>}
                    <div className="nbn">
                        11
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(14)}>
                    {props.betPlein[14]!==0 && <Token amount={props.betPlein[14]}/>}
                    <div className="nbn">
                        14
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(17)}>
                    {props.betPlein[17]!==0 && <Token amount={props.betPlein[17]}/>}
                    <div className="nbn">
                        17
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(20)}>
                    {props.betPlein[20]!==0 && <Token amount={props.betPlein[20]}/>}
                    <div className="nbn">
                        20
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(23)}>
                    {props.betPlein[23]!==0 && <Token amount={props.betPlein[23]}/>}
                    <div className="nbn">
                        23
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(26)}>
                    {props.betPlein[26]!==0 && <Token amount={props.betPlein[26]}/>}
                    <div className="nbn">
                        26
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(29)}>
                    {props.betPlein[29]!==0 && <Token amount={props.betPlein[29]}/>}
                    <div className="nbn">
                        29
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(32)}>
                    {props.betPlein[32]!==0 && <Token amount={props.betPlein[32]}/>}
                    <div className="nbn">
                        32
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(35)}>
                    {props.betPlein[35]!==0 && <Token amount={props.betPlein[35]}/>}
                    <div className="nbn">
                        35
                    </div>
                </div>
                <div className="tt1_block" onClick={props.setBetCol2to35}>
                    {props.betCol2to35!==0 && <Token amount={props.betCol2to35}/>}
                    <div className="nbn">2-1</div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(1)}>
                    {props.betPlein[1]!==0 && <Token amount={props.betPlein[1]}/>}
                    <div className="nbn">
                        1
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(4)}>
                    {props.betPlein[4]!==0 && <Token amount={props.betPlein[4]}/>}
                    <div className="nbn">
                        4
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(7)}>
                    {props.betPlein[7]!==0 && <Token amount={props.betPlein[7]}/>}
                    <div className="nbn">
                        7
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(10)}>
                    {props.betPlein[10]!==0 && <Token amount={props.betPlein[10]}/>}
                    <div className="nbn">
                        10
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(13)}>
                    {props.betPlein[13]!==0 && <Token amount={props.betPlein[13]}/>}
                    <div className="nbn">
                        13
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(16)}>
                    {props.betPlein[16]!==0 && <Token amount={props.betPlein[16]}/>}
                    <div className="nbn">
                        16
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(19)}>
                    {props.betPlein[19]!==0 && <Token amount={props.betPlein[19]}/>}
                    <div className="nbn">
                        19
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(22)}>
                    {props.betPlein[22]!==0 && <Token amount={props.betPlein[22]}/>}
                    <div className="nbn">
                        22
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(25)}>
                    {props.betPlein[25]!==0 && <Token amount={props.betPlein[25]}/>}
                    <div className="nbn">
                        25
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(28)}>
                    {props.betPlein[28]!==0 && <Token amount={props.betPlein[28]}/>}
                    <div className="nbn">
                        28
                    </div>
                </div>
                <div className="number_block blackNum" onClick={()=>props.setBetPlein(31)}>
                    {props.betPlein[31]!==0 && <Token amount={props.betPlein[31]}/>}
                    <div className="nbn">
                        31
                    </div>
                </div>
                <div className="number_block redNum" onClick={()=>props.setBetPlein(34)}>
                    {props.betPlein[34]!==0 && <Token amount={props.betPlein[34]}/>}
                    <div className="nbn">
                        34
                    </div>
                </div>
                <div className="tt1_block" onClick={props.setBetCol3to36}>
                    {props.betCol3to36!==0 && <Token amount={props.betCol3to36}/>}
                    <div className="nbn">2-1</div>
                </div>
            </div>
            <div className="bo3_board">
                <div className="bo3_block" onClick={props.setBet1to12}>{props.bet1to12!==0 && <Token amount={props.bet1to12}/>}1 to 12</div>
                <div className="bo3_block" onClick={props.setBet13to24}>{props.bet13to24!==0 && <Token amount={props.bet13to24}/>}13 to 24</div>
                <div className="bo3_block" onClick={props.setBet25to36}>{props.bet25to36!==0 && <Token amount={props.bet25to36}/>}25 to 36</div>
            </div>
            <div className="oto_board">
                <div className="oto_block"  onClick={props.setBetEven}>{props.betEven!==0 && <Token amount={props.betEven}/>}EVEN</div>
                <div className="oto_block redNum"  onClick={props.setBetRed}>{props.betRed!==0 && <Token amount={props.betRed}/>}RED</div>
                <div className="oto_block blackNum"  onClick={props.setBetBlack}>{props.betBlack!==0 && <Token amount={props.betBlack}/>}BLACK</div>
                <div className="oto_block"  onClick={props.setBetOdd}>{props.betOdd!==0 && <Token amount={props.betOdd}/>}ODD</div>
            </div>
        </div>
    )
}

export default BetBoard;