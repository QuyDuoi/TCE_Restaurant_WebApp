import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getListHoaDonTheoCaLam,
    getListHoaDonTheoNhaHang,
    thanhToanHoaDon,
} from '../../services/CallApi/CallApiHoaDon.ts';
import { themHoaDonMoi } from '../Thunks/hoaDonThunks.ts';
// Interface định nghĩa cho HoaDon
export interface HoaDon {
    _id?: string;
    tongGiaTri: number;
    trangThai: string;
    hinhThucThanhToan: boolean;
    id_nhanVien: string;
    tienGiamGia?: number;
    ghiChu?: string;
    id_ban?: string;
    thoiGianVao?: Date;
    thoiGianRa?: Date;
    tongTien?: number;
    id_caLamViec?: string;
}

export interface HoaDonState {
    hoaDons: HoaDon[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: HoaDonState = {
    hoaDons: [],
    status: 'idle',
    error: null,
};

// Async thunk để lấy danh sách hóa đơn theo id_caLamViec
export const fetchHoaDonTheoCaLam = createAsyncThunk(
    'hoaDon/fetchHoaDonTheoCaLam',
    async (id_caLamViec: string) => {
        try {
            const hoaDonsData = await getListHoaDonTheoCaLam(id_caLamViec);
            return hoaDonsData;
        } catch (error) {
            console.log('Lỗi lấy danh sách hóa đơn:', error);
            return [];
        }
    }
);

//chua toi uu
export const fetchHoaDonTheoNhaHang = createAsyncThunk(
    'hoaDon/fetchHoaDonTheoNhaHang',
    async (id_nhaHang: string) => {
        try {
            const hoaDonsData = await getListHoaDonTheoNhaHang(id_nhaHang);
            return hoaDonsData;
        } catch (error) {
            console.log('Lỗi lấy danh sách hoa đơn:', error);
            return [];
        }
    },
);

// chua toi uu
export const thanhToanHoaDonThunk = createAsyncThunk(
    'hoaDon/thanhToanHoaDon',
    async (
        {
            id_hoaDon,
            tienGiamGia,
            hinhThucThanhToan,
            thoiGianRa,
        }: {
            id_hoaDon: string;
            tienGiamGia: number;
            hinhThucThanhToan: boolean;
            thoiGianRa: Date;
        },
        thunkAPI,
    ) => {
        try {
            const data = await thanhToanHoaDon(
                id_hoaDon,
                tienGiamGia,
                hinhThucThanhToan,
                thoiGianRa,
            );
            return data;
        } catch (error: any) {
            console.log('Lỗi thanh toán:', error);
            return thunkAPI.rejectWithValue(error.message || 'Error thanh toán');
        }
    },
);

const hoaDonSlice = createSlice({
    name: 'hoaDon',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchHoaDonTheoCaLam
            .addCase(fetchHoaDonTheoCaLam.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchHoaDonTheoCaLam.fulfilled,
                (state, action: PayloadAction<HoaDon[]>) => {
                    state.status = 'succeeded';
                    state.hoaDons = action.payload;
                }
            )
            .addCase(fetchHoaDonTheoCaLam.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error?.message || 'Lỗi không xác định';
            })
            // themHoaDonMoi
            .addCase(themHoaDonMoi.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                themHoaDonMoi.fulfilled,
                (state, action: PayloadAction<HoaDon>) => {
                    state.status = 'succeeded';
                    state.hoaDons.push(action.payload);
                    console.log('hoadonslice', action.payload);
                }
            )
            .addCase(themHoaDonMoi.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error?.message || 'Lỗi không xác định';
            })
            // fetchHoaDonTheoNhaHang
            .addCase(fetchHoaDonTheoNhaHang.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchHoaDonTheoNhaHang.fulfilled,
                (state, action: PayloadAction<HoaDon[]>) => {
                    state.status = 'succeeded';
                    state.hoaDons = action.payload;
                }
            )
            .addCase(fetchHoaDonTheoNhaHang.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error?.message || 'Lỗi không xác định';
            })
            // thanhToanHoaDonThunk
            .addCase(thanhToanHoaDonThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                thanhToanHoaDonThunk.fulfilled,
                (state, action: PayloadAction<HoaDon>) => {
                    state.status = 'succeeded';
                    // Cập nhật hóa đơn đã thanh toán trong danh sách
                    const index = state.hoaDons.findIndex(
                        (hoaDon) => hoaDon._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.hoaDons[index] = action.payload;
                    }
                }
            )
            .addCase(thanhToanHoaDonThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error?.message || 'Lỗi không xác định';
            });
    },
});

export default hoaDonSlice.reducer;
