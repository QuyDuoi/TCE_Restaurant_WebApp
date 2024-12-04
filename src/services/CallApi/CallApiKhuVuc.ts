import {ipAddress} from "../api.ts";
import {KhuVuc} from "../../store/Slices/KhuVucSlice.ts";

export const addKhuVuc = async (formData: KhuVuc): Promise<KhuVuc> => {
    try {
        const response = await fetch(`${ipAddress}addKhuVuc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Lỗi khi thêm mới Khu Vực');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Lỗi thêm mới khu vực: ', error);
        throw error;
    }
};
export const getListKhuVuc = async (idNhaHang: string): Promise<KhuVuc[]> => {
    try {
        const response = await fetch(
            `${ipAddress}layDsKhuVuc?id_nhaHang=${idNhaHang}`,
        );
      
        
        
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách Khu Vực');
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('Lỗi khi lấy danh sách khu vực: ', error);
        return [];
    }
};
export const updateKhuVuc = async (
    id: string,
    formData: KhuVuc,
): Promise<KhuVuc> => {
    try {
        const response = await fetch(`${ipAddress}updateKhuVuc/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Lỗi khi cập nhật khu vực');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Lỗi cập nhật khu vực: ', error);
        throw error;
    }
};