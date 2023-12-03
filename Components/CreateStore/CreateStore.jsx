import React, { useEffect } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./CreateStore.module.css";
import images from "../../assets";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

import { createStore, updateStore, uploadImgForItem, getUser } from "../../api";
import { useGlobal } from "../../context/GlobalContext";
import { Grid } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import BumpFileUpload from "./BumpFileUpload";

const config = require("./../../config.json");

const CreateStore = () => {
  const { publicKey } = useWallet();
  const fileInputRef = useRef(null);
  const fileInputBannerRef = useRef(null);
  const { productDataHandle, product_data, editProduct, editProductHandle } =
    useGlobal();

  const [file, setFile] = useState(null);
  const [store_name, setStoreName] = useState("");
  const [store_description, setStoreDescription] = useState("");

  const [categorys, setCategorys] = useState([]); // categorys
  const [currentStore, setCurrentStore] = useState(); // store

  useEffect(() => {
    getUser()
      .then((data) => {
        console.log(data);
        if (data?.success) {
          setCurrentStore(data?.store);
          setStoreName(data?.store?.store_name);
          setStoreDescription(data?.store?.store_desc);
          if (data?.store?.categorys) {
            setCategorys(JSON.parse(data?.store.categorys));
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const CreateHandle = async () => {
    if (!publicKey) {
      toast.warning("Please connect the wallet", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (store_name == "") {
      toast.warning("Please input store name", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (store_description == "") {
      toast.warning("Please input the store description", {
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
    formData.append("store_name", store_name);
    formData.append("store_desc", store_description);
    formData.append("categorys", JSON.stringify(categorys));
    formData.append("wallet", publicKey.toBase58());
    formData.append("edit", false);

    const res = await createStore(formData);
    if (res.success) {
      console.log(res.data);
    }
  };

  const fileUpload = async (e, index) => {
    const formData = new FormData();
    const selectedFile = e.target.files[0];
    formData.append("file", selectedFile);
    formData.append("store", true);

    const res = await uploadImgForItem(formData);
    if (res?.success) {
      console.log("res: ", res);
      setCategorys((prevArray) =>
        prevArray.map((el) =>
          el.name === categorys[index].name ? { ...el, url: res.url } : el
        )
      );
      console.log("categorys:", categorys);
    }
  };

  const editHandle = async () => {
    if (!publicKey) {
      toast.warning("Please connect the wallet", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (store_name == "") {
      toast.warning("Please input store name", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (store_description == "") {
      toast.warning("Please input the store description", {
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
    formData.append("store_name", store_name);
    formData.append("store_desc", store_description);
    formData.append("categorys", JSON.stringify(categorys));
    formData.append("wallet", publicKey.toBase58());

    const res = await updateStore(formData);
    if (res.success) {
      console.log(res.data);
    }
  };

  const addFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    productDataHandle("product_file", URL.createObjectURL(selectedFile));
  };

  const exportHandle = async () => {
    toast.success("Coming soon...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  return (
    <>
      <div className={Style.product_section}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={1}></Grid>
          <Grid item xs={12} md={6} sx={{ padding: "30px" }}>
            <div className={Style.product_post_section}>
              <h1>{currentStore ? "Update" : "Create"} a store</h1>
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
                        <BumpFileUpload
                          click={() => fileInputBannerRef.current.click()}
                          fileInputRef={fileInputBannerRef}
                          addFile={addFile}
                          title={"Add  banner"}
                          height={"120px"}
                          url={currentStore?.store_file}
                        />
                      </div>

                      <div
                        className={Style.content_input}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <h3>Store name</h3>
                        <input
                          type="text"
                          value={store_name}
                          onChange={(e) => {
                            setStoreName(e.target.value);
                          }}
                          style={{
                            maxWidth: "300px",
                            color: "white",
                            textAlign: "center",
                          }}
                          placeholder="Enter Name"
                        />
                        <br />
                        <h3>Description</h3>
                        <textarea
                          value={store_description}
                          onChange={(e) => {
                            setStoreDescription(e.target.value);
                          }}
                          style={{
                            maxWidth: "300px",
                            color: "white",
                            textAlign: "center",
                          }}
                          placeholder="This is description"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className={Style.content_input}></div>

                  <Grid container spacing={3}>
                    {categorys.length > 0 &&
                      categorys.map((item, index) => (
                        <Grid item xs={12} md={3} key={index}>
                          <h5
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Category icon
                          </h5>
                          <BumpFileUpload
                            click={() => fileInputRef.current.click()}
                            fileInputRef={fileInputRef}
                            addFile={(e) => fileUpload(e, index)}
                            title={""}
                            height={"60px"}
                            url={item.url}
                          />
                          <div className={Style.content_input}>
                            <input
                              type="type"
                              placeholder="name"
                              style={{
                                color: "white",
                                textAlign: "center",
                              }}
                              value={item?.name}
                              onChange={(e) => {
                                setCategorys((prevArray) =>
                                  prevArray.map((el) =>
                                    el.name === categorys[index].name
                                      ? { ...el, name: e.target.value }
                                      : el
                                  )
                                );
                              }}
                            />
                          </div>
                        </Grid>
                      ))}
                  </Grid>

                  <div
                    style={{
                      textAlign: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setCategorys((old) => [...old, { name: "", url: "" }]);
                    }}
                  >
                    <h4>Add New Category</h4>
                    <p style={{ fontSize: "30px", marginTop: "0px" }}>{"+"}</p>
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "row", gap: 15 }}
                  >
                    {currentStore ? (
                      <div
                        className={Style.product_order_btn}
                        style={{ maxWidth: "250px" }}
                        onClick={editHandle}
                      >
                        Edit Store
                      </div>
                    ) : (
                      <div
                        className={Style.product_order_btn}
                        style={{ maxWidth: "250px" }}
                        onClick={CreateHandle}
                      >
                        Create Store
                      </div>
                    )}
                    <div
                      className={Style.product_order_btn}
                      style={{ maxWidth: "250px" }}
                      onClick={exportHandle} //
                    >
                      Export Store
                    </div>
                  </div>
                </div>
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

export default CreateStore;
