import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import OrderFood from "./OrderFoodScreen/OrderFood";
import Home from "./Screen/HomScreen/Home";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import QuanLyNhanVien from "./Screen/QuanLy/QuanLyNhanVien/QuanLyNhanVien";
import QuanLyCa from "./Screen/QuanLy/QuanLyCa/QuanLyCa";
import QuanLyHoaDon from "./Screen/QuanLy/QuanLyHoaDon/QuanLyHoaDon";
import QuanLyKhuVuc from "./Screen/QuanLy/QuanLyKhuVuc/QuanLyKhuVuc";
import QuanLyLenMon from "./Screen/QuanLy/QuanLyLenMon/QuanLyLenMon";
import ThongKe from "./Screen/QuanLy/ThongKe/ThongKe";
import QuanLyThucDon from "./Screen/QuanLy/QuanLyThucDon/QuanLyThucDon";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<QuanLyNhanVien />} />
          <Route path="quanLyNhanVien" element={<QuanLyNhanVien />} />
          <Route path="quanLyThucDon" element={<QuanLyThucDon />} />
          <Route path="quanLyCa" element={<QuanLyCa />} />
          <Route path="quanLyKhuVuc" element={<QuanLyKhuVuc />} />
          <Route path="quanLyLenMon" element={<QuanLyLenMon />} />
          <Route path="quanLyHoaDon" element={<QuanLyHoaDon />} />
          <Route path="thongKe" element={<ThongKe />} />
        </Route>
        <Route path="orderFood/:id" element={<OrderFood />} />
      </Routes>
    </Router>
  </Provider>
);

reportWebVitals();
