import React, { useState } from "react";

const Dropdown = () => {
  const [showDropDown, setShowDropDown] = useState(false);

  const dropDownHandler = () => {
    setShowDropDown(!showDropDown);
  };

  return <div></div>;
};

export default Dropdown;
