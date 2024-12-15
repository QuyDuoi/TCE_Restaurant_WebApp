import { Ban } from "../../store/Slices/BanSlice.ts";
import { ipAddress } from "../api.ts";

// Lấy danh sách Ban
export const layDsBan = async (idKhuVuc: string) => {
    try {
      const response = await fetch(`${ipAddress}layDsBan?id_khuVuc=${idKhuVuc}`);
      if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách Bàn');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Lỗi khi lấy danh sách Bàn: ', error);
      return [];
    }
  };
  
  // Thêm mới Bàn
  export const themBan = async (thongTinBan: Ban) => {
    try {
      const response = await fetch(`${ipAddress}addBan`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(thongTinBan),
      });
      if (!response.ok) {
        throw new Error('Lỗi khi thêm mới Bàn');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Lỗi thêm mới Bàn: ', error);
      throw error;
    }
  };
  
  // Cập nhật Bàn
  export const capNhatBan = async (id: string, thongTinBan: Ban) => {
    try {
      console.log('id',id);
      
      const response = await fetch(`${ipAddress}capNhatBan/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(thongTinBan),
      });
      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật Bàn');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Lỗi cập nhật bàn: ', error);
      throw error;
    }
  };
  
  export const layThongTinBan = async (id_Ban: String) => {
    let response: Response | null = null; // Khai báo biến response
    try {
      response = await fetch(`${ipAddress}ban/${id_Ban}`);
      if (!response.ok) {
        throw new Error('Lỗi khi lấy Bàn');
      }
      console.log('Lấy Bàn thành công');
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.log('Lỗi khi lấy Bàn: ', error);
      return [];
    }
  };
export const getBanTheoId = async (id_Ban: String) => {
  let response: Response | null = null; // Khai báo biến response
  try {
    response = await fetch(`${ipAddress}ban/${id_Ban}`);
    if (!response.ok) {
      throw new Error('Lỗi khi lấy Bàn');
    }
    console.log('Lấy Bàn thành công');
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log('Lỗi khi lấy Bàn: ', error);
    return [];
  }
};