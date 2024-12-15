import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Cấu hình Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyCMSeAFaVT6hJStOwKevh72TEU5cbRwcMc",
    authDomain: "tce-restaurant-main.firebaseapp.com",
    projectId: "tce-restaurant-main",
    storageBucket: "tce-restaurant-main.firebasestorage.app",
    messagingSenderId: "705613056877",
    appId: "1:705613056877:web:037eb4be8e1fa67108e864",
    measurementId: "G-9WZPCDFF4S"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Lấy đối tượng Auth từ Firebase
export const auth = getAuth(app);
