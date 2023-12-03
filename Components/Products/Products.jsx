import React, { useEffect, useState } from "react";

//INTERNAL IMPORT
import Style from "./Products.module.css";
import BlogCard from "../BlogCard/BlogCard";

import { getProducts } from "../../api";
import { Grid } from "@mui/material";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      if (data.success) setProducts(data.message);
    });
  }, []);

  return (
    <div className={Style.blog_section}>
      <h1 className={Style.blog_section_title}>
        &nbsp;&nbsp;&nbsp;&nbsp;Posted Products
      </h1>
      <Grid container>
        {products.map((product, index) => (
          <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: "20px" }} item key={index}>
            <BlogCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Products;
