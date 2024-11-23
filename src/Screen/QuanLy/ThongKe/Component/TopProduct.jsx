import React, { useEffect, useState } from "react";
import styled from "styled-components";

const TopProducts = ({ data }) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let hideTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(hideTimeout);

      hideTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };
    const container = document.querySelector("#scrollable-container");
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container id="scrollable-container" isScrolling={isScrolling}>
      <Title>{data.title}</Title>
      {data.items.map((item, index) => (
        <ProductItem key={index}>
          <Rank>{item.rank}</Rank>
          <ProductInfo>
            <ProductImage src={item.image} alt={item.label} />
            <Details>
              <ProductName>{item.label}</ProductName>
              <Quantity>Số lượng: {item.quantity}</Quantity>
            </Details>
          </ProductInfo>
          <ProgressWrapper>
            <ProgressBar color={item.color} percentage={item.percentage} />
            <Percentage>{item.percentage}%</Percentage>
          </ProgressWrapper>
        </ProductItem>
      ))}
    </Container>
  );
};

export default TopProducts;

// Styled components
const Container = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  margin-top: 30px;
  padding-left: 25px;
  padding-right: 25px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  width: 92%;
  max-height: 350px; /* Fix chiều cao tối đa */
  overflow-y: auto; /* Thêm thanh cuộn nếu nội dung vượt quá */
  scrollbar-width: ${(props) => (props.isScrolling ? "thin" : "none")}; 
  &::-webkit-scrollbar {
    width: ${(props) => (props.isScrolling ? "4px" : "0")}; 
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc; 
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent; 
  }
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const Rank = styled.div`
  font-size: 18px;
  font-weight: bold;
  width: 40px;
  text-align: center;
  color: #555;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 15px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover; /* Giúp ảnh giữ tỉ lệ */
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Quantity = styled.div`
  font-size: 14px;
  color: #777;
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 250px;
`;

const ProgressBar = styled.div`
  height: 10px;
  flex: 1;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 15px;

  &::before {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => props.percentage}%;
    background-color: ${(props) => props.color};
    border-radius: 5px;
  }
`;

const Percentage = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #555;
`;
