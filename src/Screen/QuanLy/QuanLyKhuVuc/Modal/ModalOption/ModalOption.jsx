// ModalOption.jsx
import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import FormThemban from "./FormThemBan.jsx";
import FormThemKhuVuc from "./FormThemKhuVuc.jsx";
import FormCapNhatBan from "./FormCapNhatBan.jsx";
import FormCapNhatKhuVuc from "./FormCapNhatKhuVuc.jsx";
import DanhSachForm from "./DanhSachForm.jsx";
import { fetchKhuVucVaBan } from "../../../../../store/Thunks/khuVucThunks.ts";

const ModalOption = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;

  useEffect(() => {
    if (visible) {
      dispatch(fetchKhuVucVaBan(id_nhaHang));
    }
  }, [visible, dispatch, id_nhaHang]);

  const [activeOption, setActiveOption] = useState(null);

  const renderContent = () => {
    switch (activeOption) {
      case "ThemBan":
        return <FormThemban onClose={onClose} />;
      case "ThemKhuVuc":
        return <FormThemKhuVuc onClose={onClose} />;
      case "CapNhatBan":
        return <FormCapNhatBan />;
      case "CapNhatKhuVuc":
        return <FormCapNhatKhuVuc />;
      default:
        return <div>Vui lòng chọn một chức năng từ bên trái.</div>;
    }
  };

  return (
    <Modal
      title="Lựa chọn chức năng"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width="50vw"
      style={{
        padding: "16px",
        maxHeight: "80vh",
      }}
    >
      <Row gutter={16} style={{ minHeight: "65vh" }}>
        <Col span={6}>
          <DanhSachForm
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />
        </Col>

        <Col span={18} style={{ paddingLeft: "16px", overflowY: "auto" }}>
          {renderContent()}
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalOption;
