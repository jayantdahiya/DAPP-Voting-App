import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import abi from "./utils/WavePortal.json";
import {ethers} from "ethers";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

export default function Nav() {
    const classes = useStyles();

    const [currentAccount, setCurrentAccount] = useState("");
    const [walletConnected, setWalletConnected] = useState(false);

    const contractAddress = "0x7254fD190bc6840B0B5e3e0E2ef2931681B32E01";
    const contractABI = abi.abi;


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
          setWalletConnected(true);
        } else {
          console.log("No authorized account found")
        }
      } catch (error) {
        console.log(error);
      }
    }


    const connectWallet = async () => {
        try {
          const { ethereum } = window;
    
          if (ethereum) {
            await window.ethereum.enable();
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
            let count = await wavePortalContract.getTotalVotes();
            // console.log("Retrieved total votes count...", count.toNumber());
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error);
        }
      }

      // {!currentAccount && (
      //   <Button 
      //   variant="contained"
      //   color="success"
      //   onClick={connectWallet}>
      //     Connect Wallet
      //   </Button>
      // )}
      // {currentAccount && (
      //   <Button variant="contained" disabled>
      //     Connect Wallet
      //     </Button>
      // )}
    
    return(
        <div className={classes.root}>
            <AppBar position="static" color="secondary">
                <Toolbar variant="dense">
                    <Typography
                    variant="h6"
                    component="div"
                    sx={{flexGrow:1}}
                    >
                        DAPP
                    </Typography>
                    <Button 
                    color="inherit" 
                    onClick={connectWallet}
                    >Connect Wallet
                    </Button>
                    
                </Toolbar>
                
            </AppBar>

        </div> 

    )

}