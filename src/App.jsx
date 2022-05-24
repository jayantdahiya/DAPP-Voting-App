import React, { useEffect, useState } from "react";
import {ethers} from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";




const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const contractAddress = "0xf854D3bB4b02437FE0F1c670Ee2b8be37a9dd4fe";
    const contractABI = abi.abi;
    const [allVotes, setAllVotes] = useState([]);

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
  * Implement your connectWallet method here
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

 
  // const vote1 = async() => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       const voteFor1 = await wavePortalContract.voteCandidate1("This is a test message!");
  //       console.log("Mining...", voteFor1.hash);

  //       await voteFor1.wait();
  //       console.log("Mined -- ", voteFor1.hash);

  //       const count = await wavePortalContract.getTotalVotes();
  //       console.log("Total Votes: ", count.toNumber());
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const vote2 = async() => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       const voteFor2 = await wavePortalContract.voteCandidate2("This is a test message!");
  //       console.log("Mining...", voteFor2.hash);

  //       await voteFor2.wait();
  //       console.log("Mined -- ", voteFor2.hash);

  //       const count = await wavePortalContract.getTotalVotes();
  //       console.log("Total Votes: ", count.toNumber());
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const vote3 = async() => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       const voteFor3 = await wavePortalContract.voteCandidate3("This is a test message!");
  //       console.log("Mining...", voteFor3.hash);

  //       await voteFor3.wait();
  //       console.log("Mined -- ", voteFor3.hash);

  //       const count = await wavePortalContract.getTotalVotes();
  //       console.log("Total Votes: ", count.toNumber());
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const noVote = async() => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       const voteForNone = await wavePortalContract.voteNone("This is test message!");
  //       console.log("Mining...", voteForNone.hash);

  //       await voteForNone.wait();
  //       console.log("Mined -- ", voteForNone.hash);

  //       const count = await wavePortalContract.getTotalVotes();
  //       console.log("Total Votes: ", count.toNumber());
      
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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
        <div className="header">
        Decentralised Voting System 
        </div>

        <div className="bio">
        Select your option:
        </div>

        <div>
        <form onSubmit={castVote}>
          
          <label>
          Select your vote: 
            <select onChange={e => setVote(e.target.value)}>
             <option value="candidate1">Candidate 1</option>
             <option value="candidate2">Candidate 2</option>
             <option value="candidate3">Candidate 3</option>
             <option selected value="noVote">Vote for None</option>
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
        </div>

        

        {!currentAccount && (
          <button className="connectButton" onClick={connectWallet}>
            Connect Wallet
          </button>
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
