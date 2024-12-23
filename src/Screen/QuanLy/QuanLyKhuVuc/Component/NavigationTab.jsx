import React from "react";

const NavigationTab = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "Trống", label: "Bàn trống" },
    { id: "Đã đặt", label: "Bàn đặt" },
    { id: "Đang sử dụng", label: "Bàn đang sử dụng" },
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
            transition: "background-color 0.3s, color 0.3s",
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
