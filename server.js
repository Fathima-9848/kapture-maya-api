const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    endpoint: "POST /verify-customer"
  });
});

// GET endpoint for browser testing
app.get("/verify-customer", (req, res) => {
  res.json({
    status: "API is running",
    endpoint: "POST /verify-customer"
  });
});

// Customer verification endpoint
app.post("/verify-customer", (req, res) => {
  console.log("Incoming request:", JSON.stringify(req.body));

  // Vapi tool-call request
  const toolCall = req.body?.message?.toolCallList?.[0];

  if (toolCall) {
    const toolCallId = toolCall.id;
    const customerName = toolCall.arguments?.customer_name;

    if (!customerName) {
      return res.status(200).json({
        results: [
          {
            toolCallId,
            result: JSON.stringify({
              verified: false,
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
            message: "Customer identity verified successfully"
          })
        }
      ]
    });
  }

  // Manual/API test request
  const { customer_name } = req.body || {};

  if (!customer_name) {
    return res.status(400).json({
      verified: false,
      message: "Customer name is required"
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

// Render uses process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});