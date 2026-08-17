const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const PORT = process.env.PORT || 10000;

// --------------------------------------------------
// HOME
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    endpoints: [
      "POST /verify-customer",
      "POST /customer-details",
      "POST /log-promise-to-pay",
      "POST /vapi-webhook",
    ],
  });
});

// --------------------------------------------------
// VERIFY CUSTOMER
// --------------------------------------------------

app.post("/verify-customer", (req, res) => {
  console.log("================================");
  console.log("VERIFY CUSTOMER REQUEST");
  console.log("Body:", JSON.stringify(req.body));

  const customerName = req.body?.customer_name;

  console.log("Customer Name:", customerName);

  if (!customerName) {
    return res.status(400).json({
      success: false,
      verified: false,
      message: "customer_name is required",
    });
  }

  const normalizedName = customerName.trim().toLowerCase();

  if (normalizedName === "rahul sharma") {
    console.log("Customer VERIFIED");

    return res.status(200).json({
      success: true,
      verified: true,
      customer_id: "KAP1001",
      customer_name: "Rahul Sharma",
      message: "Customer identity verified successfully.",
    });
  }

  console.log("Customer NOT VERIFIED");

  return res.status(200).json({
    success: true,
    verified: false,
    customer_id: null,
    customer_name: customerName,
    message: "Customer identity could not be verified.",
  });
});

// --------------------------------------------------
// CUSTOMER DETAILS
// --------------------------------------------------

app.post("/customer-details", (req, res) => {
  console.log("================================");
  console.log("CUSTOMER DETAILS REQUEST");
  console.log("Body:", JSON.stringify(req.body));

  const customerId = req.body?.customer_id;

  console.log("Customer ID:", customerId);

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: "customer_id is required",
    });
  }

  if (customerId !== "KAP1001") {
    return res.status(200).json({
      success: false,
      message: "Customer not found.",
    });
  }

  return res.status(200).json({
    success: true,
    customer_id: "KAP1001",
    customer_name: "Rahul Sharma",
    loan_type: "Personal Loan",
    overdue_amount: 8499,
    currency: "INR",
    days_past_due: 12,
    due_date: "2026-08-20",
  });
});

// --------------------------------------------------
// LOG PROMISE TO PAY
// --------------------------------------------------

app.post("/log-promise-to-pay", (req, res) => {
  console.log("================================");
  console.log("PROMISE TO PAY REQUEST");
  console.log("Body:", JSON.stringify(req.body));

  const customerId = req.body?.customer_id;
  const promiseDate = req.body?.promise_date;
  const promiseAmount = req.body?.promise_amount;

  console.log("Customer ID:", customerId);
  console.log("Promise Date:", promiseDate);
  console.log("Promise Amount:", promiseAmount);

  if (!customerId || !promiseDate || !promiseAmount) {
    return res.status(400).json({
      success: false,
      message:
        "customer_id, promise_date and promise_amount are required.",
    });
  }

  return res.status(200).json({
    success: true,
    customer_id: customerId,
    promise_date: promiseDate,
    promise_amount: promiseAmount,
    message: "Promise to pay recorded successfully.",
  });
});

// --------------------------------------------------
// VAPI TOOL WEBHOOK
// --------------------------------------------------

app.post("/vapi-webhook", async (req, res) => {
  console.log("================================");
  console.log("VAPI WEBHOOK");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(200).json({
        results: [],
      });
    }

    if (message.type !== "tool-calls") {
      return res.status(200).json({
        results: [],
      });
    }

    const toolCalls = message.toolCallList || [];

    const results = [];

    for (const toolCall of toolCalls) {
      const toolName = toolCall.name;
      const toolCallId = toolCall.id;
      const parameters = toolCall.parameters || {};

      console.log("Tool Name:", toolName);
      console.log("Tool Call ID:", toolCallId);
      console.log("Parameters:", JSON.stringify(parameters));

      // ----------------------------------------------
      // VERIFY CUSTOMER
      // ----------------------------------------------

      if (toolName === "verify_customer") {
        const customerName = parameters.customer_name;

        console.log("VAPI VERIFY CUSTOMER:", customerName);

        let result;

        if (
          customerName &&
          customerName.trim().toLowerCase() === "rahul sharma"
        ) {
          result = {
            success: true,
            verified: true,
            customer_id: "KAP1001",
            customer_name: "Rahul Sharma",
            message: "Customer identity verified successfully.",
          };
        } else {
          result = {
            success: true,
            verified: false,
            customer_id: null,
            customer_name: customerName || "",
            message: "Customer identity could not be verified.",
          };
        }

        results.push({
          toolCallId: toolCallId,
          result: JSON.stringify(result),
        });
      }

      // ----------------------------------------------
      // CUSTOMER DETAILS
      // ----------------------------------------------

      else if (toolName === "customer_details") {
        const customerId = parameters.customer_id;

        console.log("VAPI CUSTOMER DETAILS:", customerId);

        let result;

        if (customerId === "KAP1001") {
          result = {
            success: true,
            customer_id: "KAP1001",
            customer_name: "Rahul Sharma",
            loan_type: "Personal Loan",
            overdue_amount: 8499,
            currency: "INR",
            days_past_due: 12,
            due_date: "2026-08-20",
          };
        } else {
          result = {
            success: false,
            message: "Customer details not found.",
          };
        }

        results.push({
          toolCallId: toolCallId,
          result: JSON.stringify(result),
        });
      }

      // ----------------------------------------------
      // LOG PROMISE TO PAY
      // ----------------------------------------------

      else if (toolName === "log_promise_to_pay") {
        const customerId = parameters.customer_id;
        const promiseDate = parameters.promise_date;
        const promiseAmount = parameters.promise_amount;

        console.log("VAPI PROMISE TO PAY");
        console.log("Customer ID:", customerId);
        console.log("Promise Date:", promiseDate);
        console.log("Promise Amount:", promiseAmount);

        const result = {
          success: true,
          customer_id: customerId,
          promise_date: promiseDate,
          promise_amount: promiseAmount,
          message: "Promise to pay recorded successfully.",
        };

        results.push({
          toolCallId: toolCallId,
          result: JSON.stringify(result),
        });
      }

      // ----------------------------------------------
      // UNKNOWN TOOL
      // ----------------------------------------------

      else {
        results.push({
          toolCallId: toolCallId,
          result: JSON.stringify({
            success: false,
            message: `Unknown tool: ${toolName}`,
          }),
        });
      }
    }

    console.log("VAPI RESPONSE:");
    console.log(JSON.stringify({ results }, null, 2));

    return res.status(200).json({
      results,
    });
  } catch (error) {
    console.error("VAPI WEBHOOK ERROR:", error);

    return res.status(200).json({
      results: [
        {
          toolCallId: req.body?.message?.toolCallList?.[0]?.id || "",
          error: "Tool execution failed.",
        },
      ],
    });
  }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});