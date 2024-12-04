import React, { useEffect, useState } from "react";
import { Modal, Button, Input, message, Spin } from "antd";
import { ipAddress } from "../../../../services/api.ts";

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  dishId: string | null;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  visible,
  onClose,
  dishId,
}) => {
  const [loading, setLoading] = useState(false);
  const [dishData, setDishData] = useState<any>(null);
  const [newDishName, setNewDishName] = useState("");

  useEffect(() => {
    if (dishId) {
      fetchDishData(dishId);
    }
  }, [dishId]);

  const fetchDishData = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${ipAddress}/layDanhSach/${id}`);
      const data = await response.json();
      if (data.success) {
        setDishData(data.dish);
        setNewDishName(data.dish.tenMon);
      } else {
        message.error("Không thể tải thông tin món ăn.");
      }
    } catch (error) {
      console.error("Error fetching dish data:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDish = async () => {
    if (!newDishName.trim()) {
      message.warning("Tên món ăn không được để trống.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ipAddress}/capNhatMonAn/${dishId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenMon: newDishName }),
      });

      const data = await response.json();
      if (data.success) {
        message.success("Cập nhật món ăn thành công!");
        onClose(); // Đóng modal sau khi cập nhật thành công
      } else {
        message.error("Cập nhật món ăn thất bại.");
      }
    } catch (error) {
      console.error("Error updating dish:", error);
      message.error("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ipAddress}/xoaChiTietHoaDon/${dishId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        message.success("Xóa món ăn thành công!");
        onClose(); // Đóng modal sau khi xóa
      } else {
        message.error("Xóa món ăn thất bại.");
      }
    } catch (error) {
      console.error("Error deleting dish:", error);
      message.error("Có lỗi xảy ra khi xóa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title="Tùy chọn món ăn"
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="delete"
          danger
          onClick={handleDeleteDish}
          disabled={loading}
        >
          Xóa
        </Button>,
        <Button
          key="update"
          type="primary"
          onClick={handleUpdateDish}
          disabled={loading}
        >
          Cập nhật
        </Button>,
      ]}
    >
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : dishData ? (
        <div>
          <p>Tên món hiện tại: {dishData.tenMon}</p>
          <Input
            placeholder="Nhập tên mới cho món ăn"
            value={newDishName}
            onChange={(e) => setNewDishName(e.target.value)}
          />
        </div>
      ) : (
        <p>Không có thông tin món ăn.</p>
      )}
    </Modal>
  );
};

export default OptionsModal;
