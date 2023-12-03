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
import { useGlobal } from "./../context/GlobalContext";

const Dashboard = () => {
  const { selectedSidebarHandle, selectedSidebar} = useGlobal();

  return (
    <>
      <SideBar />

      <SideBarAnalytics setIndex={selectedSidebarHandle}/>

      <div className="dashboard_page">
        <div className="dashboard_top_nav">
          <div className="dashboard_top_title">
            <p>Bump-me</p>
            <h1>DASHBOARD</h1>
          </div>
          <NavProfile />
        </div>
        <div className="dashboard_comp">
          {selectedSidebar == 1 && <CreateProduct />}  {/* create product */}          
          {selectedSidebar == 2 && <CreateStore />}  {/* create store */}
          {selectedSidebar == 3 && <AllProducts />}  {/* all products */}
          {selectedSidebar == 4 && <Delivery />}     {/* deliveries */}
          {selectedSidebar == 5 && <ProductData />}  {/* product */}
          {selectedSidebar == 6 && <DataComp />}     {/* data */}
          {selectedSidebar == 7 && <Customize />}    {/* colors */}
          {selectedSidebar == 8 && <Survey />}       {/* survey */}
          {selectedSidebar == 9 && <AddAi />}        {/* ai */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
