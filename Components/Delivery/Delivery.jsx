import React, { useEffect } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./Delivery.module.css";
import images from "../../assets";
import { useState, useRef } from "react";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

import { createOrder, getUserIdFromToken, updateQuantity } from "../../api";
import { useGlobal } from "../../context/GlobalContext";
import { Grid, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

const htmlToImage = require("html-to-image");
const config = require("../../config.json");

const Delivery = () => {
  const { publicKey } = useWallet();
  const fileInputRef = useRef(null);
  const { productDataHandle, product_data, editProduct, editProductHandle } =
    useGlobal();

  const [file, setFile] = useState(null);
  const [product_id, setProductId] = useState(null);
  const [qrcode_value, setQrcodeValue] = useState("");

  const orderCreateHandle = async () => {
    if (!publicKey) {
      toast.warning("Please connect the wallet", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (product_data.product_name == "") {
      toast.warning("Please input product name", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (product_data.product_cost == "") {
      toast.warning("Please input the cost", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (product_data.product_desc == "") {
      toast.warning("Please input the description", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (!file) {
      toast.warning("Please select the file", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("product_name", product_data.product_name);
    formData.append("product_cost", product_data.product_cost);
    formData.append("product_desc", product_data.product_desc);
    formData.append("product_type", product_data.product_type);
    formData.append("product_link", product_data.product_link);
    formData.append("product_payment", product_data.product_payment);
    formData.append("product_qrcode", product_data.product_qrcode);
    formData.append("wallet", publicKey.toBase58());
    formData.append("user_id", getUserIdFromToken());
    formData.append("edit", false);

    console.log(product_data);
    console.log(formData);

    const res = await createOrder(formData);
    setQrcodeValue();
    if (res.success) {
      console.log(res.data);
      console.log("created product id is ", res.data.product_id);
      localStorage.setItem("product_id", res.data.product_id);
      setProductId(res.data.product_id);
    }
  };

  const orderEditHandle = async () => {
    if (!publicKey) {
      toast.warning("Please connect the wallet", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (product_data.product_name == "") {
      toast.warning("Please input product name", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (product_data.product_cost == "") {
      toast.warning("Please input the cost", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (product_data.product_desc == "") {
      toast.warning("Please input the description", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (!file) {
      toast.warning("Please select the file", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("product_name", product_data.product_name);
    formData.append("product_cost", product_data.product_cost);
    formData.append("product_desc", product_data.product_desc);
    formData.append("product_type", product_data.product_type);
    formData.append("product_link", product_data.product_link);
    formData.append("product_payment", product_data.product_payment);
    formData.append("product_qrcode", product_data.product_qrcode);
    formData.append("wallet", publicKey.toBase58());
    formData.append("user_id", getUserIdFromToken());
    formData.append("edit", true);
    formData.append("product_id", product_data.product_id);

    console.log(product_data);
    console.log(formData);

    const res = await createOrder(formData);
    setQrcodeValue();
    if (res.success) {
      console.log(res.data);
      console.log("created product id is ", res.data.product_id);
      localStorage.setItem("product_id", res.data.product_id);
      setProductId(res.data.product_id);
    }
  };

  const addFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    productDataHandle("product_file", URL.createObjectURL(selectedFile));
  };

  const createQuantityAndDownload = async () => {
    if (!product_id) {
      toast.warning("Please create the product first", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    setQrcodeValue(`${config.frontend_url}/product/${product_id}`);

    const formData = {
      product_id,
      quantity: product_data.quantity,
      edit: false,
    };

    console.log("formData-> ", formData);

    const res = await updateQuantity(formData);

    if (res.success && product_data.product_link != "nfc") {
      exportPNG(
        document.querySelector("svg"),
        `${product_data.product_name}_qrcode.png`
      );
    }

    if (res.success && product_data.product_link == "nfc") {
      const qrCodeSvg = document.getElementById("nfc");
      exportPNG(
        document.getElementById("nfc"),
        `${product_data.product_name}_nfc.png`
      );
    }
  };

  const editQuantityAndDownload = async () => {
    if (!editProduct) {
      toast.warning("Please create the product first", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    setQrcodeValue(
      `${config.frontend_url}/product/${product_data?.product_id}`
    );

    const formData = {
      product_id: product_data?.product_id,
      quantity: product_data.quantity,
      edit: true,
    };

    console.log("formData-> ", formData);

    const res = await updateQuantity(formData);

    if (res.success && product_data.product_link != "nfc") {
      exportPNG(
        document.querySelector("svg"),
        `${product_data.product_name}_qrcode.png`
      );
    }

    if (res.success && product_data.product_link == "nfc") {
      const qrCodeSvg = document.getElementById("nfc");
      exportPNG(
        document.getElementById("nfc"),
        `${product_data.product_name}_nfc.png`
      );
    }
  };

  const exportPNG = (dom, file_name) => {
    htmlToImage
      .toPng(dom)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = file_name;
        link.click();
      })
      .catch((error) => {
        console.error("Error while converting SVG to PNG:", error);
      });
  };

  useEffect(() => {
    console.log(product_data);
  }, [product_data]);

  return (
    <>
      <div className={Style.product_section}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={1}></Grid>
          <Grid item xs={12} md={11} sx={{ padding: "30px" }}>
            <div className={Style.product_post_section}>
              <h1>Deliveries</h1>
            </div>
            <Grid container >
              <Grid xs={3} md={3}></Grid>
              <Grid xs={3} md={3}>
                <Typography sx={{ fontWeight: "bold" }}>Notes</Typography>
              </Grid>
              <Grid
                xs={3}
                md={3}
                sx={{ textAlign: "center", paddingBottom: "30px" }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Drivers</Typography>
              </Grid>
              <Grid xs={3} md={3}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Timeline/distance
                </Typography>
              </Grid>
              <Grid xs={3} md={3}>
                <Image
                  className={Style.blog_content_bottom_img_1}
                  src={images.assembly}
                  alt="image"
                  style={{ maxWidth: "150px", maxHeight: "100px" }}
                />
              </Grid>
              <Grid xs={3} md={3} sx={{}}>
                <h2>Notes</h2>
                <br />
                <p>
                  Sour Cream & Onion. Some more information about the product
                  continued and continues below
                </p>
              </Grid>
              <Grid xs={3} md={3} sx={{ textAlign: "center" }}>
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
              <Grid xs={3} md={3} sx={{ alignSelf: "center" }}>
                <p
                  style={{
                    color: "#0DCA50",
                    fontFamily: "Montserrat",
                    fontSize: "28px",
                    fontWeight: "700",
                  }}
                >
                  5h
                </p>
                <p
                  style={{
                    color: "#577BF9",
                    fontFamily: "Montserrat",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  25mi
                </p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Delivery;
