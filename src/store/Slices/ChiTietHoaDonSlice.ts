import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getListChiTietHoaDon } from '../../services/CallApi/CallApiChiTietHoaDon.ts';
import { MonAn } from './MonAnSlice.ts';

// Interface định nghĩa cho ChiTietHoaDon
export interface ChiTietHoaDon {
    _id?: string;
    soLuongMon: number;
    giaTien: number;
    trangThai: boolean;
    id_monAn: MonAn;
    id_hoaDon: string;
    createdAt?: string;
    updatedAt?: string;
    ban?: any;
    khuVuc?: any;
}

export interface ChiTietHoaDonState {
    chiTietHoaDons: ChiTietHoaDon[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ChiTietHoaDonState = {
    chiTietHoaDons: [],
    status: 'idle',
    error: null,
};

// Async thunk để lấy danh sách ChiTietHoaDon
export const fetchChiTietHoaDon = createAsyncThunk(
    'chiTietHoaDon/fetchChiTietHoaDon',
    async (id_hoaDon: string, thunkAPI) => {
        try {
            const data = await getListChiTietHoaDon(id_hoaDon);
            return data;
        } catch (error: any) {
            console.log('Lỗi lấy danh sách:', error);
            return thunkAPI.rejectWithValue(
                error.message || 'Error fetching ChiTietHoaDon',
            );
        }
    },
);

export const chiTietHoaDonSlice = createSlice({
    name: 'chiTietHoaDon',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchChiTietHoaDon.pending, state => {
                state.status = 'loading';
            })
            .addCase(
                fetchChiTietHoaDon.fulfilled,
                (state, action: PayloadAction<ChiTietHoaDon[]>) => {
                    state.status = 'succeeded';
                    state.chiTietHoaDons = action.payload;
                },
            )
            .addCase(fetchChiTietHoaDon.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Could not fetch ChiTietHoaDon';
            });
    },
});

export default chiTietHoaDonSlice.reducer;
