// FunctionList.jsx
import React from "react";
import { Button } from "antd";

const DanhSachForm = ({ activeOption, setActiveOption }) => {
  const functions = [
    { key: "ThemBan", label: "Thêm bàn" },
    { key: "ThemKhuVuc", label: "Thêm khu vực" },
    { key: "CapNhatBan", label: "Cập nhật bàn" },
    { key: "CapNhatKhuVuc", label: "Cập nhật khu vực" },
  ];

  return (
    <>
      {functions.map((func) => (
        <Button
          key={func.key}
          type={activeOption === func.key ? "primary" : "default"}
          block
          style={{ marginBottom: "8px" }}
          onClick={() => setActiveOption(func.key)}
        >
          {func.label}
        </Button>
      ))}
    </>
  );
};

export default DanhSachForm;
