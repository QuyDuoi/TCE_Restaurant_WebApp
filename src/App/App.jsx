// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store.ts";
import Home from "../Screen/HomScreen/Home";
import QuanLyNhanVien from "../Screen/QuanLy/QuanLyNhanVien/QuanLyNhanVien";
import QuanLyCa from "../Screen/QuanLy/QuanLyCa/QuanLyCa";
import QuanLyHoaDon from "../Screen/QuanLy/QuanLyHoaDon/QuanLyHoaDon";
import QuanLyKhuVuc from "../Screen/QuanLy/QuanLyKhuVuc/QuanLyKhuVuc";
import QuanLyLenMon from "../Screen/QuanLy/QuanLyLenMon/QuanLyLenMon";
import ThongKe from "../Screen/QuanLy/ThongKe/ThongKe";
import QuanLyThucDon from "../Screen/QuanLy/QuanLyThucDon/QuanLyThucDon";
import LoginUI from "../Screen/Authentication/Login/LoginUI";
import PrivateRoute from "../Screen/Authentication/PrivateRoute";
import QuanLyTinNhan from "../Screen/QuanLy/ChamSocKhachHang/QuanLyTinNhan.jsx";
import OrderFood from "../OrderFoodScreen/OrderFood";
import { useEffect } from "react";
import { setUser } from "../store/Slices/UserSlice.ts";

const App = () => {
  const dispatch = useDispatch();

  // Check localStorage and set user in Redux if it exists
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      // Parse the saved user data and dispatch it to Redux
      dispatch(setUser(JSON.parse(savedUser)));
      console.log("da vao day");
      
    }
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        {/* Đường dẫn login không yêu cầu xác thực */}
        <Route path="/login" element={<LoginUI />} />

        {/* Bảo vệ các tuyến yêu cầu xác thực */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route index element={<QuanLyNhanVien />} />
          <Route path="quanLyNhanVien" element={<QuanLyNhanVien />} />
          <Route path="quanLyThucDon" element={<QuanLyThucDon />} />
          <Route path="quanLyCa" element={<QuanLyCa />} />
          <Route path="quanLyKhuVuc" element={<QuanLyKhuVuc />} />
          <Route path="quanLyLenMon" element={<QuanLyLenMon />} />
          <Route path="quetToanHoaDon" element={<QuanLyHoaDon />} />
          <Route path="thongKe" element={<ThongKe />} />
          <Route path="quanLyTinNhan" element={<QuanLyTinNhan />} />
        </Route>

        {/* Bảo vệ tuyến dành cho OrderFood */}
        <Route path="orderFood/:id" element={<OrderFood />} />
      </Routes>
    </Router>
  );
};

export default App;
