import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Spin,
  Card,
  Checkbox,
  Row,
  Col,
  Button,
  Alert,
  Dropdown,
  Menu,
  message,
} from "antd";
import axios from "axios";
import { ipAddress } from "../../../services/api.ts";
import { useSelector } from "react-redux";
import HeaderBar, { removeVietnameseTones } from "./HeaderBar";
import "./style.css";
import { io } from "socket.io-client";
import { FilterOutlined } from "@ant-design/icons";

const { Content } = Layout;

const QuanLyLenMon = () => {
  const [data, setData] = useState({
    chuaHoanThanh: [],
    hoanThanh: [],
    theoTenMon: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Chưa hoàn thành");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [khuVucBanList, setKhuVucBanList] = useState([]);
  const [selectedKhuVucBan, setSelectedKhuVucBan] = useState("");
  const [tenMons, setTenMons] = useState([]);
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;

  // Fetch data từ API
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${ipAddress}layCthdTheoCaLam?id_nhaHang=${id_nhaHang}`
      );
      setData(response.data);

      // Lấy danh sách tên món (Object.keys() sẽ trả về mảng tên món)
      const uniqueTenMons = Object.keys(response.data?.theoTenMon || {});
      setTenMons(uniqueTenMons);

      console.log("tenMon", tenMons);

      const khuVucBanSet = new Set();
      response.data.chuaHoanThanh
        .concat(response.data.hoanThanh)
        .forEach((item) => {
          const khuVucBan = `${item.khuVuc?.tenKhuVuc || "Không rõ"} - Bàn ${
            item.ban?.tenBan || "Không rõ"
          }`;
          khuVucBanSet.add(khuVucBan);
        });
      setKhuVucBanList(Array.from(khuVucBanSet));
      console.log("Khu vuc ban set ", khuVucBanSet);

      console.log("Khu vuc ban list", khuVucBanList);
    } catch (err) {
      setError("Vui lòng mở ca!");
    } finally {
      setLoading(false);
    }
  };

  // Update status (thay đổi trạng thái món)
  const updateStatus = async (id) => {
    try {
      await axios.put(`${ipAddress}capNhatTrangThaiCthd/${id}`);
      message.success("Hoàn thành món ăn!");
      fetchData();
    } catch (err) {
      setError("Không thể cập nhật trạng thái.");
      console.log(err);
    }
  };

  // Lấy dữ liệu lần đầu
  useEffect(() => {
    fetchData();
  }, []);

  // Lắng nghe sự kiện từ socket
  useEffect(() => {
    const socket = io("https://tce-restaurant-api.onrender.com");
    socket.on("lenMon", async () => {
      await axios
        .get(`${ipAddress}layCthdTheoCaLam?id_nhaHang=${id_nhaHang}`)
        .then((response) => {
          setData(response.data);
          const uniqueTenMons = Object.keys(response.data?.theoTenMon || {});
          setTenMons(uniqueTenMons);

          const khuVucBanSet = new Set();
          response.data.chuaHoanThanh
            .concat(response.data.hoanThanh)
            .forEach((item) => {
              const khuVucBan = `${item.khuVuc?.tenKhuVuc || "Không rõ"} - ${
                item.ban?.tenBan || "Không rõ"
              }`;
              khuVucBanSet.add(khuVucBan);
            });
          setKhuVucBanList(Array.from(khuVucBanSet));
        })
        .finally(() => message.success("Có order mới!"));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Tính toán dữ liệu hiển thị theo filter + search
  const filteredData = useMemo(() => {
    let result = [];

    // 1. Xử lý theo loại filter
    if (filter === "Chưa hoàn thành") {
      if (data.chuaHoanThanh.length === 0 && data.hoanThanh.length > 0) {
        result = data.hoanThanh;
        setSelectedFilter("");
        setSelectedKhuVucBan("");
      } else {
        result = data.chuaHoanThanh;
        setSelectedFilter("");
        setSelectedKhuVucBan("");
      }
    } else if (filter === "Hoàn thành") {
      result = data.hoanThanh;
      setSelectedFilter("");
      setSelectedKhuVucBan("");
    } else {
      result = data.theoTenMon[filter] || [];
    }

    const allData = [...data.chuaHoanThanh, ...data.hoanThanh];

    if (selectedKhuVucBan) {
      result = allData.filter((item) => {
        const khuVucBan = `${item.khuVuc?.tenKhuVuc || "Không rõ"} - Bàn ${
          item.ban?.tenBan || "Không rõ"
        }`;
        return khuVucBan === selectedKhuVucBan;
      });
    }

    // 2. Áp dụng search (tìm theo tên món)
    if (search) {
      const normalizedSearch = removeVietnameseTones(search);
      result = result.filter((item) =>
        removeVietnameseTones(item.id_monAn?.tenMon || "").includes(
          normalizedSearch
        )
      );
    }

    return result;
  }, [data, filter, search, selectedKhuVucBan]);

  const menu = (
    <Menu
      onClick={(e) => {
        setFilter(e.key);
        setSelectedFilter(e.key);
      }}
    >
      {tenMons.map((tenMon) => (
        <Menu.Item key={tenMon}>{tenMon}</Menu.Item>
      ))}
    </Menu>
  );

  const khuVucBanMenu = (
    <Menu
      onClick={(e) => {
        setFilter(e.key);
        setSelectedKhuVucBan(e.key);
      }}
    >
      {khuVucBanList.map((khuVucBan) => (
        <Menu.Item key={khuVucBan}>{khuVucBan}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout>
      <Content style={{ padding: "10px" }}>
        {/* HeaderBar: có ô search */}
        <HeaderBar onSearch={(value) => setSearch(value)} />

        {/* Loading + Error */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
            <div>Đang lấy thông tin món...</div>
          </div>
        ) : error ? (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
            closable
            onClose={() => setError("")}
          />
        ) : data.chuaHoanThanh.length === 0 && data.hoanThanh.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>Chưa có món ăn nào!</p>
          </div>
        ) : (
          <div>
            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button.Group>
                {["Chưa hoàn thành", "Hoàn thành"].map((item) => (
                  <Button
                    key={item}
                    type={filter === item ? "primary" : "default"}
                    onClick={() => setFilter(item)}
                    style={{ display: "inline-block", marginRight: 5 }}
                  >
                    {item}
                  </Button>
                ))}
              </Button.Group>
              <Dropdown className="dropdown-filter" overlay={menu}>
                <Button type="primary" icon={<FilterOutlined />}>
                  {selectedFilter === "" ? "Lọc theo tên món" : selectedFilter}
                </Button>
              </Dropdown>
              <Dropdown overlay={khuVucBanMenu} className="dropdown-filter">
                <Button type="primary" icon={<FilterOutlined />}>
                  {selectedKhuVucBan === ""
                    ? "Lọc theo khu vực - bàn"
                    : selectedKhuVucBan}
                </Button>
              </Dropdown>
            </div>

            {filter.length === 0 ? (
              <div style={{ textAlign: "center" }}>
                <p>Chưa có món ăn nào!</p>
              </div>
            ) : (
              <>
                {/* Danh sách món hiển thị */}
                <Row className="dish-list-container" gutter={[16, 16]}>
                  {filteredData.map((item) => (
                    <Col
                      className="dish-item"
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      key={item._id}
                    >
                      <div className="dish-card-wrapper">
                        <Card className="dish-card" hoverable>
                          <div className="dish-card-content">
                            <div className="dish-image">
                              <img
                                src={
                                  item.id_monAn?.anhMonAn || "/placeholder.png"
                                }
                                alt={item.id_monAn?.tenMon}
                              />
                            </div>
                            <div className="dish-details">
                              <div className="box1">
                                <h5>{item.id_monAn?.tenMon}</h5>
                                {item.trangThai === true ? (
                                  <p style={{ color: "green", margin: 0 }}>
                                    Hoàn thành
                                  </p>
                                ) : (
                                  <Checkbox
                                    style={{ fontSize: "0.8em" }}
                                    checked={false}
                                    onChange={() => updateStatus(item._id)}
                                  >
                                    Chưa hoàn thành
                                  </Checkbox>
                                )}
                              </div>
                              <p>
                                Khu vực: {item.khuVuc?.tenKhuVuc}{" "}
                                <span>- Bàn {item.ban?.tenBan}</span>
                              </p>
                              <p>Số lượng: {item.soLuongMon}</p>
                              <p>Ghi chú: {item.ghiChu || "Không có"}</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default QuanLyLenMon;
