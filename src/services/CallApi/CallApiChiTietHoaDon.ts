import { ChiTietHoaDon } from "../../store/Slices/ChiTietHoaDonSlice.ts";
import { ipAddress } from "../api.ts";

// Lấy danh sách ChiTietHoaDon
export const getListChiTietHoaDon = async (
    id_hoaDon: string,
): Promise<ChiTietHoaDon[]> => {
    try {
        const response = await fetch(`${ipAddress}layDsChiTietHoaDon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_hoaDon: id_hoaDon }),
            redirect: 'follow',
        });
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách Chi Tiết Hóa Đơn');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Lỗi khi lấy danh sách Chi Tiết Hóa Đơn: ', error);
        return [];
    }
};
