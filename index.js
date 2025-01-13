const express = require("express");
const campaignRoute = require("./routes/campaigns.route.js");
const app = express();
const PORT = 8080;

app.use("/campaigns", campaignRoute);

app.listen(PORT, () => {
  console.log(`Server running on Port :${PORT}`);
});
