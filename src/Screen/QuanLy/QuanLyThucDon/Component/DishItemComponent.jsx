import React, { useState } from 'react';
import {Button, Dropdown, Menu, Switch} from 'antd';
import {SettingOutlined} from "@ant-design/icons";

const DishItemComponent = ({ dish }) => {
    const [status, setStatus] = useState(dish.trangThai);
    const menu = (
        <Menu>
            <Menu.Item key="1">Chi tiết</Menu.Item>
            <Menu.Item key="2">Chỉnh sửa</Menu.Item>
            <Menu.Item key="3">Xóa</Menu.Item>
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
                height: '100px',
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
                    width: '50%',
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
                    {status ? 'Còn hàng' : 'Hết hàng'}
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
        </div>
    );
};

export default DishItemComponent;
