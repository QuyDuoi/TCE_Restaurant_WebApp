import { createAsyncThunk } from "@reduxjs/toolkit";
import { DanhMuc } from "../Slices/DanhMucSlice";
import { capNhatDanhMuc, themDanhMuc, xoaDanhMuc } from "../../screens/QuanLyThucDon/CallApiThucDon";
import { setMonAns } from '../Slices/MonAnSlice'; // Action để lưu món ăn vào MonAnSlice
import { ipAddress } from '../../services/api';

export const fetchDanhMucVaMonAn = createAsyncThunk(
    'danhMucs/fetchDanhMucVaMonAn',
    async (id_nhaHang: string, thunkAPI) => {
      try {        
        const response = await fetch(`${ipAddress}layDanhSachThucDon?id_nhaHang=${id_nhaHang}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        const monAnsData = data.flatMap(item => item.monAns);
        console.log("Dữ liệu món ăn:", monAnsData);
        if (monAnsData.length > 0) {
          thunkAPI.dispatch(setMonAns(monAnsData));
        } else {
          console.log("Không có món ăn nào để dispatch.");
        }
        
        return data; // Trả về danh mục để lưu vào state
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message || 'Error fetching data');
      }
    }
  );


  export const themDanhMucThunk = createAsyncThunk(
    'danhMucs/themDanhMuc',
    async (danhMuc: DanhMuc, {rejectWithValue}) => {
      try {
        return await themDanhMuc(danhMuc);
      } catch (error: any) {
        return rejectWithValue(error.message || 'Không thể thêm danh mục');
      }
    },
  );
  
  export const capNhatDanhMucThunk = createAsyncThunk(
    'danhMucs/capNhatDanhMuc',
    async ({id, danhMuc}: {id: string; danhMuc: DanhMuc}, {rejectWithValue}) => {
      try {
        return await capNhatDanhMuc(id, danhMuc);
      } catch (error: any) {
        return rejectWithValue(error.message || 'Không thể cập nhật danh mục');
      }
    },
  );
  
  export const deleteDanhMucThunk = createAsyncThunk(
    'danhMucs/deleteDanhMuc',
    async (id: string, {rejectWithValue}) => {
      try {
        await xoaDanhMuc(id);
        return id;
      } catch (error: any) {
        return rejectWithValue(error.message || 'Không thể xóa danh mục');
      }
    },
  );