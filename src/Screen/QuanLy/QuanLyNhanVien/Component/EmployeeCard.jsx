import React from 'react';
import { Card } from 'antd';

const EmployeeCard = ({ hoTen, vaiTro, trangThai, hinhAnh }) => {
    return (
        <Card
            hoverable
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                padding: '10px',
            }}
        >
            {/* Phần Ảnh */}
            <div
                style={{
                    width: '80px',
                    height: '80px',
                    backgroundImage: `url(${hinhAnh})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '50%',
                    marginRight: '16px',
                }}
            />

            {/* Phần Nội dung */}
            <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', fontSize: '16px', margin: 0 }}>Họ tên: {hoTen}</p>
                <p style={{ margin: 0 }}>Chức vụ: {vaiTro}</p>
            </div>

            {/* Tùy chỉnh Chấm trạng thái */}
            <div
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: trangThai ? '#52c41a' : '#d9d9d9',
                    borderRadius: '50%',
                    border: '2px solid white',
                }}
            />
        </Card>
    );
};

export default EmployeeCard;
