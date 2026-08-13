const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Health check
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

// ----------------------------------------------------
// VERIFY CUSTOMER
// ----------------------------------------------------
app.post("/verify-customer", (req, res) => {
  console.log("================================");
  console.log("VERIFY CUSTOMER REQUEST");
  console.log("Full body:", JSON.stringify(req.body, null, 2));

  // Accept normal REST request
  let customerName = req.body?.customer_name;

  // Accept Vapi tool-call formats
  if (!customerName && req.body?.message?.toolCallList?.length) {
    const toolCall = req.body.message.toolCallList[0];

    customerName =
      toolCall?.function?.arguments?.customer_name ||
      toolCall?.parameters?.customer_name ||
      toolCall?.args?.customer_name;
  }

  if (!customerName && req.body?.message?.toolCalls?.length) {
    const toolCall = req.body.message.toolCalls[0];

    customerName =
      toolCall?.function?.arguments?.customer_name ||
      toolCall?.parameters?.customer_name ||
      toolCall?.args?.customer_name;
  }

  console.log("Customer Name:", customerName);

  if (!customerName) {
    return res.status(400).json({
      success: false,
      verified: false,
      message: "customer_name is required"
    });
  }

  const normalizedName = String(customerName)
    .trim()
    .toLowerCase();

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
    customer_id: null,
    customer_name: customerName,
    message: "Customer identity could not be verified."
  });
});

// ----------------------------------------------------
// CUSTOMER DETAILS
// ----------------------------------------------------
app.post("/customer-details", (req, res) => {
  console.log("================================");
  console.log("CUSTOMER DETAILS REQUEST");
  console.log("Full body:", JSON.stringify(req.body, null, 2));

  let customerId = req.body?.customer_id;

  // Support Vapi tool-call format
  if (!customerId && req.body?.message?.toolCallList?.length) {
    const toolCall = req.body.message.toolCallList[0];

    customerId =
      toolCall?.function?.arguments?.customer_id ||
      toolCall?.parameters?.customer_id ||
      toolCall?.args?.customer_id;
  }

  if (!customerId && req.body?.message?.toolCalls?.length) {
    const toolCall = req.body.message.toolCalls[0];

    customerId =
      toolCall?.function?.arguments?.customer_id ||
      toolCall?.parameters?.customer_id ||
      toolCall?.args?.customer_id;
  }

  console.log("Customer ID:", customerId);

  if (customerId !== "KAP1001") {
    return res.status(404).json({
      success: false,
      message: "Customer not found."
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
    due_date: "2026-08-20"
  });
});

// ----------------------------------------------------
// LOG PROMISE TO PAY
// ----------------------------------------------------
app.post("/log-promise-to-pay", (req, res) => {
  console.log("================================");
  console.log("LOG PROMISE TO PAY REQUEST");
  console.log("Full body:", JSON.stringify(req.body, null, 2));

  let customerId = req.body?.customer_id;
  let promiseDate = req.body?.promise_date;
  let promiseAmount = req.body?.promise_amount;

  // Support Vapi tool-call format
  if (req.body?.message?.toolCallList?.length) {
    const toolCall = req.body.message.toolCallList[0];

    customerId =
      customerId ||
      toolCall?.function?.arguments?.customer_id ||
      toolCall?.parameters?.customer_id ||
      toolCall?.args?.customer_id;

    promiseDate =
      promiseDate ||
      toolCall?.function?.arguments?.promise_date ||
      toolCall?.parameters?.promise_date ||
      toolCall?.args?.promise_date;

    promiseAmount =
      promiseAmount ||
      toolCall?.function?.arguments?.promise_amount ||
      toolCall?.parameters?.promise_amount ||
      toolCall?.args?.promise_amount;
  }

  if (req.body?.message?.toolCalls?.length) {
    const toolCall = req.body.message.toolCalls[0];

    customerId =
      customerId ||
      toolCall?.function?.arguments?.customer_id ||
      toolCall?.parameters?.customer_id ||
      toolCall?.args?.customer_id;

    promiseDate =
      promiseDate ||
      toolCall?.function?.arguments?.promise_date ||
      toolCall?.parameters?.promise_date ||
      toolCall?.args?.promise_date;

    promiseAmount =
      promiseAmount ||
      toolCall?.function?.arguments?.promise_amount ||
      toolCall?.parameters?.promise_amount ||
      toolCall?.args?.promise_amount;
  }

  console.log("Customer ID:", customerId);
  console.log("Promise Date:", promiseDate);
  console.log("Promise Amount:", promiseAmount);

  if (!customerId || !promiseDate || !promiseAmount) {
    return res.status(400).json({
      success: false,
      message:
        "customer_id, promise_date and promise_amount are required"
    });
  }

  return res.json({
    success: true,
    customer_id: customerId,
    promise_date: promiseDate,
    promise_amount: String(promiseAmount),
    message: "Promise to pay recorded successfully."
  });
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});