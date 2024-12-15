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
            `${ipAddress}layDsHoaDonTheoNhaHang?id_nhaHang=${id_nhaHang}`,
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Lỗi khi lấy danh sách Hóa Đơn: ', error);
        return [];
    }
};

//Thanh Toan Hoa Don
export const thanhToanHoaDon = async (
    id_hoaDon: string,
    tienGiamGia: number,
    hinhThucThanhToan: boolean,
    thoiGianRa: Date,
    id_nhanVien: String
): Promise<any> => {
    try {
        const response = await fetch(`${ipAddress}thanhToanHoaDon`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id_hoaDon,
                tienGiamGia,
                hinhThucThanhToan,
                thoiGianRa,
                id_nhanVien
            }),
        });
        if (!response.ok) {
            throw new Error('Lỗi khi thanh toán Hóa Đơn');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Lỗi thanh toán Hóa Đơn: ', error);
        throw error;
    }
};