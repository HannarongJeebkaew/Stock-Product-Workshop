import React from "react";
import "./Popup.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import NativeSelect from "@mui/material/NativeSelect";
import { Select } from "@mui/material";

const Popup = (props) => {
  return (
    <div className="popup show">
      <div className="popup-content">
        <h2>{props.typeEditData === "adddata" ? "Adddata" : "Editdata"}</h2>
        <form>
          <label>
            ชื่อสินค้า:
            <input
              type="text"
              value={props.product.nameProduct}
              onChange={props.handleChange}
              name="nameProduct"
            />
          </label>
          <label>
            ราคาสินค้า:
            <input
              type="text"
              value={props.product.price}
              onChange={props.handleChange}
              name="price"
            />
          </label>
          <label>
            น้ำหนักสินค้า:
            <input
              type="text"
              value={props.product.weight}
              onChange={props.handleChange}
              name="weight"
            />
          </label>
          <label>
            ประเภทสินค้า:
            {console.log(props.product.typeWeight)}
            <select
              value={props.product.typeWeight}
              onChange={props.handleChange}
              name="typeWeight"
            >
              {props.product.typeWeight==="" ? <option value={props.product.typeWeight} selected>{props.product.typeWeight}</option> : null}
              <option value="กิโลกรัม">กิโลกรัม</option>
              <option value="กรัม">กรัม</option>
              <option value="ปอนด์">ปอนด์</option>
              <option value="ออนซ์">ออนซ์</option>
            </select>
          </label>
        </form>
        <button onClick={props.handleAddDataAndEditData}>Submit</button>
        <button onClick={props.onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
