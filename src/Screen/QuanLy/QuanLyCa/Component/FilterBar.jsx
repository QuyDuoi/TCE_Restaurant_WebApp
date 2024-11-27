import React from "react";
import { DatePicker } from "antd";

const FilterBar = ({ onDateChange }) => {
    const handleDateChange = (date, dateString) => {
        onDateChange(dateString);
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <DatePicker
                style={{ width: "100%" }}
                onChange={handleDateChange}
            />
        </div>
    );
};

export default FilterBar;
