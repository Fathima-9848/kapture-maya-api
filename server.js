const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// HEALTH CHECK
// =====================================================

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

// =====================================================
// VERIFY CUSTOMER - GET TEST
// =====================================================

app.get("/verify-customer", (req, res) => {
  res.json({
    status: "API is running",
    endpoint: "POST /verify-customer"
  });
});

// =====================================================
// VERIFY CUSTOMER
// =====================================================

app.post("/verify-customer", (req, res) => {
  console.log("========== VERIFY CUSTOMER ==========");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("=====================================");

  // Support Vapi tool calls
  const toolCall = req.body?.message?.toolCallList?.[0];

  // ---------------------------------------------------
  // VAPI REQUEST
  // ---------------------------------------------------

  if (toolCall) {
    const toolCallId = toolCall.id;

    const customerName =
      toolCall.arguments?.customer_name ||
      req.body?.message?.toolCallList?.[0]?.function?.arguments?.customer_name;

    console.log("Customer Name:", customerName);

    if (!customerName) {
      return res.status(200).json({
        results: [
          {
            toolCallId,
            result: JSON.stringify({
              verified: false,
              customer_id: "",
              customer_name: "",
              message: "Customer name is required"
            })
          }
        ]
      });
    }

    return res.status(200).json({
      results: [
        {
          toolCallId,
          result: JSON.stringify({
            verified: true,
            customer_id: "KAP1001",
            customer_name: customerName,
            message: "VERIFICATION SUCCESSFUL"
          })
        }
      ]
    });
  }

  // ---------------------------------------------------
  // MANUAL TEST REQUEST
  // ---------------------------------------------------

  const { customer_name } = req.body || {};

  if (!customer_name) {
    return res.status(400).json({
      verified: false,
      message: "Customer name is required"
    });
  }

  return res.status(200).json({
    verified: true,
    customer_id: "KAP1001",
    customer_name,
    message: "Customer identity verified successfully"
  });
});

// =====================================================
// CUSTOMER DETAILS - GET TEST
// =====================================================

app.get("/customer-details", (req, res) => {
  res.json({
    status: "API is running",
    endpoint: "POST /customer-details"
  });
});

// =====================================================
// CUSTOMER DETAILS
// =====================================================

app.post("/customer-details", (req, res) => {
  console.log("========== CUSTOMER DETAILS ==========");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("======================================");

  const toolCall = req.body?.message?.toolCallList?.[0];

  let customerId;

  // Vapi tool request
  if (toolCall) {
    customerId = toolCall.arguments?.customer_id;

    console.log("Customer ID:", customerId);

    if (customerId !== "KAP1001") {
      return res.status(200).json({
        results: [
          {
            toolCallId: toolCall.id,
            result: JSON.stringify({
              success: false,
              message: "Customer details could not be found."
            })
          }
        ]
      });
    }

    return res.status(200).json({
      results: [
        {
          toolCallId: toolCall.id,
          result: JSON.stringify({
            customer_id: "KAP1001",
            customer_name: "Rahul Sharma",
            account_status: "Active",
            outstanding_amount: 5000,
            due_date: "2026-08-20",
            message: "Customer details retrieved successfully."
          })
        }
      ]
    });
  }

  // Manual/API test
  customerId = req.body?.customer_id;

  if (customerId !== "KAP1001") {
    return res.status(404).json({
      message: "Customer details could not be found."
    });
  }

  return res.status(200).json({
    customer_id: "KAP1001",
    customer_name: "Rahul Sharma",
    account_status: "Active",
    outstanding_amount: 5000,
    due_date: "2026-08-20",
    message: "Customer details retrieved successfully."
  });
});

// =====================================================
// LOG PROMISE TO PAY
// =====================================================

app.post("/log-promise-to-pay", (req, res) => {
  console.log("========== PROMISE TO PAY ==========");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("====================================");

  const toolCall = req.body?.message?.toolCallList?.[0];

  // ---------------------------------------------------
  // VAPI REQUEST
  // ---------------------------------------------------

  if (toolCall) {
    const toolCallId = toolCall.id;

    const customerId = toolCall.arguments?.customer_id;
    const promiseDate = toolCall.arguments?.promise_date;
    const promiseAmount = toolCall.arguments?.promise_amount;

    console.log("Customer ID:", customerId);
    console.log("Promise Date:", promiseDate);
    console.log("Promise Amount:", promiseAmount);

    if (!customerId || !promiseDate || promiseAmount === undefined) {
      return res.status(200).json({
        results: [
          {
            toolCallId,
            result: JSON.stringify({
              success: false,
              message:
                "Customer ID, promise date, and promise amount are required."
            })
          }
        ]
      });
    }

    // Only allow promises from our verified demo customer
    if (customerId !== "KAP1001") {
      return res.status(200).json({
        results: [
          {
            toolCallId,
            result: JSON.stringify({
              success: false,
              message: "Customer is not verified."
            })
          }
        ]
      });
    }

    // Mock successful PTP recording
    console.log("PROMISE TO PAY RECORDED");
    console.log({
      customerId,
      promiseDate,
      promiseAmount
    });

    return res.status(200).json({
      results: [
        {
          toolCallId,
          result: JSON.stringify({
            success: true,
            customer_id: customerId,
            promise_date: promiseDate,
            promise_amount: promiseAmount,
            message: "Promise to pay recorded successfully."
          })
        }
      ]
    });
  }

  // ---------------------------------------------------
  // MANUAL/API TEST
  // ---------------------------------------------------

  const {
    customer_id,
    promise_date,
    promise_amount
  } = req.body || {};

  if (!customer_id || !promise_date || promise_amount === undefined) {
    return res.status(400).json({
      success: false,
      message:
        "Customer ID, promise date, and promise amount are required."
    });
  }

  if (customer_id !== "KAP1001") {
    return res.status(400).json({
      success: false,
      message: "Customer is not verified."
    });
  }

  return res.status(200).json({
    success: true,
    customer_id,
    promise_date,
    promise_amount,
    message: "Promise to pay recorded successfully."
  });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});