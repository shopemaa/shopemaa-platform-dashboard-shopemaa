import React, {forwardRef, useRef} from "react";

const BRAND_COLOR = "#214a3b";

// Example kitchen order slip data
const EXAMPLE_ORDER = {
    id: "ORD-2012",
    time: "12:44 PM",
    type: "Dine In",
    table: "T04",
    customer: "Rahim",
    items: [
        {name: "Margherita Pizza", qty: 2, notes: "No onions"},
        {name: "Coke", qty: 2}
    ],
    note: "Cut into 6 slices."
};

const KitchenSlipPrint = forwardRef(({order = EXAMPLE_ORDER}, ref) => (
    <div ref={ref} style={{
        fontFamily: "monospace, Menlo, monospace",
        width: 260,
        margin: "0 auto",
        background: "#fff",
        color: "#212529",
        border: "1px dashed #e3e3e3",
        borderRadius: 8,
        boxSizing: "border-box",
        padding: 12
    }}>
        <div style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 17,
            letterSpacing: "1px",
            color: BRAND_COLOR,
            marginBottom: 2
        }}>
            KITCHEN TICKET
        </div>
        <div style={{
            textAlign: "center",
            fontSize: 13,
            color: "#777",
            marginBottom: 10
        }}>
            {order.time} | {order.type}
        </div>
        <div style={{
            display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 3
        }}>
            <span style={{fontWeight: 700}}>Order:</span>
            <span>{order.id}</span>
        </div>
        <div style={{
            display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 8
        }}>
            <span style={{fontWeight: 700}}>Table:</span>
            <span>{order.table || "-"}</span>
        </div>
        <div style={{
            borderTop: "1px dashed #aaa", margin: "8px 0"
        }}></div>
        <div style={{
            fontWeight: 700, fontSize: 15, marginBottom: 5, color: BRAND_COLOR, letterSpacing: ".6px"
        }}>Items:
        </div>
        {order.items.map((item, idx) => (
            <div key={idx} style={{fontSize: 15, marginBottom: 3, display: "flex", alignItems: "flex-start"}}>
        <span style={{
            fontWeight: 700, fontSize: 16, width: 22, display: "inline-block"
        }}>{item.qty}x</span>
                <span style={{flexGrow: 1}}>{item.name}</span>
                {item.notes &&
                    <span style={{
                        fontWeight: 500, color: "#d63939", fontSize: 13,
                        marginLeft: 4, fontStyle: "italic"
                    }}>({item.notes})</span>
                }
            </div>
        ))}
        <div style={{
            borderTop: "1px dashed #aaa", margin: "8px 0"
        }}></div>
        {order.note && (
            <div style={{
                fontWeight: 700, fontSize: 14, color: "#d63939", margin: "7px 0"
            }}>
                SPECIAL: <span style={{
                fontWeight: 500, color: "#212529", fontSize: 14
            }}>{order.note}</span>
            </div>
        )}
        <div style={{
            textAlign: "center",
            fontSize: 13,
            marginTop: 13,
            letterSpacing: ".6px",
            color: "#888"
        }}>
            — Powered by QR Centraal —
        </div>
        {/* Print styles */}
        <style>{`
      @media print {
        body { background: #fff !important; }
        .no-print { display: none !important; }
        * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
      }
    `}</style>
    </div>
));

export default function KitchenSlipPrintDemo({order}) {
    const printRef = useRef();

    // For print: window.print() will print the page,
    // For print a single slip: use a library like react-to-print or printJS,
    // or open in a new window for auto-print.

    const handlePrint = () => {
        // Opens in a new window for most direct kitchen station use.
        const printContent = printRef.current.innerHTML;
        const win = window.open("", "PRINT", "height=500,width=300");
        win.document.write(`
      <html>
        <head>
          <title>Print Slip</title>
          <style>
            body { margin: 0; background: #fff; }
            * { font-family: monospace; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div ref={printRef}>
                <KitchenSlipPrint order={order || EXAMPLE_ORDER}/>
            </div>
            <button
                className="btn mt-3 no-print"
                style={{background: BRAND_COLOR, color: "#fff", fontWeight: 600, borderRadius: 10, padding: "8px 24px"}}
                onClick={handlePrint}
            >
                Print Kitchen Slip
            </button>
        </div>
    );
}
