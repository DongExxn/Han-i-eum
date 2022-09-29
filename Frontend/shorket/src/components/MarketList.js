import React from "react";

import MarketCard from "./MarketCard.js";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Grid,
    Button,
    Box,
    Stack,
    CardContent,
    CardMedia,
    Card,
    CardButton,
    CardActionArea,
    CardActions,
    Typography,
    Container,
    autocompleteClasses,
} from "@mui/material";

const theme = createTheme({
    // breakpoints: {
    //     values: {
    //         mobile: 0,
    //         tablet: 640,
    //         laptop: 1024,
    //         desktop: 1200,
    //     },
    // },
});

function MarketList({ list }) {
    const marketList = list;

    return (
        <ThemeProvider theme={theme}>
            {/* <Container
                sx={{ py: 8 }}
                maxWidth="lg"
                style={{
                    paddingTop: "10px",
                    backgroundColor: "#f5f5f5",
                }}
            > */}
            {/* <Grid
                className="MarketList"
                container
                spacing={3}
                style={{
                    // backgroundColor: "red",
                    padding: 0,
                }}
            > */}
            <div className="MarketList">
                {marketList.map((market) => (
                    // <Grid
                    //     className="MarketGrid"
                    //     key={market.id}
                    //     item
                    //     xs={12}
                    //     sm={6}
                    //     md={4}
                    // >
                    <MarketCard
                        id={market.id}
                        img={market.img}
                        url={market.url}
                        name={market.name}
                        location={market.location}
                        detail={market.detail}
                        time={market.time}
                        period={market.period}
                        like={market.like}
                        view={market.view}
                    />
                    // </Grid>
                ))}
                {/* </Grid> */}
            </div>

            {/* </Container> */}
        </ThemeProvider>
    );
}

export default MarketList;
