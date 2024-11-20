import { ipAddress } from "../api.ts";

export const layDsNhanVien = async () => {
    try {
      const response = await fetch(`${ipAddress}layDsNhanVien`);
      if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách Nhan Vien');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Lỗi khi lấy danh sách Nhân Viên: ', error);
      return [];
    }
  };
  
  export const themNhanVien = async (formData: FormData) => {
    try {
      const response = await fetch(`${ipAddress}themNhanVien`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json(); // Nhận thông báo lỗi từ backend
        throw new Error(errorData.msg || 'Lỗi không xác định');
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error: any) {
      console.log('Lỗi thêm mới Nhân viên: ', error.message);
      throw error;
    }
  };
  
  export const capNhatNhanVien = async (id: string, formData: FormData) => {
    try {
      const response = await fetch(`${ipAddress}/capNhatNhanVien/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật Nhân viên');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Lỗi cập nhật Nhân viên: ', error);
      throw error;
    }
  };
  
  export const xoaNhanVien = async (id: string) => {
    try {
      const response = await fetch(`${ipAddress}xoaNhanVien/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi xóa nhân viên');
      }
  
      console.log('Xóa nhân viên thành công');
    } catch (error) {
      console.log('Lỗi khi xóa nhân viên: ', error);
      throw new Error('Lỗi khi xóa nhân viên');
    }
  };
  
  export const checkLogin = async (phoneNumber: string) => {
    try {
      const response = await fetch(`${ipAddress}auth/checkLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({phoneNumber}),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi check login');
      }
  
      const data = await response.json();
  
      if (data.status === '404' || data.status === '403') {
        throw new Error(data.message); // Ném lỗi nếu có vấn đề
      }
  
      return data; // Trả về dữ liệu thành công
    } catch (error: any) {
      return {message: error.message || 'Đã xảy ra lỗi.'}; // Trả về thông điệp lỗi
    }
  };
  
  export const loginNhanVien = async (idToken: string) => {
    try {
      const response = await fetch(`${ipAddress}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`, // Thêm token vào header
        },
      });
      if (!response.ok) {
        throw new Error('Đăng nhập thất bại');
      }
      const data = await response.json();
      return data; // Trả về token và thông tin nhân viên
    } catch (error: any) {
      return error;
    }
  };