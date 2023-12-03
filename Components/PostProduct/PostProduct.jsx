import React, { useEffect } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./PostProduct.module.css";
import images from "../../assets";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

import { createOrder, updateOrder, validateCheck, getUser } from "../../api";
import { useGlobal } from "../../context/GlobalContext";
import { Grid } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import BumpFileUpload from "./BumpFileUpload";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import QRCodeAs from "qrcode";

const htmlToImage = require("html-to-image");
const config = require("./../../config.json");

const PostProduct = () => {
  const { publicKey } = useWallet();
  const fileInputRef = useRef(null);
  const fileInputExcelRef = useRef(null);
  const { productDataHandle, product_data, editProduct, editProductHandle } =
    useGlobal();

  const [file, setFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [product_id, setProductId] = useState(null);
  const [currentStore, setCurrentStore] = useState(); // store

  useEffect(() => {
    getUser()
      .then((data) => {
        if (data?.success) setCurrentStore(data?.store);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const orderCreateHandle = async () => {
    if (!validateCheck(publicKey, product_data, file)) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("product_name", product_data.product_name);
    formData.append("product_cost", product_data.product_cost);
    formData.append("product_desc", product_data.product_desc);
    formData.append("product_type", product_data.product_type);
    formData.append("product_link", product_data.product_link);
    formData.append("product_payment", product_data.product_payment);
    formData.append("product_qrcode", product_data.product_qrcode);
    formData.append("product_category", product_data.product_category);
    formData.append("product_delivery", product_data.product_delivery);
    formData.append("quantity", product_data.quantity);
    formData.append("delivery_cost", product_data?.delivery_cost);

    formData.append("wallet", publicKey.toBase58());

    console.log(product_data);
    console.log(formData);

    const res = await createOrder(formData);
    if (res.success) {
      console.log(res.data);
      console.log("created product id is ", res.data.product_id);
      localStorage.setItem("product_id", res.data.product_id);
      setProductId(res.data.product_id);
    }
  };

  const orderEditHandle = async () => {
    if (!validateCheck(publicKey, product_data, file)) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("product_name", product_data.product_name);
    formData.append("product_cost", product_data.product_cost);
    formData.append("product_desc", product_data.product_desc);
    formData.append("product_type", product_data.product_type);
    formData.append("product_link", product_data.product_link);
    formData.append("product_payment", product_data.product_payment);
    formData.append("product_qrcode", product_data.product_qrcode);
    formData.append("product_category", product_data.product_category);
    formData.append("product_delivery", product_data.product_delivery);
    formData.append("quantity", product_data.quantity);
    formData.append("delivery_cost", product_data?.delivery_cost);

    formData.append("wallet", publicKey.toBase58());
    formData.append("product_id", product_data.product_id);

    console.log(product_data);
    console.log(formData);

    const res = await updateOrder(formData);
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

  const addExcelFile = (e) => {
    const selectedFile = e.target.files[0];
    setExcelFile(selectedFile);
    productDataHandle("product_file", URL.createObjectURL(selectedFile));
  };

  const createQrcodeDownload = async () => {
    if (!product_id) {
      toast.warning("Please create the product first", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    try {
      const qr = await QRCodeAs.toDataURL(
        `${config.frontend_url}/product/${product_id}`
      );
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = qr;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log(product_data);
  }, [product_data]);

  return (
    <>
      <div className={Style.product_section}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={1}></Grid>
          <Grid item xs={12} md={6} sx={{ padding: "30px" }}>
            <div className={Style.product_post_section}>
              <h1>Post a product</h1>
              <div className={Style.product_post_input}>
                <div className={Style.product_data_input}>
                  <div className={Style.toggle_switch_container}>
                    <div
                      style={{
                        display: "flex",
                        marginLeft: "-30px",
                        marginTop: "30px",
                        gap: "30px",
                      }}
                    >
                      <div>
                        <h2 style={{ textAlign: "center" }}>One</h2>
                        <BumpFileUpload
                          click={() => fileInputRef.current.click()}
                          fileInputRef={fileInputRef}
                          addFile={addFile}
                          title={"Add image"}
                          url={product_data?.product_file}
                        />
                      </div>

                      <h3 style={{ alignSelf: "center" }}>or</h3>
                      <div>
                        <h2 style={{ textAlign: "center" }}>Multiple</h2>
                        <BumpFileUpload
                          click={() => fileInputExcelRef.current.click()}
                          fileInputRef={fileInputExcelRef}
                          addFile={addExcelFile}
                          title={"Use Excel"}
                          url={""}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={Style.content_input}>
                    <input
                      type="text"
                      value={product_data?.product_name}
                      onChange={(e) => {
                        productDataHandle("product_name", e.target.value);
                      }}
                      style={{
                        maxWidth: "300px",
                        color: "white",
                        textAlign: "center",
                      }}
                      placeholder="Enter Name"
                    />
                  </div>
                  <div className={Style.content_input}>
                    <input
                      type="text"
                      value={product_data?.product_cost}
                      onChange={(e) => {
                        productDataHandle("product_cost", e.target.value);
                      }}
                      placeholder="Cost"
                      style={{
                        maxWidth: "300px",
                        color: "white",
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <div className={Style.content_input}>
                    <input
                      type="text"
                      value={product_data?.product_des}
                      onChange={(e) => {
                        productDataHandle("product_desc", e.target.value);
                      }}
                      placeholder="Product Description"
                      style={{
                        maxWidth: "300px",
                        color: "white",
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <div className={Style.content_input}>
                    <input
                      type="text"
                      value={product_data?.quantity}
                      onChange={(e) => {
                        productDataHandle("quantity", e.target.value);
                      }}
                      placeholder="Quantity"
                      style={{
                        maxWidth: "300px",
                        color: "white",
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <div className={Style.content_input}>
                    {product_data?.product_delivery == "Delivery" ? (
                      <input
                        type="text"
                        value={product_data?.delivery_cost}
                        onChange={(e) => {
                          productDataHandle("delivery_cost", e.target.value);
                        }}
                        placeholder="Delivery Cost"
                        style={{
                          maxWidth: "300px",
                          color: "white",
                          textAlign: "center",
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className={Style.content_input}>
                    <FormControl
                      style={{
                        borderRadius: "10px",
                        minWidth: "200px",
                        background: "white",
                        color: "black",
                      }}
                    >
                      <Select
                        labelId="delivery-select-label"
                        id="delivery-select"
                        value={product_data?.product_delivery}
                        label="Delivery Method"
                        defaultValue={"Delivery Method"}
                        onChange={(e) => {
                          productDataHandle("product_delivery", e.target.value);
                        }}
                      >
                        <MenuItem value={"Delivery Method"}>
                          Delivery Method
                        </MenuItem>
                        <MenuItem value={"Pickup"}>Pickup</MenuItem>
                        <MenuItem value={"Delivery"}>Delivery</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className={Style.content_input}>
                    <FormControl
                      style={{
                        borderRadius: "10px",
                        minWidth: "200px",
                        background: "white",
                        color: "black",
                      }}
                    >
                      <Select
                        labelId="payment-select-label"
                        id="payment-select"
                        value={product_data?.product_payment}
                        label="Payment Type"
                        defaultValue={"Payment Type"}
                        onChange={(e) => {
                          productDataHandle("product_payment", e.target.value);
                        }}
                      >
                        <MenuItem value={"Payment Type"}>Payment Type</MenuItem>
                        <MenuItem value={"Dollars"}>Dollars</MenuItem>
                        <MenuItem value={"Solana"}>Solana</MenuItem>
                        <MenuItem value={"TLM"}>TLM</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className={Style.content_input}>
                    <FormControl
                      style={{
                        borderRadius: "10px",
                        minWidth: "200px",
                        background: "white",
                        color: "black",
                      }}
                    >
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={product_data?.product_category}
                        label="Category"
                        defaultValue={"Category"}
                        onChange={(e) => {
                          productDataHandle("product_category", e.target.value);
                        }}
                      >
                        <MenuItem value={"Category"}>Category</MenuItem>
                        <MenuItem value={"Physical"}>Physical</MenuItem>
                        <MenuItem value={"Digital"}>Digital</MenuItem>
                        {currentStore &&
                          currentStore?.categorys &&
                          JSON.parse(currentStore?.categorys).map(
                            (item, index) => (
                              <MenuItem value={item.name} key={index}>
                                {item.name}
                              </MenuItem>
                            )
                          )}
                      </Select>
                    </FormControl>
                  </div>

                  {editProduct ? (
                    <div
                      className={Style.product_order_btn}
                      style={{ maxWidth: "300px" }}
                      onClick={orderEditHandle}
                    >
                      Edit Product
                    </div>
                  ) : (
                    <div
                      className={Style.product_order_btn}
                      style={{ maxWidth: "300px" }}
                      onClick={orderCreateHandle}
                    >
                      Create Product
                    </div>
                  )}
                  <div
                    className={Style.product_order_btn}
                    style={{ maxWidth: "300px" }}
                    onClick={createQrcodeDownload}
                  >
                    Download labels
                  </div>
                </div>
              </div>

              <div className={Style.product_post_options_btn}>
                <div className={Style.product_post_toggle}>
                  <div className={Style.toggle_switch_container}></div>
                </div>
                <div className={Style.product_post_toggle}></div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={5}>
            <div className={Style.product_post_card_section}>
              <div className={Style.product_post_card_box}>
                <div className={Style.product_post_card}>
                  <div className={Style.product_post_card_img_box}>
                    <Image
                      src={images.fake_product}
                      alt="image"
                      id="nfc"
                      style={{ maxHeight: "610px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default PostProduct;
