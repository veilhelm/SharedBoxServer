const cron = require("node-cron")
const Lender = require('../models/lender.model')
const Tenant = require('../models/tenant.model')
const Inventory = require('../models/inventory.model')
const Space = require('../models/space.model')
const DateReserved = require('../models/dateReserved.model')
const moment = require("moment")
const {sendReminder1DayBeforeReservationToLender, sendReminder1DayBeforeReservationToTenant} = require("../utils/email")

const setReminderDayBefore = async function(userType,date,lender,tenant,spaceTitle){
  try {
    const initialDateMoment = moment(date.initialDate).subtract(1,'days')
    const reminderDayMoment = initialDateMoment.format("YYYY-MM-DD").split("-")
    let secondTask = cron.schedule(`* 9 ${reminderDayMoment[2]} ${reminderDayMoment[1]} * `, async function(){  
      userType === "lender" ? await sendReminder1DayBeforeReservationToLender(spaceTitle,date,tenant,lender) : await sendReminder1DayBeforeReservationToTenant(spaceTitle,date,tenant,lender)
      secondTask.stop();
    })
  } catch(err) {
    console.log(err.message)
  }
}

module.exports = {
  setReminderDayBefore
}