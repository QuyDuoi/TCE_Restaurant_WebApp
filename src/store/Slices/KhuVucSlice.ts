// slices/KhuVucSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { themKhuVucThunk, capNhatKhuVucThunk, fetchKhuVucVaBan } from '../Thunks/khuVucThunks.ts';

// Định nghĩa interface cho KhuVuc
export interface KhuVuc {
  bans: any[];
  _id: string;
  tenKhuVuc: string;
  id_nhaHang: string;
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

// Tạo KhuVucSlice
const khuVucSlice = createSlice({
  name: 'khuVucs',
  initialState,
  reducers: {
    // Các reducers tùy chỉnh (nếu cần)
  },
  extraReducers: builder => {
    builder
      .addCase(fetchKhuVucVaBan.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchKhuVucVaBan.fulfilled,
        (state, action: PayloadAction<Array<{ bans: any[]; _id: string; tenKhuVuc: string; id_nhaHang: string }>>) => {
          state.status = 'succeeded';
          state.khuVucs = action.payload; // Cập nhật danh sách khu vực với dữ liệu từ API, bao gồm cả trường bans          
        }
      )
      .addCase(fetchKhuVucVaBan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not fetch khu vực'; // Lỗi khi fetch thất bại
      })
      .addCase(
        themKhuVucThunk.fulfilled,
        (state, action: PayloadAction<KhuVuc>) => {
          state.khuVucs.unshift(action.payload);
          state.status = 'succeeded';
        },
      )
      .addCase(themKhuVucThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error adding KhuVuc';
      })
      .addCase(
        capNhatKhuVucThunk.fulfilled,
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
      .addCase(capNhatKhuVucThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error updating KhuVuc';
      });
  },
});

// Export reducer để sử dụng trong store
export default khuVucSlice.reducer;
