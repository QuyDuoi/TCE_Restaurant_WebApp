import React, { useState, useEffect } from 'react';
import { Select, Button, Modal, Checkbox } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const EmployeeFilter = ({ employees, setFilteredEmployees }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState([]);
    const [localEmployees, setLocalEmployees] = useState(employees);  // State lưu trữ nhân viên đã lọc

    // Filter employees based on selected filters
    const filterEmployees = () => {
        let filtered = [...employees];
        // Filter by status
        if (selectedStatus.length > 0 && !selectedStatus.includes("all")) {
            filtered = filtered.filter(emp =>
                selectedStatus.includes(emp.trangThai ? 'active' : 'inactive')
            );
        }

        // Filter by position
        if (selectedPosition.length > 0 && !selectedPosition.includes("all")) {
            filtered = filtered.filter(emp =>
                selectedPosition.includes(emp.vaiTro)
            );
        }

        // Set filtered employees to the parent component
        setFilteredEmployees(filtered);
        setLocalEmployees(filtered);  // Update local filtered employees
        setIsModalVisible(false);
    };

    // Update the filtered list immediately when status or position changes
    useEffect(() => {
        filterEmployees();
    }, [selectedStatus, selectedPosition]);

    // Open Modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Close Modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '15px', paddingLeft: '15px' }}>
            <Button
                icon={<FilterOutlined />}
                size="small"
                type="primary"
                onClick={showModal}
                style={{ display: 'flex', alignItems: 'center' }}
            >
                Lọc
            </Button>

            {/* Status Filter Select */}
            <Select
                value={selectedStatus.length > 0 ? selectedStatus[0] : 'all'}  // Kiểm tra giá trị hiện tại
                size="small"
                style={{ width: 120 }}
                onChange={(value) => {
                    // Lọc nhân viên khi chọn trạng thái
                    if (value === 'all') {
                        setSelectedStatus([]); // Nếu chọn "Tất cả", reset trạng thái
                    } else {
                        setSelectedStatus([value]); // Lọc theo trạng thái
                    }
                }}
            >
                <Option value="all">Tất cả</Option>
                <Option value="active">Đang hoạt động</Option>
                <Option value="inactive">Ngưng hoạt động</Option>
            </Select>

            {/* Position Filter Select */}
            <Select
                value={selectedPosition.length > 0 ? selectedPosition[0] : 'all'}  // Kiểm tra giá trị hiện tại
                size="small"
                style={{ width: 120 }}
                onChange={(value) => {
                    // Lọc nhân viên khi chọn vị trí
                    if (value === 'all') {
                        setSelectedPosition([]); // Nếu chọn "Tất cả", reset vị trí
                    } else {
                        setSelectedPosition([value]); // Lọc theo vị trí
                    }
                }}
            >
                <Option value="all">Tất cả</Option>
                <Option value="Nhân viên phục vụ">Nhân viên phục vụ</Option>
                <Option value="Thu ngân">Thu ngân</Option>
                <Option value="Chủ quán">Chủ quán</Option>
            </Select>

            {/* Modal for Advanced Filters */}
            <Modal
                title="Lọc nhân viên"
                visible={isModalVisible}
                onOk={filterEmployees}
                onCancel={handleCancel}
                // okText="Áp dụng"
                // cancelText="Hủy"
                footer={null}
            >
                <div style={{ marginBottom: '16px' }}>
                    <strong>Trạng thái</strong>
                    <Checkbox.Group
                        style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}
                        onChange={(checkedValues) => setSelectedStatus(checkedValues)}
                        value={selectedStatus}
                    >
                        <Checkbox value="active">Đang hoạt động</Checkbox>
                        <Checkbox value="inactive">Ngưng hoạt động</Checkbox>
                    </Checkbox.Group>
                </div>
                <div>
                    <strong>Vị trí</strong>
                    <Checkbox.Group
                        style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}
                        onChange={(checkedValues) => setSelectedPosition(checkedValues)}
                        value={selectedPosition}
                    >
                        <Checkbox value="Nhân viên phục vụ">Nhân viên phục vụ</Checkbox>
                        <Checkbox value="Thu ngân">Thu ngân</Checkbox>
                        <Checkbox value="Chủ quán">Chủ quán</Checkbox>
                    </Checkbox.Group>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeeFilter;
