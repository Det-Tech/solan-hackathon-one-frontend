import React from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./ProjectsSections.module.css";
import ProjectCard from "../ProjectCard/ProjectCard";

const ProjectsSections = () => {
  return (
    <div className={Style.project_section}>
      <h1 className={Style.project_section_title}>Projects</h1>
      <div className={Style.project_card_list}>
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </div>
  );
};

export default ProjectsSections;
