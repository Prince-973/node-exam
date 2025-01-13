const express = require("express");
const {
  getCampaign,
  getcampaignByID,
} = require("../controller/campaigns.controller.js");
const route = express.Router();

route.get("/", getCampaign);
route.get("/:id", getcampaignByID);

module.exports = route;
