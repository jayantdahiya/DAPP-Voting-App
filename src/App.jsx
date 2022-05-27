import React, { useEffect, useState } from "react";
import {ethers} from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

import Nav from "../NavBar";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Button from '@mui/material/Button';
import { AppBar, Box, FormControl, InputLabel, NativeSelect, TextField, Toolbar, Typography } from "@mui/material";




const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const contractAddress = "0x7254fD190bc6840B0B5e3e0E2ef2931681B32E01";
    const contractABI = abi.abi;
    const [allVotes, setAllVotes] = useState([]);
    const [candidate1Total, setCandidate1Total] = useState("");
    const [candidate2Total, setCandidate2Total] = useState("");
    const [candidate3Total, setCandidate3Total] = useState("");
    const [noVoteTotal, setNoVoteTotal] = useState("");
    

    const [selectedVote, setVote] = useState("");
    const [message, setMessage] = useState("***this is the default message***");


  const getAllVotes = async () => {
    try{
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const votes = await wavePortalContract.getAllVotes();

        let votesCleaned = [];
        votes.forEach(vote =>{
          votesCleaned.push({
            address: vote.voter,
            timestamp: new Date(vote.timestamp * 1000),
            message: vote.message
          });
        });

        setAllVotes(votesCleaned);

        const votes1 = await wavePortalContract.getCandidate1Votes();
        setCandidate1Total(votes1.toNumber());
        // console.log("Votes of Candidate 1:", votes1.toNumber());
        const votes2 = await wavePortalContract.getCandidate2Votes();
        setCandidate2Total(votes2.toNumber());
        const votes3 = await wavePortalContract.getCandidate3Votes();
        setCandidate3Total(votes3.toNumber());
        const noVotes = await wavePortalContract.getNoneVotes();
        setNoVoteTotal(noVotes.toNumber());

        
      } else {
        console.log("Ethereum object doesn't exist!")
      }
      
    } catch (error) {
      console.log(error);
    }
  }
    

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllVotes();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * connectWallet method 
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalVotes();
        console.log("Retrieved total votes count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

 
  const castVote = async() => {
    try{
      const {ethereum} = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        switch(selectedVote) {
          case 'candidate1':
            {
              const voteFor1 = await wavePortalContract.voteCandidate1(message);
              console.log("Mining...", voteFor1.hash);
              await voteFor1.wait();
              console.log("Mined -- ", voteFor1.hash);
            }
          case 'candidate2':
            {
              const voteFor2 = await wavePortalContract.voteCandidate2(message);
              console.log("Mining...", voteFor2.hash);
              await voteFor2.wait();
              console.log("Mined -- ", voteFor2.hash);
            }
          case 'candidate3':
            {
              const voteFor3 = await wavePortalContract.voteCandidate3(message);
              console.log("Mining...", voteFor3.hash);
              await voteFor3.wait();
              console.log("Mined -- ", voteFor3.hash);
            }
          case 'noVote':
            {
              const voteForNone = await wavePortalContract.voteNone(message);
              console.log("Mining...", voteForNone.hash);
              await voteForNone.wait();
              console.log("Mined -- ", voteForNone.hash);
            }
        }

        const count = await wavePortalContract.getTotalVotes();
        console.log("Total votes: ", count.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
      
    } catch (error){
      console.log(error);
    }
  }

  

  
  
  
  return (
   
 <div className="mainContainer">
  


<div className="dataContainer">
  <Nav />
  

  {/* <div>
  <form onSubmit={castVote}>
    
    <label>
    Select your vote: 
      <select onChange={e => setVote(e.target.value)}>
       <option value="candidate1">Candidate 1</option>
       <option value="candidate2">Candidate 2</option>
       <option value="candidate3">Candidate 3</option>
       <option defaultValue="noVote">Vote for None</option>
      </select>
    </label>
    <br />
    <label>
      Enter your message:
      <br />
      <textarea onChange={e => setMessage(e.target.value)}></textarea>
    </label>
    <br />
  <input type="submit" value="Submit"></input>
  </form>
  </div> */}

  {/* Material UI Form */}
  <div>
  <FormControl fullWidth>
    <InputLabel variant="standard" htmlFor="uncontrolled-native">
      Select Your Candidate
    </InputLabel>
    <NativeSelect inputProps={{
      name: 'Candidate Name',
      id: 'uncontrolled-native'
    }}>
      <option value={1}>Candidate 1</option>
      <option value={2}>Candidate 2</option>
      <option value={3}>Candidate 3</option>
      <option value={0}>Vote for None</option>
    </NativeSelect>
  </FormControl>

  <FormControl fullWidth>

  <TextField label="Your message here"
  multiline
  maxRows={5}
  variant="filled"
  onChange={null}
  ></TextField>
  
  </FormControl>
  <Button variant="contained" color="success">Submit</Button>

  </div>
 

  <br />

  <div>
    <li>Total votes of Candidate 1 ==> {candidate1Total}</li>
    <li>Total votes of Candidate 2 ==> {candidate2Total}</li>
    <li>Total votes of Candidate 3 ==> {candidate3Total}</li>
    <li>Total votes for no vote ==> {noVoteTotal}</li>
   
  </div>

  

  {!currentAccount && (
    <Button 
    // className="connectButton" 
    variant="contained"
    color="success"
    onClick={connectWallet}>
      Connect Wallet
    </Button>
  )}
  {currentAccount && (
    <Button variant="contained" disabled>
      Connect Wallet
      </Button>
  )}

  

  {allVotes.map((vote,index) => {
return (
  <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
    <div>Address: {vote.address}</div>
    <div>Time: {vote.timestamp.toString()}</div>
    <div>Message: {vote.message}</div>
  </div>
)
  })}
</div>
</div>

    
    
  );
}

export default App;
