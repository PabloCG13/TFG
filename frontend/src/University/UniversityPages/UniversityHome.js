import React from "react";
import UniversityHomeHeader from "./UniversityHomeHeader"; 
import UniversityHomeBody from "./UniversityHomeBody"; 
import UniversityHomeFooter from "./UniversityHomeFooter"; 
import  { useParams } from "react-router-dom";

const UniversityHome = () => {
  const  {uniCode} = useParams();
  return (
    <div>
      <UniversityHomeHeader />
      <UniversityHomeBody uniCode ={uniCode} />
      <UniversityHomeFooter />
    </div>
  );
};

export default UniversityHome;
