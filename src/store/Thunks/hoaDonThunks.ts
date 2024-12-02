import { createAsyncThunk } from '@reduxjs/toolkit';
import { HoaDon } from '../Slices/HoaDonSlice'
import { addHoaDonMoi, getListHoaDonTheoNhaHang } from '../../services/CallApi/CallApiHoaDon.ts';
export const themHoaDonMoi = createAsyncThunk(
    'hoaDon/themHoaDonMoi',
    async (hoaDonData: HoaDon, thunkAPI) => {
        try {
            const response = await addHoaDonMoi(hoaDonData);
          
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Error adding HoaDon');
        }
    }
);

export const fetchHoaDonTheoNhaHang = createAsyncThunk(
    'hoaDon/fetchHoaDonTheoNhaHang',
    async (nhaHangId: string, thunkAPI) => {
        try {
            const response = await getListHoaDonTheoNhaHang(nhaHangId);
            
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Error adding HoaDon');
        }
    }
)