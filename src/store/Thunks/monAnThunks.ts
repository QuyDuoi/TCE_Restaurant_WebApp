import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMonAnTheoId, themMonAn, updateMonAn } from '../../services/CallApi/CallApiThucDon.ts';
import { ipAddress } from "../../services/api";

// Thunk để thêm món ăn mới
export const themMonAnMoi = createAsyncThunk(
  'monAns/themMonAn',
  async (formData: FormData, thunkAPI) => {
    try {
      const data = await themMonAn(formData);
      return data;
    } catch (error: any) {
      console.log('Lỗi thêm mới:', error);
      return thunkAPI.rejectWithValue(error.message || 'Lỗi khi thêm món ăn');
    }
  }
);

// Thunk để cập nhật món ăn
export const updateMonAnThunk = createAsyncThunk(
  'monAns/updateMonAn',
  async ({ id, formData }: { id: string; formData: FormData }, thunkAPI) => {
    try {
      const data = await updateMonAn(id, formData);
      
      return data;
    } catch (error: any) {
      console.log('Lỗi cập nhật:', error);
      return thunkAPI.rejectWithValue(error.message || 'Lỗi khi cập nhật món ăn');
    }
  }
);

// Thunk để cập nhật trạng thái món ăn
export const updateStatusMonAnThunk = createAsyncThunk(
  'monAns/updateStatusMonAn',
  async ({ id, trangThai }: { id: string; trangThai: boolean }, thunkAPI) => {
    try {
      const response = await fetch(`${ipAddress}capNhatTrangThaiMon/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({trangThai}),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái món Ăn');
      }
      const data = await response.json();
      console.log(data);
      
      return data;
    } catch (error: any) {
      console.log('Lỗi cập nhật:', error);
      return thunkAPI.rejectWithValue(error.message || 'Lỗi khi cập nhật trạng thái món ăn');
    }
  }
);

// Thunk để fetch món ăn theo ID
export const fetchMonAnTheoId = createAsyncThunk(
  'monAns/fetchMonAnTheoId',
  async (id_MonAn: string) => {
    const data = await getMonAnTheoId(id_MonAn);
    return data; // Trả về dữ liệu
  }
);
