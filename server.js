const express = require("express");

const app = express();

app.use(express.json());

app.post("/verify-customer", (req, res) => {
  const { customer_name } = req.body;

  console.log("Verification request:", req.body);

  if (!customer_name) {
    return res.status(400).json({
      verified: false,
      message: "Customer name is required",
    });
  }

  res.json({
    verified: true,
    customer_id: "KAP1001",
    customer_name: customer_name,
    message: "Customer identity verified successfully",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});