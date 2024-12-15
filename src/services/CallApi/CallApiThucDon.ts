import { ipAddress } from "../../services/api.ts";
import { DanhMuc } from "../../store/Slices/DanhMucSlice";
import { MonAn } from "../../store/Slices/MonAnSlice";

export const getListDanhMuc = async (
  id_nhaHang: string,
): Promise<DanhMuc[]> => {
  try {
    const response = await fetch(
      `${ipAddress}layDsDanhMuc?id_nhaHang=${id_nhaHang}`,
    );
    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách Danh mục');
    }
    const data = await response.json();
    console.log('Lấy danh mục thành công');
    //console.log(data);
    return data;
  } catch (error) {
    console.log('Lỗi khi lấy danh sách danh mục: ', error);
    return [];
  }
};

export const themDanhMuc = async (danhMuc: DanhMuc): Promise<DanhMuc> => {
  try {
    const response = await fetch(`${ipAddress}themDanhMuc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(danhMuc),
    });
    if (!response.ok) {
      const errorMsg = await response.json();
      throw { msg: errorMsg.msg || 'Lỗi không xác định' };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Lỗi thêm mới danh mục: ', error);
    throw error;
  }
};

export const capNhatDanhMuc = async (
  id: string,
  danhMuc: DanhMuc,
): Promise<DanhMuc> => {
  try {
    const response = await fetch(`${ipAddress}capNhatDanhMuc/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(danhMuc),
    });
    if (!response.ok) {
      const errorMsg = await response.json();
      throw { msg: errorMsg.msg || 'Lỗi không xác định' };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Lỗi cập nhật danh mục: ', error);
    throw error;
  }
};
export const xoaDanhMuc = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${ipAddress}xoaDanhMuc/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Lỗi khi xóa danh mục');
    }
    console.log(`Danh mục với ID ${id} đã được xóa thành công.`);
  } catch (error) {
    console.log('Lỗi khi xóa danh mục: ', error);
    throw error;
  }
};

export const sapXepDanhMuc = async (
  id_nhaHang?: string,
  danhMucs?: any
) => {
  try {
    const response = await fetch(`${ipAddress}sapXepDanhMuc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id_nhaHang, danhMucs),
    });

    if (!response) {
      console.log("Chưa sắp xếp được danh mục!");
    }

  } catch (error) {
    console.log("Lỗi sắp xếp danh mục: " + error);
  }
}

export const getListMonAn = async (id_danhMuc?: String): Promise<MonAn[]> => {
  let response: Response | null = null; // Khai báo biến response
  try {
    if (id_danhMuc) {
      response = await fetch(`${ipAddress}layDsMonAn?id_danhMuc=${id_danhMuc}`);
    } else {
      response = await fetch(`${ipAddress}layDsMonAn`);
    }
    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách Món ăn');
    }
    console.log('Lấy món ăn thành công');
    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.log('Lỗi khi lấy danh sách Món ăn: ', error);
    return [];
  }
};

export const themMonAn = async (formData: FormData): Promise<MonAn> => {
  try {
    const response = await fetch(`${ipAddress}themMonAn`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Lỗi không xác định');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Lỗi thêm mới món ăn: ', error);
    throw error;
  }
};

export const updateMonAn = async (
  id: string,
  formData: FormData,
): Promise<MonAn> => {
  try {
    const response = await fetch(`${ipAddress}updateMonAn/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Lỗi khi cập nhật món Ăn');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log('Lỗi cập nhật món ăn: ', error);
    throw error;
  }
};

export const getMonAnTheoId = async (id_MonAn: String): Promise<MonAn[]> => {
  let response: Response | null = null; // Khai báo biến response
  try {
    response = await fetch(`${ipAddress}monAn/${id_MonAn}`);
    if (!response.ok) {
      throw new Error('Lỗi khi lấy Món ăn');
    }
    console.log('Lấy món ăn thành công');
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log('Lỗi khi lấy Món ăn: ', error);
    return [];
  }
};

export const getMonAn = async (id_nhaHang: String): Promise<MonAn[]> => {
  let response: Response | null = null; // Khai báo biến response
  try {
    response = await fetch(`${ipAddress}layDanhSachThucDon?id_nhaHang=${id_nhaHang}`);
    if (!response.ok) {
      throw new Error('Lỗi khi lấy Món ăn');
    }
    console.log('Lấy món ăn thành công');
    const data = await response.json();
    const monAn = data.flatMap((item) => item.monAns)
    
    // console.log(data);
    return monAn;
  } catch (error) {
    console.log('Lỗi khi lấy Món ăn: ', error);
    return [];
  }
};