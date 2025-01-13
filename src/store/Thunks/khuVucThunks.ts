import { createAsyncThunk } from '@reduxjs/toolkit';
import {addKhuVuc, getListKhuVuc, updateKhuVuc} from '../../services/CallApi/CallApiKhuVuc.ts'; // Đường dẫn tới API tương ứng
import { KhuVuc } from '../Slices/KhuVucSlice.ts';
import { setBans } from '../Slices/BanSlice.ts';

// Thunk để fetch danh sách khu vực
export const fetchKhuVucVaBan = createAsyncThunk(
    'khuVucs/fetchKhuVucVaBan',
    async (id_nhaHang: string, thunkAPI) => {
      try {
        const data = await getListKhuVuc(id_nhaHang); // Gọi API để lấy danh sách khu vực
        
        const bansData = data.flatMap(item => item.bans);
        if (bansData.length > 0) {
          thunkAPI.dispatch(setBans(bansData));
        } else {
          console.log("Không có món ăn nào để dispatch.");
        }

        return data; // Trả về dữ liệu
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message || 'Error fetching KhuVuc');
      }
    },
  );
  
  export const themKhuVucThunk = createAsyncThunk(
    'khuVucs/themKhuVuc',
    async (khuVuc: KhuVuc, thunkAPI) => {
      try {
        const data = await addKhuVuc(khuVuc);
        return data;
      } catch (error: any) {
        console.log('Lỗi thêm mới:', error);
        return thunkAPI.rejectWithValue(error.message || 'Error adding KhuVuc');
      }
    },
  );
  
  export const capNhatKhuVucThunk = createAsyncThunk(
    'khuVucs/capNhatKhuVuc',
    async ({id, formData}: {id: string; formData: KhuVuc}, thunkAPI) => {
      try {
        const data = await updateKhuVuc(id, formData);
        return data;
      } catch (error: any) {
        console.log('Lỗi cập nhật:', error);
        return thunkAPI.rejectWithValue(error.message || 'Error updating KhuVuc');
      }
    },
  );
