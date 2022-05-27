import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

export default function Nav() {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography
                    variant="h6"
                    component="div"
                    sx={{flexGrow:1}}
                    >Voting-DAPP</Typography>

                    <Button color="inherit">
                        Connect Wallet 
                    </Button>
                </Toolbar>
                
            </AppBar>

        </div> 

    )

}