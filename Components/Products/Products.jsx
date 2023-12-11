import React, { useEffect, useState, Suspense } from "react";

//INTERNAL IMPORT
import Style from "./Products.module.css";
// @ts-ignore
import ProductCard from "../ProductCard/ProductCard";

import { getProducts } from "../../api";
import { Grid } from "@mui/material";
import Loading from "../Loading/Loading";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProducts().then((data) => {
      if (data.success) setProducts(data.message);
      setLoading(false);
    });
  }, []);

  return (
    <Suspense fallback={<Loading></Loading>}>
      {!loading ? (
        <div className={Style.blog_section}>
          <h1 className={Style.blog_section_title}>
            &nbsp;&nbsp;&nbsp;&nbsp;Posted Products
          </h1>
          <Grid container>
            {products.map((product, index) => (
              <Grid
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{ padding: "20px" }}
                item
                key={index}
              >
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </div>
      ) : (
        <Loading />
      )}
    </Suspense>
  );
};

export default Products;
