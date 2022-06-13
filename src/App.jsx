import React, { useEffect, useState } from "react";
import {ethers} from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

import Nav from "./NavBar";



import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Button from '@mui/material/Button';
import {  Alert, Avatar, Card, CardContent, Divider, FormControl, Grid, InputLabel, List, ListItem, ListItemAvatar, ListItemText, NativeSelect, Paper, TextField, Typography } from "@mui/material";




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

  
  useEffect(() => {
    checkIfWalletIsConnected();
    getAllVotes();
  }, [])

 
  const castVote = async() => {
    try{
      const {ethereum} = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        switch(selectedVote) {
          case '1':
            {
              const voteFor1 = await wavePortalContract.voteCandidate1(message);
              console.log("Mining...", voteFor1.hash);
              await voteFor1.wait();
              console.log("Mined -- ", voteFor1.hash);
            }
          case '2':
            {
              const voteFor2 = await wavePortalContract.voteCandidate2(message);
              console.log("Mining...", voteFor2.hash);
              await voteFor2.wait();
              console.log("Mined -- ", voteFor2.hash);
            }
          case '3':
            {
              const voteFor3 = await wavePortalContract.voteCandidate3(message);
              console.log("Mining...", voteFor3.hash);
              await voteFor3.wait();
              console.log("Mined -- ", voteFor3.hash);
            }
          case '0':
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
  


  {/* Material UI */}
  <div className="firstDiv">

  <div className="selection-div">
  <FormControl fullWidth>
    <InputLabel variant="standard" htmlFor="uncontrolled-native">
      Select Your Candidate
    </InputLabel>
    <NativeSelect 
    onChange={e=>setVote(e.target.value)}
    inputProps={{
      name: 'Candidate Name',
      id: 'uncontrolled-native'
    }}>
      <option value={0}>Vote for None</option>
      <option value={1}>Candidate 1</option>
      <option value={2}>Candidate 2</option>
      <option value={3}>Candidate 3</option>
    </NativeSelect>
  </FormControl>
  </div>

  <div className="textField-div">

  <FormControl fullWidth>

  <TextField label="Your message here"
  multiline
  maxRows={5}
  variant="filled"
  onChange={e=>setMessage(e.target.value)}
  ></TextField>
  
  </FormControl>
  </div>

  <div className="button-div">
  <Button variant="contained" color="success" onClick={castVote}>Submit</Button>
  </div>
  </div>


  <div className="totalVotesList">
    <List
    sx={{
      width: '100%',
      maxWidth: 360,
      bgcolor: 'background.paper',
    }}
    >
      <ListItem>
     <ListItemAvatar>
       <Avatar>
       </Avatar>
     </ListItemAvatar>
     <ListItemText primary="Candidate 1 Votes:" secondary={candidate1Total}/>
   </ListItem>
   <Divider variant="inset" component="li" />
   <ListItem>
     <ListItemAvatar>
       <Avatar></Avatar>
     </ListItemAvatar>
     <ListItemText primary="Candidate 2 Votes:" secondary={candidate2Total}/>
   </ListItem>
   <Divider variant="inset" component="li" />
   <ListItem>
     <ListItemAvatar>
       <Avatar></Avatar>
     </ListItemAvatar>
     <ListItemText primary="Candidate 3 Votes:" secondary={candidate3Total}/>
   </ListItem>
   <Divider variant="inset" component="li"/>
   <ListItem>
     <ListItemAvatar>
       <Avatar></Avatar>
     </ListItemAvatar>
     <ListItemText primary="Total no votes:" secondary={noVoteTotal}/>
   </ListItem>
    </List>
   
  </div>



  <div className="messageDiv">
    <div className="messageDivHeading">
    <Typography variant="h5">Messages</Typography>
    </div>
    {allVotes.map((vote,index) => {
      return (
        <Paper key={index} 
        sx={{
          p: 2,
          margin: 'auto',
          flexGrow: 1,
          Width: '80vw',
          backgroundColor: '#1A2027',
          marginBottom: '10px',
          marginTop: '20px'
        }}
        >
          <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div" sx={{fontSize: 12, color: '#fff'}}>
                Address: {vote.address}
              </Typography>
              <Typography variant="body2" color="White" sx={{fontSize: 16}}>
                ===> {vote.message}
              </Typography>
            </Grid>
          </Grid>
          
          <Grid item>
            <Typography variant="subtitle1" component="div" sx={{color: '#fff', fontSize: 12}}>
              {Intl.DateTimeFormat('en-US',{year: 'numeric', 
                                            month: '2-digit',
                                            day: '2-digit', 
                                            })
                                            .format(vote.timestamp)}
            </Typography>
          </Grid>
          </Grid>
        </Paper>
      )
    })}
  </div>

  



  

  {/* {allVotes.map((vote,index) => {
return (
  <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
    <div>Address: {vote.address}</div>
    <div>Time: {vote.timestamp.toString()}</div>
    <div>Message: {vote.message}</div>
  </div>
)
  })} */}


</div>
</div>

    
    
  );
}

export default App;
