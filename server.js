const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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
            error: "Customer name is required"
          }
        ]
      });
    }

    return res.status(200).json({
      results: [
        {
          toolCallId,
          result: `Customer identity verified successfully. Customer ID: KAP1001. Customer name: ${customerName}.`
        }
      ]
    });
  }

  // Manual/test request
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

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Kapture Maya API running on port ${process.env.PORT || 3000}`
  );
});