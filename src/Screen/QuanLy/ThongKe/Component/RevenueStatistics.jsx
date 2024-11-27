import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styled from "styled-components";

const StatisticsCard = ({ title, items }) => {
  return (
    <Container>
      <Title>{title}</Title>
      {items.map((item, index) => (
        <Item key={index}>
          <CircleWrapper>
            <CircularProgressbar
              value={item.percentage}
              text={`${item.percentage ?? 0}%`}
              styles={buildStyles({
                textColor: item.color,
                pathColor: item.color,
                trailColor: "#f0f0f0",
              })}
            />
          </CircleWrapper>
          <Details>
            <Label>{item.label}</Label>
            <Value>{item.value} đ</Value>
          </Details>
        </Item>
      ))}
    </Container>
  );
};

export default StatisticsCard;

// Styled components
const Container = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding-Left: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-Left: 40px ;
  width: 700px;

`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0px;
  padding-bottom:20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const CircleWrapper = styled.div`
  width: 70px;
  height: 70px;
  margin-right: 20px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const Value = styled.div`
  font-size: 16px;
  color: #e74c3c;
  font-weight: bold;
`;
