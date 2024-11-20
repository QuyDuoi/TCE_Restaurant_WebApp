import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import OrderFood from './OrderFoodScreen/OrderFood';
import Home from "./Screen/HomScreen/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuanLyNhanVien from "./Screen/QuanLy/QuanLyNhanVien/QuanLyNhanVien";
import QuanLyCa from "./Screen/QuanLy/QuanLyCa/QuanLyCa";
import QuanLyHoaDon from "./Screen/QuanLy/QuanLyHoaDon/QuanLyHoaDon";
import QuanLyKhuVuc from "./Screen/QuanLy/QuanLyKhuVuc/QuanLyKhuVuc";
import QuanLyLenMon from "./Screen/QuanLy/QuanLyLenMon/QuanLyLenMon";
import ThongKe from "./Screen/QuanLy/ThongKe/ThongKe";
import QuanLyThucDon from "./Screen/QuanLy/QuanLyThucDon/QuanLyThucDon";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<Home />}>
                <Route path="quanLyNhanVien" element={<QuanLyNhanVien />} />
                <Route path="quanLyThucDon" element={<QuanLyThucDon />} />
                <Route path="quanLyCa" element={<QuanLyCa />} />
                <Route path="quanLyKhuVuc" element={<QuanLyKhuVuc />} />
                <Route path="quanLyLenMon" element={<QuanLyLenMon />} />
                <Route path="quanLyHoaDon" element={<QuanLyHoaDon />} />
                <Route path="thongKe" element={<ThongKe />} />
            </Route>
        </Routes>
    </Router>
);
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <React.StrictMode>
//         <OrderFood />
//     </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
