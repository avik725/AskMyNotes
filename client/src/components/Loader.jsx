import React from "react";

export default function Loader({
    title = "Loading your workspace",
    subtitle = "Please wait a moment..."
}) {
    return (
        <div className="page-loader">
            <div className="page-loader__wrapper">
                <div className="page-loader__spinner"></div>
                <div className="page-loader__inner-circle"></div>
            </div>
            <div className="page-loader__text">
                <p className="page-loader__title">{title}</p>
                <p className="page-loader__subtitle">{subtitle}</p>
            </div>
        </div>
    );
}
