import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getListHoaDonTheoCaLam } from '../../services/CallApi/CallApiHoaDon.ts';
import { fetchHoaDonTheoNhaHang, themHoaDonMoi } from '../Thunks/hoaDonThunks.ts';
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

const hoaDonSlice = createSlice({
    name: 'hoaDon',
    initialState:{
        hoaDons: [], // đảm bảo giá trị khởi tạo là mảng rỗng
        status: "idle", // hoặc trạng thái khác tùy theo logic của bạn
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchHoaDonTheoCaLam.pending, state => {
                state.status = 'loading';
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
            })
            .addCase(themHoaDonMoi.pending, state => {
                state.status = 'loading';
            })
            .addCase(
                themHoaDonMoi.fulfilled,
                (state, action: PayloadAction<HoaDon>) => {
                    state.status = 'succeeded';
                    state.hoaDons.push(action.payload);
                    console.log('hoadonslice',action.payload);
                }
            )
            .addCase(themHoaDonMoi.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Lưu lỗi
            })
            .addCase(fetchHoaDonTheoNhaHang.pending, state => {
                state.status = 'loading';
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
            });
    },
});

export default hoaDonSlice.reducer;
