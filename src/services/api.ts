export const ipAddress = `https://tce-restaurant-api.onrender.com/api/`;
// export const ipAddress = `http://localhost:3000/api/`;
export const ipIO = `https://tce-restaurant-api.onrender.com`;

export const searchMonAn = async (textSearch: string, id_nhaHang: string) => {
    try {
      const response = await fetch(
        `${ipAddress}timKiemMonAnWeb?textSearch=${textSearch}&id_nhaHang=${id_nhaHang}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );
      if (!response.ok) {
        throw new Error('Lỗi khi tìm kiếm món ăn');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Lỗi khi tìm kiếm món ăn: ', error);
      return [];
    }
  };

  export const checkLogin = async (idToken: string) => {
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