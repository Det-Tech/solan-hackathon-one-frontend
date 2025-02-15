import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./SideBar.module.css";
import images from "../../assets";
import { useGlobal } from "../../context/GlobalContext";
import { useRouter } from "next/router";
import { Grid, Hidden } from "@mui/material";

const config = require("./../../config.json");

const SideBar = () => {
  const {
    activeSubMenuHandle,
    activeNavbarHandle,
    downSubMenuHandle,
    responseVisible,
    responsiveVisibleHandle,
  } = useGlobal();
  const router = useRouter();
  return (
    <>
      <Hidden mdDown>
        <div className={Style.nav}>
          <Image
            className={Style.nav_pic}
            src={images.navpic}
            alt="image"
            onClick={() => {
              if (router.pathname == "/") {
                router.push("/dashboard");
              } else {
                router.push("/");
              }
            }}
          />
          <div className={Style.nav_icons}>
            <div className={Style.icon_top}>
              <hr />
              <Image
                className={Style.nav_icon_img}
                src={images.rocket}
                alt="image"
                onClick={() => {
                  activeSubMenuHandle();
                  activeNavbarHandle(0);
                }}
              />
              <Image
                className={Style.nav_icon_img}
                src={images.book}
                alt="image"
                onClick={() => {
                  activeSubMenuHandle();
                  activeNavbarHandle(1);
                }}
              />
              <Image
                className={Style.nav_icon_img}
                src={images.tool}
                alt="image"
                onClick={() => {
                  activeSubMenuHandle();
                  activeNavbarHandle(2);
                }}
              />
            </div>

            <div className={Style.icon_bottom}>
              <div
                onClick={() => {
                  window.open(config.discord, "_blank");
                }}
              >
                <Image
                  className={Style.nav_icon_img}
                  src={images.discord}
                  alt="image"
                />
              </div>
              <hr />
              <div
                onClick={() => {
                  window.open(config.twitter, "_blank");
                }}
              >
                <Image
                  className={Style.nav_icon_img}
                  src={images.twitter}
                  alt="image"
                />
              </div>
              <div
                onClick={() => {
                  window.open(config.youtube, "_blank");
                }}
              >
                <Image
                  className={Style.nav_icon_img}
                  src={images.youtube}
                  alt="image"
                />
              </div>
              <div
                onClick={() => {
                  window.open(config.github, "_blank");
                }}
              >
                <Image
                  className={Style.nav_icon_img}
                  src={images.github}
                  alt="image"
                />
              </div>
            </div>
          </div>
        </div>
      </Hidden>
      <Hidden mdUp>
        <div className={Style.nav_responsive}>
          <Image
            className={Style.nav_responsive_pic}
            src={images.down}
            alt="image"
            onClick={() => {
              downSubMenuHandle();
              responsiveVisibleHandle();
            }}
          />
        </div>
        {responseVisible ? (
          <div className={Style.nav}>
            <Image
              className={Style.nav_pic}
              src={images.navpic}
              alt="image"
              onClick={() => {
                if (router.pathname == "/") {
                  router.push("/dashboard");
                } else {
                  router.push("/");
                }
              }}
            />
            <div className={Style.nav_icons}>
              <div className={Style.icon_top}>
                <hr />
                <Image
                  className={Style.nav_icon_img}
                  src={images.rocket}
                  alt="image"
                  onClick={() => {
                    activeNavbarHandle(0);
                    activeSubMenuHandle();
                  }}
                />
                <Image
                  className={Style.nav_icon_img}
                  src={images.book}
                  alt="image"
                  onClick={() => {
                    activeNavbarHandle(1);
                    activeSubMenuHandle();
                  }}
                />
                <Image
                  className={Style.nav_icon_img}
                  src={images.tool}
                  alt="image"
                  onClick={() => {
                    activeNavbarHandle(2);
                    activeSubMenuHandle();
                  }}
                />
              </div>

              <div className={Style.icon_bottom}>
                <div
                  onClick={() => {
                    window.open(config.discord, "_blank");
                  }}
                >
                  <Image
                    className={Style.nav_icon_img}
                    src={images.discord}
                    alt="image"
                  />
                </div>
                <hr />
                <div
                  onClick={() => {
                    window.open(config.twitter, "_blank");
                  }}
                >
                  <Image
                    className={Style.nav_icon_img}
                    src={images.twitter}
                    alt="image"
                  />
                </div>
                <div
                  onClick={() => {
                    window.open(config.youtube, "_blank");
                  }}
                >
                  <Image
                    className={Style.nav_icon_img}
                    src={images.youtube}
                    alt="image"
                  />
                </div>
                <div
                  onClick={() => {
                    window.open(config.github, "_blank");
                  }}
                >
                  <Image
                    className={Style.nav_icon_img}
                    src={images.github}
                    alt="image"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Hidden>
    </>
  );
};

export default SideBar;
