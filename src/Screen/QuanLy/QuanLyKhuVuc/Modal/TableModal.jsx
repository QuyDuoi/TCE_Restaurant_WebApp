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

const TableModal = ({ table,area, isVisible, onClose,onLoading, onUpdateStatus, hoaDonData}) => {
  const [activeOption, setActiveOption] = useState("Đặt bàn"); // Lựa chọn hiện tại

  // Reset trạng thái khi `table` thay đổi hoặc khi modal được mở
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
}, [table, isVisible]);


  // Kiểm tra trạng thái bàn và vô hiệu hóa các nút
  const isButtonDisabled = (action) => {
    if (table.trangThai === "Trống") {
      // Nếu bàn trống
      return ["Xem thông tin hóa đơn", "Xem thông tin bàn đặt", "Hủy đặt bàn"].includes(action);
    } else if (table.trangThai === "Đã đặt") {
      // Nếu bàn đã đặt
      return ["Đặt bàn", "Xem thông tin hóa đơn"].includes(action);
    } else if (table.trangThai === "Đang sử dụng") {
      // Nếu bàn đang sử dụng
      return ["Đặt bàn", "Tạo hóa đơn", "Xem thông tin bàn đặt", "Hủy đặt bàn"].includes(action);
    }
    return false; // Mặc định không vô hiệu hóa
  };

  const renderContent = () => {

    if (!table) return null; // Tránh lỗi nếu không có dữ liệu bàn
    if (activeOption === "Đặt bàn") {
        return <BookingForm table={table} area={area} onSave={onClose} onLoading={onLoading} onUpdateStatus={onUpdateStatus} />;
    } else if (activeOption === "Tạo hóa đơn") {
        return <InvoiceForm table={table} area={area} onSave={onClose} onLoading={onLoading} onUpdateStatus={onUpdateStatus} />;
    } else if (activeOption === "Xem thông tin hóa đơn") {
        return (
            <InvoiceDetails
            table={table}
            area={area}
            hoaDonData={hoaDonData}
            onClose={onClose}
          />
        );
    } else if (activeOption === "Xem thông tin bàn đặt") {
        return <BookedTableDetails table={table} area={area} onClose={onClose} />;
      }
      else if (activeOption === "Hủy đặt bàn") {
        return (
          <CancelBookingForm
            table={table}
            area={area}
            onLoading={onLoading}
            onCancel={onClose}
            onUpdateStatus={onUpdateStatus}
          />
        );
    }
    return null;
  };

  return (
    <Modal
      visible={isVisible}
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
      {/* Lựa chọn bên trái */}
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
          type={activeOption === "Xem thông tin hóa đơn" ? "primary" : "default"}
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
          type={activeOption === "Xem thông tin bàn đặt" ? "primary" : "default"}
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

      {/* Nội dung bên phải */}
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
