import React from 'react';
import { Modal, Button, Spin } from 'antd';

const DeleteModal = ({ visible, onClose,onLoading, onDelete }) => {
    return (
        <>
        {onLoading && (
        <div style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
        }}>
            <Spin size="large" style={{ color: 'white' }} />
        </div>
    )}
        <Modal
            title="Xóa nhân viên"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="delete" type="primary" danger onClick={onDelete}>
                    Xóa
                </Button>,
            ]}
        >
            <p>Bạn có chắc chắn muốn xóa nhân viên này không?</p>
        </Modal></>
    );
};

export default DeleteModal;