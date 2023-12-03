import React, { useState } from "react";
import CreateProduct from "../components/PostProduct/PostProduct";
import CreateStore from "../components/CreateStore/CreateStore";
import AllProducts from "../components/Products/Products";
import Delivery from "../components/Delivery/Delivery";
import ProductData from "../components/ProductData/ProductData";
import DataComp from "../components/DataComp/DataComp";
import Customize from "../components/Customize/Customize";
import Survey from "../components/Survey/Survey";
import AddAi from "../components/AddAi/AddAi";
import NavProfile from "../components/NavProfile/NavProfile";
import SideBarAnalytics from "../components/SideBarAnalytics/SideBarAnalytics";
import SideBar from "../components/SideBar/SideBar";
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
