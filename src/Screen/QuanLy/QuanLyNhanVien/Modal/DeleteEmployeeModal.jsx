import React from 'react';
import { Modal, Button } from 'antd';

const DeleteModal = ({ visible, onClose, onDelete }) => {
    return (
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
        </Modal>
    );
};

export default DeleteModal;