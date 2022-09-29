import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Divider, Avatar } from "@mui/material";
import { deepOrange, deepPurple } from "@mui/material/colors";

import PersonIcon from "@mui/icons-material/Person";
import { Button } from "antd";

const ROLE = {
    I: "개인",
    A: "관리자",
    S: "판매자",
};

const Profile = ({ userData }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // console.log("Profile");
        // console.log(userData);
    }, []);

    return (
        <section className="profile">
            <h1>프로필 정보</h1>
            <div className="profile_card">
                <Avatar
                    sx={{
                        bgcolor: deepOrange[500],
                        width: 80,
                        height: 80,
                        fontSize: 30,
                    }}
                >
                    {userData?.nickName?.slice(0, 1).toUpperCase()}
                </Avatar>
                <div className="detail_box">
                    <div>{userData?.nickName}</div>
                    <div>{userData?.email}</div>
                </div>
                <div>{ROLE[userData?.userRole]}</div>
                <Button
                    onClick={() => {
                        navigate("/my/profile");
                    }}
                >
                    프로필 수정
                </Button>
            </div>
            <Divider />
        </section>
    );
};

export default Profile;
