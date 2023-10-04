import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./Product.module.css";
import images from "../../assets";
import { toast } from "react-toastify";
import { getProduct } from "../../api";
import { Grid } from "@mui/material";

const config = require("./../../config.json");

const Product = ({id}) => {
  const [product, setProduct] = useState(null)

  const getProductInfo = async () => {
    const data = {
      product_id: id
    }
    getProduct(data).then(res=>{
      if(res.success) setProduct(res.data)
    })
  };

  useEffect(()=>{
    getProductInfo()
  }, [])

  return (
    <>
      <div className={Style.Product_section}>
        <Grid container spacing={2}>
        <Grid item xs={1} sm={3} md={4} >
        </Grid>
          <Grid item xs={10} sm={6} md={4} >
          <div className={Style.Product_post_card_box}>
            <div className={Style.Product_post_card}>
              <div className={Style.Product_post_card_img_box} style={{background:product?.background_color?product.background_color:null}}>
                {product?.product_file ? (
                      <img
                        src={`${config.backend_url}/${product.product_file}`}
                        alt="product"
                        className={Style.c_v_ctrl_img}
                      />
                    ) : (
                      <Image
                        className={Style.c_v_ctrl_img}
                        src={images.c_v_ctrl}
                        alt="image"
                      />
                    )}
                <div className={Style.Product_post_card_img_content}>
                  <button className={Style.buy_now_btn} style={{background:product?.buy_color?product.buy_color:null}}>BUY NOW</button>
                  <h2>{ product?.product_name } </h2>
                  <p>{ product?.product_desc } </p>
                  <div className={Style.Product_post_card_img_content_btn_one}>
                    <button style={{background:product?.button1_color?product.button1_color:null}}>ADD TO CART</button>
                    <button style={{background:product?.button2_color?product.button2_color:null}}>OPEN PAGE</button>
                  </div>
                  <div className={Style.Product_post_card_img_content_btn_two}>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </Grid>
          <Grid item xs={1} sm={3} md={4} >
        </Grid>
          </Grid>
      </div>
    </>
  );
};



export async function getServerSideProps(context) {
    const { id } = context.query;
  
    return {
      props: {
        id,
      },
    };
  }

export default Product;
