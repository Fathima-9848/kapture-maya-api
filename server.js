const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.post("/verify-customer", (req, res) => {
  console.log("Verification request:", req.body);

  const { customer_name } = req.body || {};

  if (!customer_name) {
    return res.status(400).json({
      verified: false,
      message: "Customer name is required",
    });
  }

  return res.json({
    verified: true,
    customer_id: "KAP1001",
    customer_name: customer_name,
    message: "Customer identity verified successfully",
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      verified: false,
      message: "Invalid JSON request body",
    });
  }

  next(err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Kapture Maya API running on port ${PORT}`);
});