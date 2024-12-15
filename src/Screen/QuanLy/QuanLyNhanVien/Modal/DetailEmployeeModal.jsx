import React from 'react';
import { Modal } from 'antd';

const DetailModal = ({ visible, onClose, employee }) => {

    return (

        <Modal
            title={
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Chi tiết nhân viên</div>
            }
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={300}
        >
            {employee ? (
                <div>
                    <div style={{display:'flex', justifyContent:'center'}}>
                    <img 
                    style={{
                        width: '200px',
                            height: '200px',
                            textAlign:'center',
                            backgroundSize: 'cover',
                            borderRadius: '50%',
                            objectFit:'cover',
                            marginRight: '16px',
                    }}
                        src={employee.hinhAnh} // Giả sử bạn có trường 'hinhAnh' chứa URL ảnh
                        alt={employee.hoTen}
                        
                    />
                    </div>
                    <p><strong>Họ tên:</strong> {employee.hoTen}</p>
                    <p><strong>Chức vụ:</strong> {employee.vaiTro}</p>
                    <p><strong>Số điện thoại:</strong> {employee.soDienThoai}</p>
                    <p><strong>Số CCCD:</strong> {employee.cccd}</p>
                    <p><strong>Trạng thái:</strong> {employee.trangThai ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                    {/* Thêm các thông tin khác nếu cần */}
                </div>
            ) : (
                <p>Không có thông tin nhân viên.</p>
            )}
        </Modal>
    );
};

export default DetailModal;