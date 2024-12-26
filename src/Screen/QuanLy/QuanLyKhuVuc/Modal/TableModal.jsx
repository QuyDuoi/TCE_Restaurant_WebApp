import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import {
  CalendarOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import BookingForm from "./BookingForm";
import InvoiceForm from "./InvoiceForm";
import InvoiceDetails from "./InvoiceDetails";
import BookedTableDetails from "./BookedTableDetails";
import CancelBookingForm from "./CancelBookingForm";

const TableModal = ({
  table,
  area,
  isVisible,
  onClose,
  onLoading,
  onUpdateStatus,
  thongTinHoaDons,
}) => {
  const [activeOption, setActiveOption] = useState("Đặt bàn"); // Current selection
  const [hoaDonData, setHoaDonData] = useState({}); // Manage hoaDonData state

  // Reset state when `table` changes or modal is opened
  useEffect(() => {
    if (table) {
      if (table.trangThai === "Trống") {
        setActiveOption("Đặt bàn");
      } else if (table.trangThai === "Đã đặt") {
        setActiveOption("Tạo hóa đơn");
      } else if (table.trangThai === "Đang sử dụng") {
        setActiveOption("Xem thông tin hóa đơn");
      }
    }
    const hoaDonBan = Array.isArray(thongTinHoaDons)
      ? thongTinHoaDons.find((hoaDon) => hoaDon.id_ban === table._id)
      : undefined;
    setHoaDonData(hoaDonBan);
  }, [table, isVisible, thongTinHoaDons]);

  // Disable buttons based on table status
  const isButtonDisabled = (action) => {
    if (table.trangThai === "Trống") {
      return [
        "Xem thông tin hóa đơn",
        "Xem thông tin bàn đặt",
        "Hủy đặt bàn",
      ].includes(action);
    } else if (table.trangThai === "Đã đặt") {
      return ["Đặt bàn", "Xem thông tin hóa đơn"].includes(action);
    } else if (table.trangThai === "Đang sử dụng") {
      return [
        "Đặt bàn",
        "Tạo hóa đơn",
        "Xem thông tin bàn đặt",
        "Hủy đặt bàn",
      ].includes(action);
    }
    return false; // Default not disabled
  };

  // Handler to receive new hoaDonData and switch to InvoiceDetails
  const handleCreateInvoice = (newHoaDonData) => {
    setHoaDonData(newHoaDonData);
    setActiveOption("Xem thông tin hóa đơn");
  };

  const renderContent = () => {
    if (!table) return null; // Avoid errors if no table data

    switch (activeOption) {
      case "Đặt bàn":
        return (
          <BookingForm
            table={table}
            area={area}
            onSave={onClose}
            onLoading={onLoading}
            onUpdateStatus={onUpdateStatus}
          />
        );
      case "Tạo hóa đơn":
        return (
          <InvoiceForm
            table={table}
            area={area}
            onCreateInvoice={handleCreateInvoice}
            onLoading={onLoading}
            onUpdateStatus={onUpdateStatus}
          />
        );
      case "Xem thông tin hóa đơn":
        return (
          <InvoiceDetails
            table={table}
            area={area}
            hoaDonData={hoaDonData}
            onClose={onClose}
          />
        );
      case "Xem thông tin bàn đặt":
        return (
          <BookedTableDetails table={table} area={area} onClose={onClose} />
        );
      case "Hủy đặt bàn":
        return (
          <CancelBookingForm
            table={table}
            area={area}
            onLoading={onLoading}
            onCancel={onClose}
            onUpdateStatus={onUpdateStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width="70%"
      style={{
        top: "5%",
        margin: "0 auto",
        height: "550px",
      }}
      bodyStyle={{
        height: "550px",
        display: "flex",
        gap: "16px",
        overflow: "hidden",
        padding: "6px",
      }}
    >
      {/* Left Options */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #e5e5e5",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "100%",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "16px" }}>Tùy chọn</h3>
        <Button
          block
          type={activeOption === "Đặt bàn" ? "primary" : "default"}
          icon={<CalendarOutlined />}
          onClick={() => setActiveOption("Đặt bàn")}
          disabled={isButtonDisabled("Đặt bàn")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "8px",
            height: "40px",
          }}
        >
          Đặt bàn
        </Button>
        <Button
          block
          type={activeOption === "Tạo hóa đơn" ? "primary" : "default"}
          icon={<FileTextOutlined />}
          onClick={() => setActiveOption("Tạo hóa đơn")}
          disabled={isButtonDisabled("Tạo hóa đơn")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "8px",
            height: "40px",
          }}
        >
          Tạo hóa đơn
        </Button>
        <Button
          block
          type={
            activeOption === "Xem thông tin hóa đơn" ? "primary" : "default"
          }
          icon={<FileSearchOutlined />}
          onClick={() => setActiveOption("Xem thông tin hóa đơn")}
          disabled={isButtonDisabled("Xem thông tin hóa đơn")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "8px",
            height: "40px",
          }}
        >
          Xem thông tin hóa đơn
        </Button>
        <Button
          block
          type={
            activeOption === "Xem thông tin bàn đặt" ? "primary" : "default"
          }
          icon={<InfoCircleOutlined />}
          onClick={() => setActiveOption("Xem thông tin bàn đặt")}
          disabled={isButtonDisabled("Xem thông tin bàn đặt")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "8px",
            height: "40px",
          }}
        >
          Xem thông tin bàn đặt
        </Button>
        <Button
          block
          type={activeOption === "Hủy đặt bàn" ? "primary" : "default"}
          icon={<DeleteOutlined />}
          onClick={() => setActiveOption("Hủy đặt bàn")}
          disabled={isButtonDisabled("Hủy đặt bàn")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "8px",
            height: "40px",
          }}
        >
          Hủy đặt bàn
        </Button>
      </div>

      {/* Right Content */}
      <div
        style={{
          width: "70%",
          padding: "16px",
          overflowY: "auto",
          height: "100%",
        }}
      >
        {renderContent()}
      </div>
    </Modal>
  );
};

export default TableModal;
