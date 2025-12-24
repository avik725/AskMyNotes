import React from "react";

export default function Card({
  title,
  cardImg,
  description,
  onClick,
  ...props
}) {
  return (
    <div
      className="card border-0 px-2 cursor-pointer"
      onClick={onClick}
      {...props}
    >
      <div
        className="card-img rounded-3 border border-1 overflow-hidden position-relative"
        style={{ minHeight: 150 }}
      >
        <img src={cardImg} alt="icon" className="w-100 h-100" />
      </div>
      <div className="card-text pt-3">
        <p className="fs-16 fw-medium mb-1 text-capitalize">{title}</p>
        <p className="form-control-text-color">{description}</p>
      </div>
    </div>
  );
}
