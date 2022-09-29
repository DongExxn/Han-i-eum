import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
} from "@mui/material";

function createData(market, booth, date, location) {
    return { market, booth, date, location };
}
const rows = [
    createData("ㅇㅇㅇㅇㅇ", "코딩동아리", "2022.09.01", "아주대학교병원"),
    createData("ㅁㅁㅁㅁㅁ", "한이음동아리", 9.0, 37),
    createData("ㄴㄴㄴㄴㄴ", "모각소", 16.0, 24),
    createData("ㄹㄹㄹㄹㄹ", "사진동아리", 3.7, 67),
    createData("ㅂㅂㅂㅂㅂ", "여행동아리", 16.0, 49),
];

function WishBooth() {
    return (
        <div>
            <h1 className="wishBooth_title">관심 부스</h1>
            <Divider />
            <TableContainer component={Paper}>
                <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>마켓</TableCell>
                            <TableCell align="center">부스</TableCell>
                            <TableCell align="center">기간</TableCell>
                            <TableCell align="center">위치</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.market}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.market}
                                </TableCell>
                                <TableCell align="center">
                                    {row.booth}
                                </TableCell>
                                <TableCell align="center">{row.date}</TableCell>
                                <TableCell align="center">
                                    {row.location}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default WishBooth;
