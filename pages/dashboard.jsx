import React, { useState } from "react";
import CreateProduct from "../Components/PostProduct/PostProduct";
import CreateStore from "../Components/CreateStore/CreateStore";
import AllProducts from "../Components/Products/Products";
import Delivery from "../Components/Delivery/Delivery";
import ProductData from "../Components/ProductData/ProductData";
import DataComp from "../Components/DataComp/DataComp";
import Customize from "../Components/Customize/Customize";
import Survey from "../Components/Survey/Survey";
import AddAi from "../Components/AddAi/AddAi";
import NavProfile from "../Components/NavProfile/NavProfile";
import SideBarAnalytics from "../Components/SideBarAnalytics/SideBarAnalytics";
import SideBar from "../Components/SideBar/SideBar";

const Dashboard = () => {
  const [index, setIndex] = useState(1);

  return (
    <>
      <SideBar />

      <SideBarAnalytics setIndex={setIndex}/>

      <div className="dashboard_page">
        <div className="dashboard_top_nav">
          <div className="dashboard_top_title">
            <p>Bump-me</p>
            <h1>DASHBOARD</h1>
          </div>
          <NavProfile />
        </div>
        <div className="dashboard_comp">
          {index == 1 && <CreateProduct />}  {/* create product */}          
          {index == 2 && <CreateStore />}  {/* create store */}
          {index == 3 && <AllProducts />}  {/* all products */}
          {index == 4 && <Delivery />}     {/* deliveries */}
          {index == 5 && <ProductData />}  {/* product */}
          {index == 6 && <DataComp />}     {/* data */}
          {index == 7 && <Customize />}    {/* colors */}
          {index == 8 && <Survey />}       {/* survey */}
          {index == 9 && <AddAi />}        {/* ai */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
