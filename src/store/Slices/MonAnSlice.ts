import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchMonAnTheoId, themMonAnMoi, updateMonAnThunk, updateStatusMonAnThunk } from '../Thunks/monAnThunks';

// Định nghĩa interface cho MonAn
export interface MonAn {
  _id?: string;
  tenMon: string;
  anhMonAn: string;
  moTa: string;
  giaMonAn: number;
  trangThai: boolean;
  id_danhMuc: string;
  id_nhomTopping?: string;
}

// Định nghĩa state cho MonAn
export interface MonAnState {
  monAns: MonAn[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  monAn: MonAn | null;
}

// Trạng thái ban đầu cho MonAnSlice
const initialState: MonAnState = {
  monAns: [],
  status: 'idle',
  error: null,
  monAn: null,
};

// Tạo MonAnSlice
const monAnSlice = createSlice({
  name: 'monAns',
  initialState,
  reducers: {
    setMonAns: (state, action: PayloadAction<MonAn[]>) => {
      state.monAns = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(themMonAnMoi.fulfilled, (state, action: PayloadAction<MonAn>) => {
        state.monAns.unshift(action.payload);
        state.status = 'succeeded';
      })
      .addCase(themMonAnMoi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error adding MonAn';
      })
      .addCase(updateMonAnThunk.fulfilled, (state, action: PayloadAction<MonAn>) => {
        const updatedMonAn = action.payload;

        console.log("Updated món ăn: ", updatedMonAn);

        // Tìm và cập nhật món ăn trong danh sách
        const index = state.monAns.findIndex(monAn => monAn._id === updatedMonAn._id);
        if (index !== -1) {
          console.log('Cập nhật rồi');
          
          state.monAns[index] = updatedMonAn;
        } else {
          // Nếu món ăn không có trong danh sách hiện tại (lý do chuyển danh mục)
          state.monAns.push(updatedMonAn);
        }

        state.status = 'succeeded';
      })
      .addCase(updateMonAnThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error updating MonAn';
      })
      .addCase(fetchMonAnTheoId.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchMonAnTheoId.fulfilled, (state, action: PayloadAction<MonAn>) => {
        console.log("name: " + action.payload.tenMon);
        state.status = 'succeeded';
        state.monAn = action.payload; // action.payload là đối tượng món ăn
      })
      .addCase(fetchMonAnTheoId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not fetch món ăn by id';
      })
      .addCase(updateStatusMonAnThunk.fulfilled, (state, action: PayloadAction<MonAn>) => {
        const updatedMonAn = action.payload;

        // Tìm và cập nhật món ăn trong danh sách
        const index = state.monAns.findIndex(monAn => monAn._id === updatedMonAn._id);
        if (index !== -1) {
          state.monAns[index] = updatedMonAn;
        }

        state.status = 'succeeded';
      })
      .addCase(updateStatusMonAnThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error updating MonAn';
      })
  },
});

// Export reducer để sử dụng trong store
export const { setMonAns } = monAnSlice.actions;
export default monAnSlice.reducer;
