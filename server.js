const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    endpoints: [
      "POST /verify-customer",
      "POST /customer-details"
    ]
  });
});

// GET endpoint for browser testing
app.get("/verify-customer", (req, res) => {
  res.json({
    status: "API is running",
    endpoint: "POST /verify-customer"
  });
});

// ===============================
// VERIFY CUSTOMER
// ===============================
app.post("/verify-customer", (req, res) => {
  console.log("Verify request:", JSON.stringify(req.body));

  const toolCall = req.body?.message?.toolCallList?.[0];

  // Vapi request
  if (toolCall) {
    const toolCallId = toolCall.id;
    const customerName = toolCall.arguments?.customer_name;

    if (!customerName) {
      return res.status(200).json({
        results: [
          {
            toolCallId,
            result: "VERIFICATION FAILED. Customer name is required."
          }
        ]
      });
    }

    return res.status(200).json({
      results: [
        {
          toolCallId,
          result: `VERIFICATION SUCCESSFUL. Customer identity has been verified. Customer ID: KAP1001. Customer name: ${customerName}.`
        }
      ]
    });
  }

  // Manual/API request
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

// ===============================
// CUSTOMER DETAILS
// ===============================
app.post("/customer-details", (req, res) => {
  console.log("Customer details request:", JSON.stringify(req.body));

  const toolCall = req.body?.message?.toolCallList?.[0];

  // Vapi request
  if (toolCall) {
    const toolCallId = toolCall.id;
    const customerId = toolCall.arguments?.customer_id;

    if (!customerId) {
      return res.status(200).json({
        results: [
          {
            toolCallId,
            result: "Customer ID is required."
          }
        ]
      });
    }

    if (customerId !== "KAP1001") {
      return res.status(200).json({
        results: [
          {
            toolCallId,
            result: "Customer details could not be found."
          }
        ]
      });
    }

    return res.status(200).json({
      results: [
        {
          toolCallId,
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

  // Manual/API request
  const { customer_id } = req.body || {};

  if (customer_id !== "KAP1001") {
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

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});