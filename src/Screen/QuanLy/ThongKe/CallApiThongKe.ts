import { ipAddress } from "../../../services/api.ts";

export const thongKeDoanhThu = async (type, startDate, endDate, choiseDay) => {
    try {
      let url = `${ipAddress}thongKeDoanhThu?type=${type}`;
      if (type === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (type === 'choiceDay' && choiseDay) {
        url += `&choiceDay=${choiseDay}`;
      }

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data[0]);
      if (data.length === 0) {
        return {tongDoanhThu: 0, tongKhuyenMai: 0};
      } else {
        return data[0];
      }

    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  export const thongKeHinhThucThanhToan = async (type, startDate, endDate, choiseDay) => {
    try {
      let url = `${ipAddress}thongKeHinhThucThanhToan?type=${type}`;
      if (type === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (type === 'choiceDay' && choiseDay) {
        url += `&choiceDay=${choiseDay}`;
      }

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data);
      if (data.length === 0) {
        return {tongTienMat: 0, tongChuyenKhoan: 0};
      } else {
        return data[0];
      }

    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  export const thongKeNguonDoanhThu = async (type, startDate, endDate, choiseDay) => {
    try {
      let url = `${ipAddress}thongKeDoanhThuTheoNguon?type=${type}`;
      if (type === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (type === 'choiceDay' && choiseDay) {
        url += `&choiceDay=${choiseDay}`;
      }

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;

    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  export const thongKeTop5 = async (type, startDate, endDate, choiseDay) => {
    try {
      let url = `${ipAddress}top5MatHangBanChay?type=${type}`;
      if (type === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (type === 'choiceDay' && choiseDay) {
        url += `&choiceDay=${choiseDay}`;
      }

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;

    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };
  