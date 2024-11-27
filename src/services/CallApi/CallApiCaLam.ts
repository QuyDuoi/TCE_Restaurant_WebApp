import { ipAddress } from "../api.ts";
import { CaLam } from "../../store/Slices/CaLamSlice.ts";

// // Lấy danh sách ca làm của nhân viên
// export const getListCaLam = async (id_nhanVien: string): Promise<CaLam[]> => {
//     try {
//         const response = await fetch(
//             `${ipAddress}layDsCaLamViec?id_nhanVien=${id_nhanVien}`
//         );
//         if (!response.ok) {
//             throw new Error("Lỗi khi lấy danh sách Ca Làm");
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Lỗi khi lấy danh sách Ca Làm:", error);
//         return [];
//     }
// };

// Lấy danh sách tất cả các ca làm mà không cần truyền id_nhanVien
export const getListCaLam = async (): Promise<CaLam[]> => {
    try {
        const response = await fetch(
            `${ipAddress}layDsCaLamViec`  // Giả sử API này trả về tất cả các ca làm
        );
        if (!response.ok) {
            throw new Error("Lỗi khi lấy danh sách Ca Làm");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách Ca Làm:", error);
        return [];
    }
};

// Lấy danh sách chi tiết hóa đơn theo ca làm
export const getListChiTietHoaDonTheoCaLam = async (
    id_caLam: string
): Promise<any[]> => {
    try {
        const response = await fetch(
            `${ipAddress}layCthdTheoCaLam?id_caLam=${id_caLam}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );
        if (!response.ok) {
            throw new Error("Lỗi khi lấy danh sách Chi Tiết Hóa Đơn");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách Chi Tiết Hóa Đơn:", error);
        return [];
    }
};
