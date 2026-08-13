const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// HOME / HEALTH CHECK
// ======================================================

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

// ======================================================
// VERIFY CUSTOMER
// ======================================================

app.post("/verify-customer", (req, res) => {
  const { customer_name } = req.body;

  console.log("Verify Customer Request:");
  console.log("Customer Name:", customer_name);

  if (!customer_name) {
    return res.status(400).json({
      success: false,
      verified: false,
      message: "Customer name is required."
    });
  }

  const normalizedName = customer_name
    .trim()
    .toLowerCase();

  // Demo customer
  if (normalizedName === "rahul sharma") {
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

// ======================================================
// GET CUSTOMER DETAILS
// ======================================================

app.post("/customer-details", (req, res) => {
  const { customer_id } = req.body;

  console.log("Customer Details Request:");
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

// ======================================================
// LOG PROMISE TO PAY
// ======================================================

app.post("/log-promise-to-pay", (req, res) => {
  console.log("======================================");
  console.log("LOG PROMISE TO PAY REQUEST");
  console.log("Request Body:", req.body);
  console.log("======================================");

  const {
    customer_id,
    promise_date,
    promise_amount
  } = req.body;

  console.log("Customer ID:", customer_id);
  console.log("Promise Date:", promise_date);
  console.log("Promise Amount:", promise_amount);

  // Check required fields
  if (!customer_id || !promise_date || promise_amount === undefined || promise_amount === null || promise_amount === "") {
    console.log("Missing promise-to-pay information.");

    return res.status(400).json({
      success: false,
      message: "Missing required promise-to-pay information.",
      received: {
        customer_id: customer_id || null,
        promise_date: promise_date || null,
        promise_amount:
          promise_amount !== undefined && promise_amount !== null
            ? promise_amount
            : null
      }
    });
  }

  // Check customer
  if (customer_id !== "KAP1001") {
    return res.status(404).json({
      success: false,
      message: "Customer not found."
    });
  }

  // Convert amount safely to number
  const amount = Number(promise_amount);

  if (Number.isNaN(amount)) {
    return res.status(400).json({
      success: false,
      message: "Promise amount must be a valid number."
    });
  }

  // Successful response
  console.log("Promise to pay recorded successfully.");

  return res.json({
    success: true,
    customer_id: customer_id,
    promise_date: promise_date,
    promise_amount: amount,
    currency: "INR",
    message: "Promise to pay recorded successfully."
  });
});

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found."
  });
});

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});