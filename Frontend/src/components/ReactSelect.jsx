import React from "react";
import Select from "react-select";

export default function ReactSelect({
  id,
  name,
  label,
  value,
  onChangeFn,
  divSpacing = "mb-3",
  options,
  placeholder = "Select...",
}) {
  return (
    <div className={divSpacing}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <Select
        name={name}
        id={id}
        placeholder={placeholder}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "#f8f9fa",
            border: "1px solid #d1d6e3",
            borderRadius: "16px",
            padding: "10px 3px",
          }),
        }}
        defaultValue={""}
        onChange={onChangeFn}
        value={options?.filter((option) => {
          return option.value === value;
        })}
        options={options}
      />
    </div>
  );
}
