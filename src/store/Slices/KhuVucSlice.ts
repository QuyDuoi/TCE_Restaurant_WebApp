// slices/KhuVucSlice.ts
import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {addKhuVuc, getListKhuVuc, updateKhuVuc} from '../../services/CallApi/CallApiKhuVuc.ts'; // Đường dẫn tới API tương ứng
import {fetchBans} from './BanSlice';

// Định nghĩa interface cho KhuVuc
export interface KhuVuc {
    _id?: string;
    tenKhuVuc: string;
    id_NhaHang: string;
}

// Định nghĩa state cho KhuVuc
export interface KhuVucState {
    khuVucs: KhuVuc[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Trạng thái ban đầu cho KhuVucSlice
const initialState: KhuVucState = {
    khuVucs: [],
    status: 'idle',
    error: null,
};

// Thunk để fetch danh sách khu vực
export const fetchKhuVucs = createAsyncThunk(
    'khuVucs/fetchKhuVucs',
    async (idNhaHang: string, {dispatch, rejectWithValue}) => {
        try {
            const data = await getListKhuVuc(idNhaHang); // Gọi API để lấy danh sách khu vực

            return data; // Trả về dữ liệu
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error fetching KhuVuc');
        }
    },
);

export const addNewKhuVuc = createAsyncThunk(
    'khuVucs/addKhuVuc',
    async (formData: KhuVuc, thunkAPI) => {
        try {
            const data = await addKhuVuc(formData);
            return data;
        } catch (error: any) {
            console.log('Lỗi thêm mới:', error);
            return thunkAPI.rejectWithValue(error.message || 'Error adding KhuVuc');
        }
    },
);

export const updateKhuVucThunk = createAsyncThunk(
    'khuVucs/updateKhuVuc',
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

// Tạo KhuVucSlice
const khuVucSlice = createSlice({
    name: 'khuVucs',
    initialState,
    reducers: {
        // Các reducers tùy chỉnh (nếu cần)
    },
    extraReducers: builder => {
        builder
            .addCase(fetchKhuVucs.pending, state => {
                state.status = 'loading';
            })
            .addCase(
                fetchKhuVucs.fulfilled,
                (state, action: PayloadAction<KhuVuc[]>) => {
                    state.status = 'succeeded';
                    state.khuVucs = action.payload; // Cập nhật danh sách khu vực khi fetch thành công
                },
            )
            .addCase(fetchKhuVucs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Could not fetch khu vực'; // Lỗi khi fetch thất bại
            })
            .addCase(
                addNewKhuVuc.fulfilled,
                (state, action: PayloadAction<KhuVuc>) => {
                    state.khuVucs.unshift(action.payload);
                    state.status = 'succeeded';
                },
            )
            .addCase(addNewKhuVuc.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || 'Error adding KhuVuc';
            })
            .addCase(
                updateKhuVucThunk.fulfilled,
                (state, action: PayloadAction<KhuVuc>) => {
                    const index = state.khuVucs.findIndex(
                        cthd => cthd._id === action.payload._id,
                    );
                    if (index !== -1) {
                        state.khuVucs[index] = action.payload;
                    }
                    state.status = 'succeeded';
                },
            )
            .addCase(updateKhuVucThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || 'Error updating KhuVuc';
            });
    },
});

// Export reducer để sử dụng trong store
export default khuVucSlice.reducer;
