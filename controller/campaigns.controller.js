const campaigns = require("../model/campaigns.model.js");

const getTimeMed = (timeString) => {
  const [time, med] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (med === "PM" && hours !== 12) {
    hours += 12;
  }
  if (med === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

const ActivationDate = (startDate, schedule) => {
  const today = new Date();
  const campaignStart = new Date(startDate);

  if (today >= campaignStart) return "N/A";

  const currentDay = campaignStart.getDay();
  const currentDate = campaignStart.getDate();
  const currentMonth = campaignStart.getMonth();
  const currentYear = campaignStart.getFullYear();

  let nextDate = null;
  let min = null;

  schedule.forEach(({ weekdays, startTime }) => {
    weekdays.forEach((weekday) => {
      const weekdayIndex = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(weekday);

      let days = weekdayIndex - currentDay;
      if (days < 0) days += 7;

      const activationDate = new Date(
        currentYear,
        currentMonth,
        currentDate + days
      );

      const { hours, minutes } = getTimeMed(startTime);
      // console.log(hours,minutes);

      activationDate.setHours(hours, minutes, 0, 0);

      if (!nextDate || activationDate < nextDate) {
        nextDate = activationDate;

        if (nextDate.getHours() < min || min === null) {
          min = nextDate;
        }
        if (nextDate.getHours() === min.getHours()) {
          if (nextDate.getMinutes() < min) {
            min = nextDate;
          }
        }
      }
    });
  });

  return min ? min.toISOString() : "N/A";
};
const getCampaign = (req, res) => {
  const result = campaigns.map((campaign) => {
    const nextActivation = ActivationDate(
      campaign.startDate,
      campaign.schedule
    );

    return {
      campaignType: campaign.campaignType,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      nextScheduledActivation: nextActivation,
    };
  });

  res.json(result);
};
const getcampaignByID = (req, res) => {
  const id = req.params.id;
  const campaign = campaigns.find((campaign) => campaign._id === id);
  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }
  const nextActivation = ActivationDate(campaign.startDate, campaign.schedule);
  res.json({
    campaignType: campaign.campaignType,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    nextScheduledActivation: nextActivation,
  });
};

module.exports = {
  getCampaign,
  getcampaignByID,
};
