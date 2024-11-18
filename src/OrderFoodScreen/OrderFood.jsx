import React, { useState } from "react";
import "./OrderFood.css"; // Tạo file CSS riêng để định dạng

// Dữ liệu mẫu
const sampleDishes = [
  {
    id: 1,
    name: "Cơm thập cẩm",
    note: "Món ăn thường được thêm nước sốt hoặc nước tương để tăng hương vị.",
    price: 59400,
    image: "https://via.placeholder.com/100", // Hình ảnh giả
  },
  // Thêm dữ liệu món ăn mẫu khác nếu cần
];

const OrderFood = () => {
  const [orderList, setOrderList] = useState([]);
  const maxItems = 6;

  // Thêm món vào danh sách order
  const addToOrder = (dish) => {
    const existingDish = orderList.find((item) => item.id === dish.id);
    if (existingDish) {
      setOrderList(
        orderList.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderList([...orderList, { ...dish, quantity: 1 }]);
    }
  };

  // Tăng số lượng món
  const increaseQuantity = (id) => {
    setOrderList(
      orderList.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Giảm số lượng món
  const decreaseQuantity = (id) => {
    setOrderList(
      orderList
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Tính giá tổng
  const calculatePrice = (price, quantity) => price * quantity;

  // Xóa danh sách order
  const clearOrder = () => {
    setOrderList([]);
  };

  return (
    <div className="restaurant-app">
      {/* Khu vực danh mục và món ăn */}
      <div className="menu-section">
        <h3>Khu vực: Tầng 1 - Bàn 3</h3>
        <input type="text" placeholder="Tìm món ăn" className="search-input" />
        <div className="categories">
          <button className="category active">Tất cả</button>
          <button className="category">Món nước</button>
          <button className="category">Tráng miệng</button>
          {/* Thêm danh mục khác nếu cần */}
        </div>
        <div className="dishes">
          {sampleDishes.map((dish) => (
            <div className="dish" key={dish.id}>
              <img src={dish.image} alt={dish.name} />
              <div className="dish-info">
                <h4>{dish.name}</h4>
                <p>{dish.note}</p>
                <div className="dish-footer">
                  <span>{dish.price.toLocaleString()}đ</span>
                  <button onClick={() => addToOrder(dish)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khu vực danh sách order */}
      <div className="order-section">
        <h3>Danh sách order</h3>
        <div className="order-list">
          {orderList.slice(0, maxItems).map((item) => (
            <div className="order-item" key={item.id}>
              <span>{item.name}</span>
              <div className="order-quantity">
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
              </div>
              <span>{calculatePrice(item.price, item.quantity).toLocaleString()}đ</span>
            </div>
          ))}
          {orderList.length > maxItems && (
            <div className="scroll-indicator">...</div>
          )}
        </div>
        <div className="order-actions">
          <button className="cancel-btn" onClick={clearOrder}>
            Hủy thông tin
          </button>
          <button className="confirm-btn">Xác nhận gọi món</button>
        </div>
      </div>
    </div>
  );
};

export default OrderFood;
