import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NhanVienSlice } from "./NhanVienSlice.ts";
import { ChiTietHoaDon } from "../../services/CallApi/ChiTietHoaDonSlice.ts";
import { layDsNhanVien } from "../../services/CallApi/CallApiNhanVien.ts";
import {
    getListCaLam,
    getListChiTietHoaDonTheoCaLam,
} from "../../services/CallApi/CallApiCaLam.ts";

// Định nghĩa giao diện cho CaLam
export interface CaLam {
    _id?: string;
    batDau: Date;
    ketThuc?: Date;
    soDuBanDau: number;
    soDuHienTai: number;
    tongTienMat: number;
    tongChuyenKhoan: number;
    tongDoanhThu: number;
    tongThu: number;
    tongChi: number;
    id_nhanVien: NhanVienSlice;
    id_hoaDon: string[];
    id_nhaHang: string;
}

export interface CaLamState {
    caLams: CaLam[];
    status: "idle" | "loading" | "failed" | "succeeded";
    error: string | null;
    chiTietHoaDons: ChiTietHoaDon[];
}

const initialState: CaLamState = {
    caLams: [],
    status: "idle",
    error: null,
    chiTietHoaDons: [],
};

// Lấy danh sách các ca làm
export const fetchCaLam = createAsyncThunk(
    "caLam/fetchCaLam",
    async (id_nhaHang: string) => {
    try {
        // Lấy danh sách tất cả các ca làm
        const allCaLamResponse = await getListCaLam(id_nhaHang); // Không truyền id_nhanVien
        return allCaLamResponse; // Trả về tất cả các ca làm
    } catch (error: any) {
        console.log('Lỗi lấy danh sách ca làm:', error);
        return [];
    }
});


// // Lấy danh sách các ca làm
// export const fetchCaLam = createAsyncThunk<
//     CaLam[],
//     void,
//     { rejectValue: string }
// >("caLam/fetchCaLam", async (_, { rejectWithValue }) => {
//     try {
//         const nhanViens = await layDsNhanVien();
//         const allCaLamResponse = await Promise.all(
//             nhanViens.map((nv) => getListCaLam(nv._id as string))
//         );
//         const allCaLams = allCaLamResponse.flatMap((response, index) => {
//             return response.map((caLam: CaLam) => ({
//                 ...caLam,
//                 id_nhanVien: nhanViens[index],
//             }));
//         });
//         return allCaLams;
//     } catch (error: any) {
//         return rejectWithValue(error.message || "Lỗi khi gọi API fetchCaLam");
//     }
// });

// Lấy chi tiết hóa đơn theo ca làm
export const fetchChiTietHoaDonTheoCaLam = createAsyncThunk<
    ChiTietHoaDon[],
    string,
    { rejectValue: string }
>("caLam/fetchChiTietHoaDon", async (id_caLam, { rejectWithValue }) => {
    try {
        const data = await getListChiTietHoaDonTheoCaLam(id_caLam);
        return data;
    } catch (error: any) {
        return rejectWithValue(
            error.message || "Lỗi khi lấy danh sách Chi Tiết Hóa Đơn"
        );
    }
});

// Slice quản lý trạng thái CaLam
const caLamSlice = createSlice({
    name: "caLam",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCaLam.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCaLam.fulfilled, (state, action: PayloadAction<CaLam[]>) => {
                state.status = "succeeded";
                state.caLams = action.payload;
            })
            .addCase(fetchCaLam.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || null;
            })
            .addCase(fetchChiTietHoaDonTheoCaLam.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                fetchChiTietHoaDonTheoCaLam.fulfilled,
                (state, action: PayloadAction<ChiTietHoaDon[]>) => {
                    state.status = "succeeded";
                    state.chiTietHoaDons = action.payload;
                }
            )
            .addCase(fetchChiTietHoaDonTheoCaLam.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || null;
            });
    },
});

export default caLamSlice.reducer;
