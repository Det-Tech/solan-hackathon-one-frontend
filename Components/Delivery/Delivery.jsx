import React, { useEffect, Fragment } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./Delivery.module.css";
import images from "../../assets";
import { useState } from "react";

import { getDeliveryProducts, getUserIdFromToken } from "../../api";
import { Grid, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

const config = require("../../config.json");

const Delivery = () => {
  const { publicKey } = useWallet();

  const [deliveries, setDeliveries] = useState([]);
  const [systemTime, setSystemTime] = useState(new Date().getTime());

  useEffect(() => {
    getDeliveryProducts().then((data) => {
      console.log(data);
      if (data?.success) setDeliveries(data.data);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime((old) => old + 1000 * 60);
    }, 1000 * 60);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const temp = deliveries.map((el) => {
      if (el?.status == 1) {
        const date2 = new Date(el?.delivery_start).getTime();
        // const date2 = new Date(el?.created_at).getTime();
        const diffTime = systemTime - date2;
        const hour = Math.floor(diffTime / (1000 * 60 * 60));
        const minute = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        return { ...el, hour: hour, minute: minute };
      } else {
        return { ...el };
      }
    });
    setDeliveries(temp);
  }, [systemTime]);

  return (
    <>
      <div className={Style.product_section}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={1}></Grid>
          <Grid item xs={12} md={11} sx={{ padding: "30px" }}>
            <div className={Style.product_post_section}>
              <h1>Deliveries</h1>
            </div>
            <Grid container>
              <Grid xs={3} md={3} item></Grid>
              <Grid xs={3} md={3} item>
                <Typography sx={{ fontWeight: "bold" }}>Notes</Typography>
              </Grid>
              <Grid
                xs={3}
                md={3}
                sx={{ textAlign: "center", paddingBottom: "30px" }}
                item
              >
                <Typography sx={{ fontWeight: "bold" }}>Drivers</Typography>
              </Grid>
              <Grid xs={3} md={3} item>
                <Typography sx={{ fontWeight: "bold" }}>
                  Timeline/distance
                </Typography>
              </Grid>
              {deliveries &&
                deliveries.map((item, index) => (
                  <Fragment key={index}>
                    <Grid xs={3} md={3} item>
                      {item?.product_id?.product_file != "" ? (
                        <img
                          src={`${config.backend_url}/${item?.product_id?.product_file}`}
                          style={{ maxWidth: "150px", maxHeight: "100px" }}
                          alt="image"
                        />
                      ) : (
                        <Image
                          className={Style.blog_content_bottom_img_1}
                          src={images.assembly}
                          alt="image"
                          style={{ maxWidth: "150px", maxHeight: "100px" }}
                        />
                      )}
                    </Grid>
                    <Grid xs={3} md={3} sx={{}} item>
                      <h2>{item?.product_id?.product_name}</h2>
                      <br />
                      <p>{item?.product_id?.product_desc}</p>
                    </Grid>
                    <Grid xs={3} md={3} sx={{ textAlign: "center" }} item>
                      <Image
                        className={Style.blog_content_bottom_img_1}
                        src={images.technoking}
                        alt="image"
                        style={{
                          maxWidth: "150px",
                          maxHeight: "100px",
                          fontWeight: "bold",
                        }}
                      />
                      <p>Mattew</p>
                    </Grid>
                    <Grid xs={3} md={3} sx={{ alignSelf: "center" }} item>
                      {item?.status == 1 ? (
                        <>
                          <p
                            style={{
                              color: "#0DCA50",
                              fontFamily: "Montserrat",
                              fontSize: "28px",
                              fontWeight: "700",
                            }}
                          >
                            {item?.hour}h
                          </p>
                          <p
                            style={{
                              color: "#577BF9",
                              fontFamily: "Montserrat",
                              fontSize: "24px",
                              fontWeight: "700",
                            }}
                          >
                            {item?.minute}mi
                          </p>
                        </>
                      ) : null}

                      {item?.status == 0 ? (
                        <p
                          style={{
                            color: "#0DCA50",
                            fontFamily: "Montserrat",
                            fontSize: "28px",
                            fontWeight: "700",
                          }}
                        >
                          Waiting...
                        </p>
                      ) : null}

                      {item?.status == 2 ? (
                        <p
                          style={{
                            color: "#0DCA50",
                            fontFamily: "Montserrat",
                            fontSize: "28px",
                            fontWeight: "700",
                          }}
                        >
                          Delivery is ended
                        </p>
                      ) : null}
                    </Grid>
                  </Fragment>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Delivery;
