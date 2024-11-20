// slices/NhanVienSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { themNhanVien, xoaNhanVien, layDsNhanVien, capNhatNhanVien, loginNhanVien, checkLogin } from '../../services/CallApi/CallApiNhanVien.ts'; // Đường dẫn tới API tương ứng

// Định nghĩa interface cho NhanVien
export interface NhanVienSlice {
    _id?: string;
    hoTen: string;
    hinhAnh: string;
    soDienThoai: string;
    cccd: string;
    vaiTro: string;
    trangThai: boolean;
    id_nhaHang?: string;
}

// Định nghĩa state cho NhanVien
export interface NhanVienState {
    nhanViens: NhanVienSlice[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    token: string | null; // Thêm thuộc tính token
    refreshToken: string | null;
    message: string | null; // Thêm thuộc tính message để hiển thị thông báo
    statusError: string | null;
}

// Trạng thái ban đầu cho NhanVienSlice
const initialState: NhanVienState = {
    nhanViens: [],
    status: 'idle',
    error: null,
    token: null, // Khởi tạo token là null
    refreshToken: null,
    message: null,
    statusError: null,
};

// Thunk để fetch danh sách nhân viên
export const fetchNhanViens = createAsyncThunk('nhanViens/fetchNhanViens', async () => {
    const data = await layDsNhanVien(); // Gọi API để lấy danh sách nhân viên
    return data; // Trả về dữ liệu
});

export const themNhanVienThunk = createAsyncThunk('NhanVienSlice/themNhanVien', async (formData: FormData, thunkAPI) => {
    try {
        const data = await themNhanVien(formData);
        return data;
    } catch (error: any) {
        console.log('Lỗi thêm mới:', error);
        return thunkAPI.rejectWithValue(error.message || 'Error adding NhanVien');
    }
});

export const capNhatNhanVienThunk = createAsyncThunk<
    NhanVienSlice, // Kiểu dữ liệu trả về khi thành công
    { id: string, formData: FormData }, // Kiểu dữ liệu tham số truyền vào
    { rejectValue: string } // Kiểu dữ liệu trả về khi thất bại
>(
    'nhanViens/capNhatNhanVien',
    async ({ id, formData }, thunkAPI) => {
        try {
            const data = await capNhatNhanVien(id, formData);
            console.log("Da duoc tien hanh");

            return data;
        } catch (error: any) {
            console.log('Lỗi cập nhật:', error);
            return thunkAPI.rejectWithValue(error.message || 'Error updating NhanVien');
        }
    }
);

export const xoaNhanVienThunk = createAsyncThunk(
    'nhanViens/xoaNhanVien',
    async (id: string, thunkAPI) => {
        try {
            const deletedId = await xoaNhanVien(id); // Gọi hàm API để xóa
            return deletedId; // Trả về id nhân viên đã xóa
        } catch (error: any) {
            console.log('Lỗi khi xóa:', error);
            return thunkAPI.rejectWithValue(error.message || 'Error deleting NhanVien');
        }
    }
);
// Tạo async thunk cho việc đăng nhập
export const loginNhanVienThunk = createAsyncThunk(
    'nhanViens/login',
    async (idToken: string, thunkAPI) => {
        try {
            const data = await loginNhanVien(idToken); // Gọi hàm loginNhanVien từ api.ts
            console.log('logined');
            console.log('---------------------------------');
            console.log(data);
            console.log('---------------------------------');

            return data; // Trả về dữ liệu
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Đăng nhập thất bại');
        }
    }
);


export const checkLoginThunk = createAsyncThunk(
    'nhanViens/checkLogin',
    async (phoneNumber: string, thunkAPI) => {
        try {
            const data = await checkLogin(phoneNumber);
            return data; // Trả về dữ liệu
        } catch (error) {
            // Giả định error là một đối tượng với một thuộc tính message
            return thunkAPI.rejectWithValue(error.message || 'Check login failed');
        }
    }
);

// Tạo NhanVienSlice
const nhanVienSlice = createSlice({
    name: 'nhanViens',
    initialState,
    reducers: {
        // Các reducers tùy chỉnh (nếu cần)

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNhanViens.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNhanViens.fulfilled, (state, action: PayloadAction<NhanVienSlice[]>) => {
                state.status = 'succeeded';
                state.nhanViens = action.payload; // Cập nhật danh sách nhân viên khi fetch thành công
            })
            .addCase(fetchNhanViens.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Could not fetch nhân viên'; // Lỗi khi fetch thất bại
            })
            .addCase(themNhanVienThunk.fulfilled, (state, action: PayloadAction<NhanVienSlice>) => {
                state.nhanViens.unshift(action.payload);
                state.status = 'succeeded';
            })
            .addCase(themNhanVienThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Error adding NhanVien';
            })
            .addCase(capNhatNhanVienThunk.fulfilled, (state, action: PayloadAction<NhanVienSlice>) => {
                const index = state.nhanViens.findIndex(cthd => cthd._id === action.payload._id);
                if (index !== -1) {
                    state.nhanViens[index] = action.payload;
                }
                state.status = 'succeeded';
            })
            .addCase(capNhatNhanVienThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Error updating NhanVien';
            })
            .addCase(xoaNhanVienThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.nhanViens = state.nhanViens.filter(nv => nv._id !== action.payload); // Xóa nhân viên khỏi danh sách
                state.status = 'succeeded';
            })
            // Xử lý khi xóa thất bại
            .addCase(xoaNhanVienThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Error deleting NhanVien';
            })
            .addCase(loginNhanVienThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginNhanVienThunk.fulfilled, (state, action: PayloadAction<{ token: string; refreshToken: string; nhanVien: NhanVienSlice }>) => {
                state.status = 'succeeded';
                state.token = action.payload.token; // Lưu token vào state
                state.refreshToken = action.payload.refreshToken;
                const existingNhanVien = state.nhanViens.find(nv => nv._id === action.payload.nhanVien._id);
                if (!existingNhanVien) {
                    state.nhanViens.push(action.payload.nhanVien);
                }
            })
            .addCase(loginNhanVienThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Đăng nhập thất bại';
            })
            .addCase(checkLoginThunk.pending, (state) => {
                state.status = 'loading';
                state.message = null;
                state.error = null; // Đặt lại lỗi khi bắt đầu quá trình
            })
            .addCase(checkLoginThunk.fulfilled, (state, action: PayloadAction<{ status: string; message: string; statusError: string }>) => {
                state.status = 'succeeded';
                // Lưu message từ phản hồi
                state.message = action.payload.message;
                state.statusError = action.payload.statusError;
            })
            .addCase(checkLoginThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Check login failed';
            });
    },
});

// Export reducer để sử dụng trong store
export default nhanVienSlice.reducer;
