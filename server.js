const express = require("express");
const cors = require("cors");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    endpoints: [
      "POST /verify-customer",
      "POST /customer-details",
      "POST /log-promise-to-pay"
    ]
  });
});

// ===============================
// VERIFY CUSTOMER
// ===============================

app.post("/verify-customer", (req, res) => {
  console.log("================================");
  console.log("VERIFY CUSTOMER");
  console.log("Request Body:", req.body);
  console.log("================================");

  const { customer_name } = req.body;

  console.log("Customer Name:", customer_name);

  if (!customer_name) {
    return res.status(400).json({
      success: false,
      verified: false,
      message: "Customer name is required."
    });
  }

  if (customer_name.trim().toLowerCase() === "rahul sharma") {
    return res.json({
      success: true,
      verified: true,
      customer_id: "KAP1001",
      customer_name: "Rahul Sharma",
      message: "Customer identity verified successfully."
    });
  }

  return res.json({
    success: true,
    verified: false,
    message: "Customer identity could not be verified."
  });
});

// ===============================
// CUSTOMER DETAILS
// ===============================

app.post("/customer-details", (req, res) => {
  console.log("================================");
  console.log("CUSTOMER DETAILS");
  console.log("Request Body:", req.body);
  console.log("================================");

  const { customer_id } = req.body;

  console.log("Customer ID:", customer_id);

  if (!customer_id) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required."
    });
  }

  if (customer_id !== "KAP1001") {
    return res.status(404).json({
      success: false,
      message: "Customer account not found."
    });
  }

  return res.json({
    success: true,
    customer_id: "KAP1001",
    customer_name: "Rahul Sharma",
    loan_type: "Personal Loan",
    overdue_amount: 8499,
    currency: "INR",
    days_past_due: 12,
    due_date: "2026-08-20",
    message: "Customer details retrieved successfully."
  });
});

// ===============================
// LOG PROMISE TO PAY
// ===============================

app.post("/log-promise-to-pay", (req, res) => {
  console.log("================================");
  console.log("LOG PROMISE TO PAY");
  console.log("Request Body:", req.body);
  console.log("================================");

  const {
    customer_id,
    promise_date,
    promise_amount
  } = req.body;

  console.log("Customer ID:", customer_id);
  console.log("Promise Date:", promise_date);
  console.log("Promise Amount:", promise_amount);

  if (
    !customer_id ||
    !promise_date ||
    promise_amount === undefined ||
    promise_amount === null ||
    promise_amount === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required promise-to-pay information.",
      received: {
        customer_id: customer_id || null,
        promise_date: promise_date || null,
        promise_amount:
          promise_amount !== undefined &&
          promise_amount !== null
            ? promise_amount
            : null
      }
    });
  }

  if (customer_id !== "KAP1001") {
    return res.status(404).json({
      success: false,
      message: "Customer not found."
    });
  }

  const amount = Number(promise_amount);

  if (Number.isNaN(amount)) {
    return res.status(400).json({
      success: false,
      message: "Promise amount must be a valid number."
    });
  }

  return res.json({
    success: true,
    customer_id,
    promise_date,
    promise_amount: amount,
    currency: "INR",
    message: "Promise to pay recorded successfully."
  });
});

// ===============================
// 404
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found."
  });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});