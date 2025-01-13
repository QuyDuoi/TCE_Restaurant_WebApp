import axios from 'axios';
import { ipAddress } from '../../../services/api.ts';

export const checkDongCaLam = async (id_caLamViec: string) => {
  try {
    // Gửi yêu cầu POST đến API
    const response = await axios.post(`${ipAddress}checkDongCaLam`, {
      id_caLamViec, // Gửi id_caLamViec qua body
    });

    // Trả về dữ liệu khi yêu cầu thành công
    return response.data;
  } catch (error: any) {
    // Xử lý lỗi từ phản hồi server
    if (error.response) {
      throw new Error(error.response.data.msg || 'Lỗi từ server.');
    } 
    
    // Xử lý trường hợp không nhận được phản hồi
    else if (error.request) {
      console.error('Không có phản hồi từ server:', error.request);
      throw new Error('Không có phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
    } 
    
    // Xử lý các lỗi khác
    else {
      console.error('Lỗi khác:', error.message);
      throw new Error(error.message || 'Đã xảy ra lỗi.');
    }
  }
};

export const dongCaLam = async (id_caLamViec: string, id_nhanVien: string) => {
  try {
    // Gửi yêu cầu POST đến API
    const response = await axios.post(`${ipAddress}dongCaBatChap`, {
      id_caLamViec,
      id_nhanVien // Gửi id_caLamViec qua body
    });

    // Trả về dữ liệu khi yêu cầu thành công
    return response.data;
  } catch (error: any) {
    // Xử lý lỗi từ phản hồi server
    if (error.response) {
      // console.error('Lỗi từ server:', error.response.data);
      throw new Error(error.response.data.msg || 'Lỗi từ server.');
    } 
    
    // Xử lý trường hợp không nhận được phản hồi
    else if (error.request) {
      console.error('Không có phản hồi từ server:', error.request);
      throw new Error('Không có phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
    } 
    
    // Xử lý các lỗi khác
    else {
      console.error('Lỗi khác:', error.message);
      throw new Error(error.message || 'Đã xảy ra lỗi.');
    }
  }
};
