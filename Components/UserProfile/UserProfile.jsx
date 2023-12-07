import React, { useEffect, useState } from "react";

//INTERNAL IMPORT
import Style from "./UserProfile.module.css";
import images from "../../assets";
import NavProfile from "../NavProfile/NavProfile";
import { Connection } from "@solana/web3.js";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import {
    getOauthStripe,
    getRefer,
    getStripeIDFromToken,
    getUserIdFromToken,
    updateWaxAccount,
    updateNotification,
    getUser,
    getDAONFT,
} from "../../api";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS({
    rpcEndpoint: "https://wax.greymass.com",
});

const config = require("./../../config.json");

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: "80px",
    height: "45px",
    borderRadius: "100px",
    "& .MuiSwitch-switchBase": {
        borderRadius: "100px",
        transform: "translate(6px, 6px)",
        "&.Mui-checked": {
            transform: "translate(39px, 6px)",
        },
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
        width: 16,
        height: 16,
        borderRadius: 10,
        backgroundColor: "#551BF9",
    },
    "& .MuiSwitch-track": {
        backgroundColor: "#7748f769 !important",
        borderRadius: 32 / 2,
        opacity: 1,
        boxSizing: "border-box",
    },
}));

const UserProfile = () => {
    const { publicKey } = useWallet();
    const [nft_count, setNFTCount] = useState(0);
    const [refer, setRefer] = useState([]);
    const [refer_link, setReferLink] = useState("");
    const [stripe_id, setStripeID] = useState();
    const [waxAccount, setWaxAccount] = useState("");
    const [notificationEmail, setNotificationEmail] = useState(true);
    const [notificationApp, setNotificationApp] = useState(true);
    const [nfts, setNfts] = useState([]);
    const [selectedNFT, setSelectedNFT] = useState(0);

    useEffect(() => {
        if (publicKey) {
            getDAONFT(publicKey).then((data) => {
                setNfts(data);
                getNFTImage(data);
            });
        }
    }, [publicKey]);

    const getNFTImage = async (data) => {
        for (let i = 0; i < data?.length; i++) {
            const image = (await (await fetch(data[i]?.uri)).json())?.image;
            setNfts((prevArray) =>
                prevArray.map((el, index) =>
                    index === i ? { ...el, image: image } : el
                )
            );
        }
    };

    useEffect(() => {
        getUser()
            .then((data) => {
                setWaxAccount(data?.waxAccount);
                setNotificationApp(data?.notification.app);
                setNotificationEmail(data?.notification.email);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (getUserIdFromToken()) {
            setReferLink(
                `${config.frontend_url}/refer/${getUserIdFromToken()}`
            );

            const data = {
                user_id: getUserIdFromToken(),
            };
            getRefer(data).then((data) => {
                if (data.success) {
                    setRefer(data.data);
                }
            });
        }
        // getStripeIDFromToken
        setStripeID(getStripeIDFromToken());
    }, []);

    const copyHandle = () => {
        navigator.clipboard.writeText(
            `${config.frontend_url}/refer/${getUserIdFromToken()}`
        );
        toast.success("Successfully copied", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
    };

    const connect = async () => {
        const data = {
            user_id: getUserIdFromToken(),
        };
        const res = await getOauthStripe(data);
        if (res.success) window.open(res.message, "_blank");
        console.log(res);
    };

    const waxConnect = async () => {
        const userAccount = await wax.login();
        if (userAccount) {
            setWaxAccount(userAccount);
            const data = {
                waxAccount: userAccount,
            };
            await updateWaxAccount(data);
        }
    };

    const notificationHandler = async (type) => {
        const data = {
            email: type == "email" ? "email" : null,
            app: type == "app" ? "app" : null,
        };
        if (type == "email") {
            setNotificationEmail(!notificationEmail);
        } else {
            setNotificationApp(!notificationApp);
        }
        await updateNotification(data);
    };

    return (
        <>
            <NavProfile />

            <div className={Style.user_details_section}>
                <div className={Style.user_details_first}>
                    <h1 className={Style.user_details_title}>YOUR NFTs</h1>
                    <div
                        className={Style.user_details_first_card}
                        onClick={() => {
                            if (selectedNFT + 1 > nfts.length) {
                                setSelectedNFT(0);
                            } else {
                                setSelectedNFT(selectedNFT + 1);
                            }
                        }}
                    >
                        {nfts[`${selectedNFT}`]?.image ? (
                            <img
                                src={nfts && nfts[`${selectedNFT}`]?.image}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "15px",
                                    objectFit: "cover",
                                }}
                                alt="image"
                            />
                        ) : null}
                    </div>
                    <p>
                        Genesis NFT {selectedNFT} - {nfts.length}
                    </p>
                    <div
                        className={Style.user_details_first_btn}
                        onClick={() =>
                            window.open("https://daofolk.texaglo.com", "_blank")
                        }
                    >
                        <h3>GET MORE</h3>
                    </div>
                </div>

                {/* <div className={Style.user_details_secound}>
          <h1 className={Style.user_details_title}>YOUR SHARE</h1>
          <div className={Style.user_details_secound_card}>
            <h1>$100k</h1>
            <p>{"Holder's Pool"}</p>
            <div className={Style.user_details_secound_card_bottom}>
              <div className={Style.user_details_secound_card_seekbar}>
                <div className={Style.user_details_secound_card_innerbar}></div>
              </div>
              <p>POINT</p>
              <button className={Style.user_details_secound_card_bottom_button}>
                CLAIM
              </button>
            </div>
          </div>
          <p>CURRENT SHARE VALUE </p>
          <p>$1 USDC </p>
        </div> */}

                <div className={Style.user_details_third}>
                    <h1 className={Style.user_details_title}>REFER A FRIEND</h1>
                    <div className={Style.user_details_third_card}>
                        <div className={Style.user_details_third_card_address}>
                            <div className={Style.user_address}>
                                {refer_link}
                            </div>
                            <button
                                className={Style.user_address_button}
                                onClick={copyHandle}
                            >
                                Copy
                            </button>
                        </div>
                        <div className={Style.user_refer_list}>
                            <table className="two-column-table">
                                <thead>
                                    <tr>
                                        <th className="left-column-title">
                                            REFERRALS
                                        </th>
                                        <th className="right-column-title">
                                            POINTS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {refer.map((item, index) => (
                                        <tr key={index}>
                                            <td className="left-column">
                                                {item.name}
                                            </td>
                                            <td className="right-column">20</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p>
                        -FOR EACH FRIEND THAT BUYS A POINT USING YOUR LINK YOU
                        GET 1 POINT.
                    </p>
                    <p>
                        -WHEN YOU PURCHASE A POINT YOUR ENTRY WILL COUNT AS 1
                        POINT X N OF UNCLAIMED POINTS.
                    </p>
                </div>

                <div className={Style.user_details_third}>
                    <h1 className={Style.user_details_title}>
                        Notification settings
                    </h1>
                    <div
                        className={Style.user_details_third_card}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p>DISABLE / ENABLE</p>
                        <div>
                            Email
                            <AntSwitch
                                checked={notificationEmail}
                                onChange={() => {
                                    notificationHandler("email");
                                }}
                                inputProps={{ "aria-label": "ant design" }}
                            />
                        </div>
                        <div>
                            App
                            <AntSwitch
                                checked={notificationApp}
                                onChange={() => {
                                    notificationHandler("app");
                                }}
                                inputProps={{ "aria-label": "ant design" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.user_details_section}>
                <div>
                    <h3>Please connect your stripe</h3>
                    <div>
                        <h4>AccountID: {stripe_id} </h4>
                        <button
                            onClick={connect}
                            className={Style.user_details_first_btn}
                        >
                            <h4 className={Style.user_details_first_h4}>
                                Connect
                            </h4>
                        </button>
                    </div>
                </div>
                <div>
                    <h3>Please connect wax wallet</h3>
                    <div>
                        <h4>Account: {waxAccount} </h4>
                        <button
                            onClick={waxConnect}
                            className={Style.user_details_first_btn}
                        >
                            <h4 className={Style.user_details_first_h4}>
                                Wax Connect
                            </h4>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
