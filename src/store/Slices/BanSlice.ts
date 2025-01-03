import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { layDsBan, themBan, capNhatBan, layThongTinBan, getBanTheoId, timKiemBan } from '../../services/CallApi/CallApiBan.ts';
import { KhuVuc } from "./KhuVucSlice.ts";
const idNhaHang = '66fab50fa28ec489c7137537';
// Định nghĩa interface cho Ban
export interface Ban {
  _id?: string;
  tenBan: string;
  sucChua: number;
  trangThai: string;
  ghiChu: string;
  id_khuVuc: KhuVuc;
}

// Định nghĩa state cho Ban
export interface BanState {
  bans: Ban[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  ban: Ban | null;
}

// Trạng thái ban đầu cho BanSlice
const initialState: BanState = {
  bans: [],
  status: 'idle',
  error: null,
  ban: null,
};

// Async thunk để thêm mới Bàn
export const addNewBan = createAsyncThunk(
  'bans/addBans',
  async (formData: Ban, thunkAPI) => {
    try {
      const data = await themBan(formData);
      return data;
    } catch (error: any) {
      console.log('Lỗi thêm mới:', error);
      return thunkAPI.rejectWithValue(error.message || 'Error adding Bàn');
    }
  },
);
// Async thunk để cập nhật Bàn
export const updateBanThunk = createAsyncThunk(
  'bans/updateBans',
  async ({ id, formData }: { id: string; formData: Ban }, thunkAPI) => {
    try {
      const data = await capNhatBan(id, formData);

      return data;
    } catch (error: any) {
      console.log('Lỗi cập nhật:', error);
      return thunkAPI.rejectWithValue(error.message || 'Error updating Bàn');
    }
  },
);

//Async thunk để tìm kiếm Bàn
export const searchBanThunk = createAsyncThunk(
  'bans/searchBans',
  async (textSearch: string, thunkAPI) => {
    try {
      const data = await timKiemBan(textSearch);
      return data;
    } catch (error:any) {
      console.log('Lỗi tìm kiếm:', error);
      return thunkAPI.rejectWithValue(error.message || 'Error searching Bàn');
    }
  }
)

// Thunk để fetch món ăn
export const fetchBanTheoId = createAsyncThunk(
  'bans/fetchBanTheoId',
  async (id_Ban: String) => {
    const data = await getBanTheoId(id_Ban);
    return data; // Trả về dữ liệu
  },
);

// Tạo BanSlice
const banSlice = createSlice({
  name: 'bans',
  initialState,
  reducers: {
    setBans: (state, action: PayloadAction<Ban[]>) => {
      state.bans = action.payload;
    },resetStatus: (state) => {
      state.status = 'idle'; // Reset trạng thái về idle
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addNewBan.fulfilled, (state, action: PayloadAction<Ban>) => {
        state.bans.unshift(action.payload);
        state.status = 'succeeded';
      })
      .addCase(addNewBan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error adding Bàn';
      })
      .addCase(updateBanThunk.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        updateBanThunk.fulfilled,
        (state, action: PayloadAction<Ban>) => {
          const index = state.bans.findIndex(
            ban => ban._id === action.payload._id,
          );
          if (index !== -1) {
            state.bans[index] = { ...state.bans[index], ...action.payload };
          }
          state.status = 'succeeded';
        },
      )
      .addCase(updateBanThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error updating Bàn';
      })
      .addCase(fetchBanTheoId.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchBanTheoId.fulfilled,
        (state, action: PayloadAction<Ban>) => {
          // console.log("Dữ liệu trả về từ API:", action.payload);  // Kiểm tra lại dữ liệu
          state.status = 'succeeded';
          state.ban = action.payload; // action.payload là đối tượng món ăn
        },
      )
      .addCase(searchBanThunk.pending, state =>{
 
      })
      .addCase(searchBanThunk.fulfilled, (state, action: PayloadAction<Ban>)=>{
      
        state.ban = action.payload;
        
      })
      .addCase(searchBanThunk.rejected, (state, action)=>{
       
      });
  },
});

// Export reducer để sử dụng trong store
export const { setBans, resetStatus } = banSlice.actions;
export default banSlice.reducer;
