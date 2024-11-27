import React from "react";

const NavigationTab = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "available", label: "Bàn trống" },
    { id: "booked", label: "Bàn đặt" },
    { id: "in-use", label: "Bàn đang sử dụng" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={{
            margin: "5px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: activeTab === tab.id ? "#1890ff" : "#f0f0f0",
            color: activeTab === tab.id ? "#fff" : "#000",
            cursor: "pointer",

          }}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavigationTab;
