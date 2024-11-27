import {configureStore} from '@reduxjs/toolkit';
import hoaDonReducer from './Slices/HoaDonSlice.ts';
import chiTietHoaDonReducer from './Slices/ChiTietHoaDonSlice.ts';
// import toppingReducer from './Slices/ToppingSlice.ts';
// import nhomToppingReducer from './Slices/NhomToppingSlice.ts';
// import danhMucReducer from './Slices/DanhMucSlice.ts';
// import monAnReducer from './Slices/MonAnSlice.ts';
// import nhanVienReducer from './Slices/NhanVienSlice.ts';
import khuVucReducer from './Slices/KhuVucSlice.ts';
import banReducer from './Slices/BanSlice.ts';
import caLamReducer from "./Slices/CaLamSlice.ts";

export const store = configureStore({
  reducer: {
    hoaDon: hoaDonReducer,
    chiTietHoaDon: chiTietHoaDonReducer,
    // nhomToppings: nhomToppingReducer,
    // toppings: toppingReducer,
    // danhMuc: danhMucReducer,
    // monAn: monAnReducer,
    // nhanVien: nhanVienReducer,
    khuVuc: khuVucReducer,
    ban: banReducer,
    caLam: caLamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
