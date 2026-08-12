const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    endpoints: [
      "POST /verify-customer",
      "POST /customer-details"
    ]
  });
});

// ========================================
// VERIFY CUSTOMER
// ========================================

app.post("/verify-customer", (req, res) => {
  console.log("========== VAPI VERIFY REQUEST ==========");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("==========================================");

  // Vapi tool call
  const toolCall = req.body?.message?.toolCallList?.[0];

  if (toolCall) {
    const toolCallId = toolCall.id;

    // Get tool arguments
    let args =
      toolCall.arguments ||
      toolCall.parameters ||
      toolCall.function?.arguments ||
      {};

    // Sometimes Vapi sends arguments as a JSON string
    if (typeof args === "string") {
      try {
        args = JSON.parse(args);
      } catch (error) {
        console.log("Could not parse tool arguments:", error);
        args = {};
      }
    }

    const customerName = String(
      args.customer_name || ""
    ).trim();

    console.log("Customer Name:", customerName);

    // -------------------------------
    // Missing customer name
    // -------------------------------

    if (!customerName) {
      console.log("VERIFICATION FAILED");

      return res.status(200).json({
        results: [
          {
            toolCallId: toolCallId,
            result: "VERIFICATION FAILED"
          }
        ]
      });
    }

    // -------------------------------
    // Successful verification
    // -------------------------------

    console.log("VERIFICATION SUCCESSFUL");
    console.log("Customer ID: KAP1001");

    return res.status(200).json({
      results: [
        {
          toolCallId: toolCallId,
          result: "VERIFIED"
        }
      ]
    });
  }

  // ========================================
  // MANUAL TEST REQUEST
  // ========================================

  const customerName = String(
    req.body?.customer_name || ""
  ).trim();

  if (!customerName) {
    return res.status(400).json({
      verified: false,
      message: "Customer name is required"
    });
  }

  return res.status(200).json({
    verified: true,
    customer_id: "KAP1001",
    customer_name: customerName,
    message: "VERIFIED"
  });
});

// ========================================
// CUSTOMER DETAILS
// ========================================

app.post("/customer-details", (req, res) => {
  console.log("========== VAPI CUSTOMER DETAILS ==========");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("============================================");

  // Vapi tool call
  const toolCall = req.body?.message?.toolCallList?.[0];

  if (toolCall) {
    const toolCallId = toolCall.id;

    // Get tool arguments
    let args =
      toolCall.arguments ||
      toolCall.parameters ||
      toolCall.function?.arguments ||
      {};

    // Parse JSON string if necessary
    if (typeof args === "string") {
      try {
        args = JSON.parse(args);
      } catch (error) {
        console.log(
          "Could not parse customer details arguments:",
          error
        );
        args = {};
      }
    }

    const customerId = String(
      args.customer_id || ""
    ).trim();

    console.log("Customer ID:", customerId);

    // -------------------------------
    // Invalid customer ID
    // -------------------------------

    if (customerId !== "KAP1001") {
      return res.status(200).json({
        results: [
          {
            toolCallId: toolCallId,
            result: "CUSTOMER DETAILS NOT FOUND"
          }
        ]
      });
    }

    // -------------------------------
    // Successful customer details
    // -------------------------------

    console.log("CUSTOMER DETAILS FOUND");

    return res.status(200).json({
      results: [
        {
          toolCallId: toolCallId,
          result:
            "Customer name: Rahul Sharma. " +
            "Account status: Active. " +
            "Outstanding amount: 5000 rupees. " +
            "Due date: August 20, 2026."
        }
      ]
    });
  }

  // ========================================
  // MANUAL TEST REQUEST
  // ========================================

  const customerId = String(
    req.body?.customer_id || ""
  ).trim();

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

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Kapture Maya API running on port ${PORT}`
  );
});