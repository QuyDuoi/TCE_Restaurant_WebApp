// slices/MonAnSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getListMonAn, getMonAnTheoId, themMonAn, updateMonAn } from '../../screens/QuanLyThucDon/CallApiThucDon';

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

// Thunk để fetch danh sách món ăn
export const fetchMonAns = createAsyncThunk(
  'monAns/fetchMonAns',
  async (id_DanhMuc?: String) => {
    const data = await getListMonAn(id_DanhMuc); // Gọi API để lấy danh sách món ăn
    return data; // Trả về dữ liệu
  },
);

export const themMonAnMoi = createAsyncThunk(
  'monAns/themMonAn',
  async (formData: FormData, thunkAPI) => {
    try {
      const data = await themMonAn(formData);
      return data;
    } catch (error: any) {
      console.log('Lỗi thêm mới:', error);
      return thunkAPI.rejectWithValue(error.message || 'Lỗi khi thêm món ăn');
    }
  },
);

export const updateMonAnThunk = createAsyncThunk(
  'monAns/updateMonAn',
  async ({ id, formData }: { id: string; formData: FormData }, thunkAPI) => {
    try {
      const data = await updateMonAn(id, formData);
      return data;
    } catch (error: any) {
      console.log('Lỗi cập nhật:', error);
      return thunkAPI.rejectWithValue(error.message || 'Lỗi khi cập nhật món ăn');
    }
  },
);

// Thunk để fetch món ăn
export const fetchMonAnTheoId = createAsyncThunk(
  'monAns/fetchMonAnTheoId',
  async (id_MonAn: String) => {
    const data = await getMonAnTheoId(id_MonAn);
    return data; // Trả về dữ liệu
  },
);

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
      .addCase(fetchMonAns.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchMonAns.fulfilled,
        (state, action: PayloadAction<MonAn[]>) => {
          state.status = 'succeeded';
          state.monAns = action.payload; // Cập nhật danh sách món ăn khi fetch thành công
        },
      )
      .addCase(fetchMonAns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not fetch món ăn'; // Lỗi khi fetch thất bại
      })
      .addCase(themMonAnMoi.fulfilled, (state, action: PayloadAction<MonAn>) => {
        state.monAns.unshift(action.payload);
        state.status = 'succeeded';
      })
      .addCase(themMonAnMoi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error adding MonAn';
      })
      .addCase(
        updateMonAnThunk.fulfilled,
        (state, action: PayloadAction<MonAn>) => {
          const index = state.monAns.findIndex(
            cthd => cthd._id === action.payload._id,
          );
          if (index !== -1) {
            state.monAns[index] = action.payload;
          }
          state.status = 'succeeded';
        },
      )
      .addCase(updateMonAnThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error updating MonAn';
      })
      .addCase(fetchMonAnTheoId.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchMonAnTheoId.fulfilled, (state, action: PayloadAction<MonAn>) => {
        // console.log("Dữ liệu trả về từ API:", action.payload);  // Kiểm tra lại dữ liệu
        console.log("name: " + action.payload.tenMon)
        state.status = 'succeeded';
        state.monAn = action.payload;  // action.payload là đối tượng món ăn
      })

  },
});

// Export reducer để sử dụng trong store
export const {setMonAns} = monAnSlice.actions;
export default monAnSlice.reducer;
