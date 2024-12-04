import React, { useState } from "react";

const ItemTable = ({ ban, id_khuVuc, khuVucs, onClick }) => {

const urlImgDefault = "https://noithatminhkhoi.com/upload/images/ban-an-hinh-vuong-danh-cho-nha-hang.jpg"; // Ảnh mặc định nếu trạng thái không hợp lệ

  const khuVuc = khuVucs.filter((item) => item._id === id_khuVuc);

  
  // Style nội tuyến
  const styles = {
    container: {
      display: "flex", // Dùng flexbox để ảnh nằm bên trái
      alignItems: "center", // Canh giữa ảnh và nội dung theo chiều dọc
      width: "100%",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    containerHover: {
      transform: "scale(1.05)",
      boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)",
    },
    imageContainer: {
      width: "100px", // Chiều rộng cố định của ảnh
      height: "100px", // Chiều cao khớp với thẻ chứa
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      padding: 10,
    },
    info: {
      padding: "10px 15px",
      flex: 1, // Phần nội dung chiếm toàn bộ không gian còn lại
    },
    title: {
      margin: "5px 0",
      fontSize: "14px",
    },
    status: (status) => ({
      display: "inline-block", // Giữ trạng thái bên cạnh tên bàn
      textAlign: "center",
      padding: "5px 10px",
      color: "#fff",
      borderRadius: "4px",
      fontSize: "12px",
      width:100,
      marginLeft: "auto", // Đẩy trạng thái sang bên phải
      textTransform: "capitalize",
      backgroundColor:
        status === "Trống"
          ? "green"
          : status === "Đã đặt"
          ? "orange"
          : "red",
    }),
  };

  return (
    <div
      style={styles.container}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = styles.containerHover.transform;
        e.currentTarget.style.boxShadow = styles.containerHover.boxShadow;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div style={styles.imageContainer}>
        <img
          src={ban.maQRCode == null ?  urlImgDefault : ban.maQRCode} // Hình ảnh tương ứng trạng thái
          alt={`Hình ảnh của ${ban.tenBan}`}
          style={styles.image}
        />
      </div>
      <div style={styles.info}>
        <p style={styles.title}>
          Khu vực: <strong>{khuVuc[0].tenKhuVuc}</strong>
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Tách tên bàn và trạng thái sang 2 phía
            width: "100%",
          }}
        >
          <p style={styles.title}>Bàn: {ban.tenBan}</p>
          <span style={styles.status(ban.trangThai)}>
            {ban.trangThai === "Trống"
              ? "Bàn trống"
              : ban.trangThai === "Đã đặt"
              ? "Bàn đặt"
              : "Đang sử dụng"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemTable;
