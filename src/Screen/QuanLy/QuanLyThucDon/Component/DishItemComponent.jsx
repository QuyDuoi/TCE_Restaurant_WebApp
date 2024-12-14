import React, { useState } from 'react';
import { Button, Dropdown, Menu, Switch, Modal, Input, message } from 'antd';
import { SettingOutlined } from "@ant-design/icons";
import { ipAddress } from '../../../../services/api.ts'; // Đảm bảo rằng bạn đã import đúng API base URL

const DishItemComponent = ({ dish, onDelete }) => {
    const [status, setStatus] = useState(dish.trangThai);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editDish, setEditDish] = useState(dish);

    // Hàm hiển thị chi tiết món ăn
    const showDetails = () => {
        Modal.info({
            title: 'Chi tiết món ăn',
            content: (
                <div>
                    <p><strong>Tên món: </strong>{dish.tenMon}</p>
                    <p><strong>Giá: </strong>{dish.giaMonAn.toLocaleString()} đ</p>
                    <p><strong>Trạng thái: </strong>{status ? 'Còn hàng' : 'Hết hàng'}</p>
                    <img
                        src={dish.anhMonAn}
                        alt={dish.tenMon}
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                </div>
            ),
            onOk() {},
        });
    };

    // Hàm chỉnh sửa món ăn và gửi yêu cầu PUT tới API
    const handleEdit = async () => {
        try {
            const response = await fetch(`${ipAddress}/capNhatMonAn/${dish._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenMon: editDish.tenMon,
                    giaMonAn: editDish.giaMonAn,
                    trangThai: editDish.trangThai,
                    anhMonAn: editDish.anhMonAn,
                }),
            });

            const data = await response.json();
            if (data.success) {
                message.success('Chỉnh sửa món ăn thành công!');
                setIsModalVisible(false);
            } else {
                message.error('Chỉnh sửa món ăn thất bại!');
            }
        } catch (error) {
            console.error('Error updating dish:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    // Hàm xóa món ăn và gửi yêu cầu DELETE tới API
    const handleDelete = async () => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa món ăn này?',
            onOk: async () => {
                try {
                    const response = await fetch(`${ipAddress}/xoaDanhMuc/${dish._id}`, {
                        method: 'DELETE',
                    });

                    const data = await response.json();
                    if (data.success) {
                        message.success('Xóa món ăn thành công!');
                        onDelete(dish._id);  // Giả sử onDelete được định nghĩa trong component cha
                    } else {
                        message.error('Xóa món ăn thất bại!');
                    }
                } catch (error) {
                    console.error('Error deleting dish:', error);
                    message.error('Có lỗi xảy ra, vui lòng thử lại!');
                }
            },
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={showDetails}>Chi tiết</Menu.Item>
            <Menu.Item key="2" onClick={() => setIsModalVisible(true)}>Chỉnh sửa</Menu.Item>
            <Menu.Item key="3" onClick={handleDelete}>Xóa</Menu.Item>
        </Menu>
    );

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                height: '110px',
                boxSizing: 'border-box',
            }}
        >
            {/* Phần trái: Ảnh món ăn */}
            <div
                style={{
                    width: '20%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img
                    src={dish.anhMonAn}
                    alt={dish.tenMon}
                    style={{
                        width: '90%',
                        height: '90%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
            </div>

            {/* Phần giữa: Tên món và giá */}
            <div
                style={{
                    width: '55%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 8px',
                }}
            >
                <div
                    style={{
                        fontSize: '1.5vw',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                    }}
                >
                    {dish.tenMon}
                </div>
                <div
                    style={{
                        fontSize: '0.9vw',
                        color: 'green',
                    }}
                >
                    {dish.giaMonAn.toLocaleString()} đ
                </div>
            </div>

            {/* Phần phải: Toggle và trạng thái */}
            <div
                style={{
                    width: '20%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Switch
                    checked={status}
                    onChange={() => setStatus(!status)}
                    style={{ marginBottom: '4px'}}
                />
                <div
                    style={{
                        fontSize: '1vw',
                        color: status ? 'green' : 'red',
                        textAlign: 'center',
                    }}
                >
                    {status ? 'Sẵn sàng' : 'Ngưng phục vụ'}
                </div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        icon={<SettingOutlined />}
                        style={{
                            position: 'absolute',
                            bottom: '1px',
                            right: '5px',
                            border: 'none',
                            background: 'transparent',
                        }}
                    />
                </Dropdown>
            </div>

            {/* Modal chỉnh sửa món ăn */}
            <Modal
                title="Chỉnh sửa món ăn"
                visible={isModalVisible}
                onOk={handleEdit}
                onCancel={() => setIsModalVisible(false)}
            >
                <div>
                    <Input
                        value={editDish.tenMon}
                        onChange={(e) => setEditDish({ ...editDish, tenMon: e.target.value })}
                        placeholder="Tên món ăn"
                        style={{ marginBottom: '10px' }}
                    />
                    <Input
                        value={editDish.giaMonAn}
                        onChange={(e) => setEditDish({ ...editDish, giaMonAn: e.target.value })}
                        placeholder="Giá món ăn"
                        style={{ marginBottom: '10px' }}
                    />
                    <Input
                        value={editDish.anhMonAn}
                        onChange={(e) => setEditDish({ ...editDish, anhMonAn: e.target.value })}
                        placeholder="URL ảnh món ăn"
                        style={{ marginBottom: '10px' }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default DishItemComponent;
