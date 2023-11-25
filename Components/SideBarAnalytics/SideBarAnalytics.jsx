import React, { useState, useContext } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./SideBarAnalytics.module.css";
import images from "../../assets";
import { useGlobal } from "../../context/GlobalContext";
import { Grid, Hidden } from '@mui/material';

const SideBarAnalytics = ({ setIndex }) => {
  const {activeSubMenu, activeSubMenuHandle, activeNavbar, responseVisible} = useGlobal();

  return (
    <>
     <Hidden mdDown>
        <div className={Style.nav_analytics} style={{ display: activeSubMenu? "block": "none" }}>
          <div className={Style.nav_analytics_cancel_btn} onClick={()=>activeSubMenuHandle()}>
            <Image
              className={Style.left_double_arrow}
              src={images.left_double_arrow}
              alt="image"
            />
            <p>Cancel</p>
          </div>
          <div className={Style.nav_analytics_title}>
            {activeNavbar == 0? <h1 className="navbar_title" style={{ display: "flex",justifyContent: "center"}}>Products</h1>:null}
            {activeNavbar == 1? <h1 className="navbar_title" style={{ display: "flex",justifyContent: "center"}}>Analytics</h1>:null}
            {activeNavbar == 2? <h1 className="navbar_title" style={{ display: "flex",justifyContent: "center"}}>Design</h1>:null}
            {activeNavbar == 0? <h3 className="navbar_title" style={{ display: "flex",justifyContent: "left", paddingLeft:"15px"}}><br/>Real time</h3>:null}
            {activeNavbar == 1? <h3 className="navbar_title" style={{ display: "flex",justifyContent: "left", paddingLeft:"15px"}}>{"\n"} <br/>Real time</h3>:null}
            {activeNavbar == 2? <h3 className="navbar_title" style={{ display: "flex",justifyContent: "left", paddingLeft:"15px"}}>{"\n"} <br/>Elements</h3>:null}
          </div>
          <div className={Style.nav_analytics_btn_list}>
            {
              activeNavbar == 0? <>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(1)}
                >
                  Create Product
                </div>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(2)}
                >
                  Create Store
                </div>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(3)}
                >
                  All Products
                </div>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(4)}
                >
                  Deliveries
                </div>
                </>: null
            }
            {
              activeNavbar == 1? <>
                  <div
                    className={Style.nav_analytics_btn_single}
                    onClick={() => setIndex(5)}
                  >
                    Product
                  </div>
                  <div
                    className={Style.nav_analytics_btn_single}
                    onClick={() => setIndex(6)}
                  >
                    Data
                  </div>
                </>
                :null
            }
            {
              activeNavbar == 2? <>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(7)}
                >
                  Colors
                </div>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(8)}
                >
                  Survey
                </div>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(9)}
                >
                  Ai
                </div>
              </>:null
            }
          </div>
        </div>
      </Hidden>
      <Hidden mdUp>
      {responseVisible?
        <div className={Style.nav_analytics} style={{ display: activeSubMenu? "block": "none" }}>
        <div className={Style.nav_analytics_cancel_btn} onClick={()=>activeSubMenuHandle()}>
          <Image
            className={Style.left_double_arrow}
            src={images.left_double_arrow}
            alt="image"
          />
          <p>Cancel</p>
        </div>
        <div className={Style.nav_analytics_title}>
          {activeNavbar == 0? <h1 className="navbar_title" style={{ display: "flex",justifyContent: "center"}}>Products</h1>:null}
          {activeNavbar == 1? <h1 className="navbar_title" style={{ display: "flex",justifyContent: "center"}}>Analytics</h1>:null}
          {activeNavbar == 2? <h1 className="navbar_title" style={{ display: "flex",justifyContent: "center"}}>Design</h1>:null}
          {activeNavbar == 0? <h3 className="navbar_title" style={{ display: "flex",justifyContent: "left", paddingLeft:"15px"}}><br/>Real time</h3>:null}
          {activeNavbar == 1? <h3 className="navbar_title" style={{ display: "flex",justifyContent: "left", paddingLeft:"15px"}}>{"\n"} <br/>Real time</h3>:null}
          {activeNavbar == 2? <h3 className="navbar_title" style={{ display: "flex",justifyContent: "left", paddingLeft:"15px"}}>{"\n"} <br/>Elements</h3>:null}
        </div>
        <div className={Style.nav_analytics_btn_list}>
          {
            activeNavbar == 0? <>
              <div
                className={Style.nav_analytics_btn_single}
                onClick={() => setIndex(1)}
              >
                Create Product
              </div>
              <div
                className={Style.nav_analytics_btn_single}
                onClick={() => setIndex(2)}
              >
                Create Store
              </div>
              <div
                className={Style.nav_analytics_btn_single}
                onClick={() => setIndex(3)}
              >
                All Products
              </div>
              <div
                className={Style.nav_analytics_btn_single}
                onClick={() => setIndex(4)}
              >
                Deliveries
              </div>
              </>: null
          }
          {
            activeNavbar == 1? <>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(5)}
                >
                  Product
                </div>
                <div
                  className={Style.nav_analytics_btn_single}
                  onClick={() => setIndex(6)}
                >
                  Data
                </div>
              </>
              :null
          }
          {
            activeNavbar == 2? <>
              <div
                className={Style.nav_analytics_btn_single}
                onClick={() => setIndex(7)}
              >
                Colors
              </div>
              <div
                className={Style.nav_analytics_btn_single}
                onClick={() => setIndex(8)}
              >
                Survey
              </div>
              <div
                className={Style.nav_analytics_btn_single}
                onClick={() => setIndex(9)}
              >
                Ai
              </div>
            </>:null
          }
        </div>
        </div>
        : null}
      </Hidden>
    </>
  );
};

export default SideBarAnalytics;
