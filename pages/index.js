import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import HeroSection from "../Components/HeroSection/HeroSection";
import Partners from "../Components/Partners/Partners";
import ProductSections from "../Components/ProductSections/ProductSections";
import EventsSections from "../Components/EventsSections/EventsSections";
import ProjectSections from "../Components/ProjectSections/ProjectSections";
import AiBot from "../Components/AiBot/AiBot";
import SideBar from "../Components/SideBar/SideBar";

export default function Home() {
  const [index, setIndex] = useState(0);

  return (
    <div className={styles.container} style={{ padding: "0% 10%", background:"black" }}>
      <Head>
        <title>Texaglo Hackathon</title>
        <meta name="description" content="Texaglo Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />
      <HeroSection />
      <Partners />
      <ProductSections />
      <EventsSections />
      <ProjectSections />
      <AiBot />
    </div>
  );
}
