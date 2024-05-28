import "./App.css";
import React, {useState, userEffect} from "react";
import  { ethers } from "ethers";
import ActionButton from "./components/ActionButton";
import player from "./components/Player";
import Button from "react-bootstrap/Button";
import ContractAbi from "./ContractAbi.json";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { FormControl } from "react-bootstrap";

const App = () => {
    const contractAddress = "";
    const [playerAction, setPlayerAction] = useState("");
    const [computerAction, setComputerAction] = useState("");
    const [betAmount, setBetAmount] = useState(0);

    const onActionSelected = (selectedAction) => {
        setPlayerAction(selectedAction);
        setComputerAction("");
    };
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const [connButtonText, setConnButtonText] = useState("Connect Wallet");
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [contractchoice, setContractChoice] = useState(null);
    const [txHash, setTxHash] = useState(0);

    userEffect(() => {
        connectWalletHandler();
    }, []);

    const connectWalletHandler = () => {
        if (window.ethereum) {
            provider.send("eth_requestAccounts", []).then(async () => {
                await accountChangedHandler(provider.getSigner());
            });
        }else{
            alert("error connecting to wallet");
        }
    };

    const accountChangedHandler = async (newAccount) => {
        const address = await newAccount.getAddress();
        const balance = await newAccount.getBalance();
        setConnButtonText(address);
        setAccount(address)
        await getUserBalance();
        connectContract();
    };

    const getUserBalance = async (address) => {
        const balance = await provider.getBalance(address, "latest");
    };

    const connectContract = async () => {
        try {
            let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
            let tempContract = new ethers.Contract(
                contractAddress,
                ContractAbi,
                tempSigner
            );
            setContract(tempContract);
        }catch (error){
            alert(`An error occurred when connecting to the contract ${error}`);
            console.error("Error:", error);
        }
    };
    const play = async () => {
        setComputerAction("");
        const overrides = {
            value: ethers.utils.parseEther(`${betAmount}`),            
        };

        let choice = 3;
        if(playerAction === "rock"){
            choice = 1;
        }else if (playerAction == "paper"){
            choice = 2
        } 
        if (betAmount < 0.001 && playerAction == ""){
            alert("Bet Amount is too small pr player hasn't been chosen");
        } else {
            try {
                const transaction = await contract.play(choice, overrides);
                setTxHash(transaction.hash);
                console.log(`Transaction ${transaction.hash} complete`);

                await transaction.wait();

                fetchcontractChoice();
            } catch (error) {
                alert(`Failed transaction, please try again`);
                console.error("Error:", error);
            }
        }       
    };
    const fetchcontractChoice = () => {
      try {
        const dataFromContract = contract.getCurrentChallengeStatus(account);
        console.log(`
        Whole data from contract: ${dataFromContract}
        Status: ${dataFromContract[0]}
        Player Choice; ${dataFromContract[3]}
        Contract Choice: ${dataFromContract[4]}`);
      } catch (error) {
        alert("An error occurred when fetching getCurrentChallengeStatus:", error);
        console.error("An error occurred when fetching getCurrentChallenge status", error);
      }
    };

    const displayCompChoice = (resultFromContract) => {
      let compChoice = "scissors";
      if (contractchoice == 1){
        compChoice = "rock";
      } else if (contractchoice == 2){
        compChoice = "paper";
      }
      setComputerAction(compChoice);
    };
    const handleChangeOnBet = (event) => {
        setBetAmount(event.target.value);

    };

    return(
        <div className="center">
            <h1>Rock Paper scissors</h1>
            <Button className="button-connect" variant="outline-primary" onClick={connectWalletHandler}>
                {connButtonText}
            </Button>{" "}
            <div>
                <div className="container">
                    <Player name= "Player" action={playerAction} />
                    <Player name= "Computer" action={computerAction} />
                </div>
                <div>
                    <ActionButton action="rock" onActionSelected={onActionSelected} />
                    <ActionButton action="paper" onActionSelected={onActionSelected} />
                    <ActionButton action="scissors" onActionSelected={onActionSelected} />
                </div>
                <div className="inputs">
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">Bet Amount</InputGroup.Text>
                  

                    <FormControl
                    aria-label="Bet Amount"
                    aria-describedby="inputGroup-sizing-default"
                    onchange={handleChangeOnBet}
                    value={betAmount}
                    />
                    </InputGroup>

                </div>
                <Button variant="success" className="button-play" onClick={play}>play</Button>{" "}
                <p>{'Latest transaction hash: ${txHash}'}</p>
            </div>
        </div>

    )
}

export default App;