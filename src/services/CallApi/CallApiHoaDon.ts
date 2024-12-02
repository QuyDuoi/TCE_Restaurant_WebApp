// Lấy danh sách HoaDon
import { HoaDon } from "../../store/Slices/HoaDonSlice.ts";
import { ipAddress } from "../api.ts";

// Hàm lấy danh sách hóa đơn theo id_caLamViec
export const getListHoaDonTheoCaLam = async (
    id_caLamViec: string,
): Promise<HoaDon[]> => {
    try {
        const response = await fetch(
            `${ipAddress}layHdTheoCaLam?id_caLamViec=${id_caLamViec}`
        );
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách Hóa Đơn');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Lỗi khi lấy danh sách Hóa Đơn: ', error);
        return [];
    }
};

export const addHoaDonMoi = async (formData: HoaDon): Promise<HoaDon> => {
    try {
        const response = await fetch(`${ipAddress}themHoaDonMoi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Lỗi khi thêm mới HoaDon');
        }
        const data = await response.json();
        console.log('hoadonAPI',data);
        return data;
    } catch (error) {
        console.log('Lỗi thêm mới HoaDon: ', error);
        throw error;
    }
};

export const getListHoaDonTheoNhaHang = async (
    id_nhaHang: string,
): Promise<HoaDon[]> => {
    try {
        const response = await fetch(
            `${ipAddress}layDsHoaDonTheoNhaHang?id_nhaHang=${id_nhaHang}`
        );
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách Hóa Đơn');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Lỗi khi lấy danh sách Hóa Đơn: ', error);
        return [];
    }
};