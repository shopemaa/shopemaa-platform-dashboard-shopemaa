import React from 'react';

const PoweredBy = () => (
    <div
        className="text-center w-100"
        style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#4c6157",        // a muted version of your brand green
            marginTop: 34,
            padding: "12px 0 8px 0",
            letterSpacing: "0.01em",
            userSelect: "none"
        }}
    >
        Powered by{" "}
        <a
            href="https://qrcentraal.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                color: "#214a3b",
                fontWeight: 700,
                textDecoration: "underline",
                textDecorationThickness: "1.4px",
                textUnderlineOffset: "2.5px",
                transition: "color .15s"
            }}
            onMouseOver={e => (e.currentTarget.style.color = "#18372b")}
            onMouseOut={e => (e.currentTarget.style.color = "#214a3b")}>
            QR Centraal
        </a>
    </div>
);

export default PoweredBy;
