

import { Button, Modal } from "antd"

const NotificationModal = ({ notificationMessage, notificationVisible, setNotificationVisible }) => {
    return (
        <Modal
            title="Thông báo"
            visible={notificationVisible}
            onOk={() => setNotificationVisible(false)} // Đảm bảo gọi hàm này
            onCancel={() => setNotificationVisible(false)} // Đảm bảo gọi hàm này
            footer={[
                <Button key="ok" onClick={() => setNotificationVisible(false)}>
                    OK
                </Button>,
            ]}
        >
            <p>{notificationMessage}</p>
        </Modal>
    )
}

export default NotificationModal;
