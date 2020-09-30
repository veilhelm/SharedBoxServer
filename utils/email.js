const sgMail = require('@sendgrid/mail');

const sendRegistrationEmailToLender = async (lender, tenant, spaceTitle) => {
  let mail = {
    to: `${lender.email}`,
    from: 'sharedbox.tech@gmail.com',
    subject: ` Hi ${lender.name}!! your space has a request for reservation in SharedBox!`,
    text: `Dear ${lender.name}, we are glad to tell you that your space ${spaceTitle} has a reservation request
        from ${tenant.name}`,
    html: `<h4>Dear ${lender.name}, we are glad to tell you that your space ${spaceTitle} has a reservation request
    from ${tenant.name}</h4><br><br>
    <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> where you would be able to accept or reject ${tenant.name}'s offer</strong>`,
  }  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send(mail)  
}

const sendOfferRejectionEmailToTenant = async (titleSpace,tenant,nameLender) => {
  let mail = {
    to: `${tenant.email}`,
    from: 'sharedbox.tech@gmail.com',
    subject: `Hi ${tenant.name}!! your offer for the space${titleSpace} was rejected`,
    text: `Dear ${tenant.name}, we are sorry to tell you that your offer for the space ${titleSpace} was rejected by ${nameLender}`,
    html:`<h4>Dear ${tenant.name}, we are sorry to tell you that your offer for the space ${titleSpace} was rejected by ${nameLender}</h4><br><br>
    <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> and don't worry we will help you to find the best space for you</strong>`,
  }  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send(mail)  
}

const sendOfferAcceptedEmailToTenant = async (titleSpace,initialDate,finalDate,tenant,nameLender) => {
  let mail = {
    to: `${tenant.email}`,
    from: 'sharedbox.tech@gmail.com',
    subject: `Hi ${tenant.name}!! your offer for the space${titleSpace} was Accepted!!`,
    text: `Dear ${tenant.name}, we are glad to tell you that your offer for the space ${titleSpace} was accepted by ${nameLender}`,
    html:`<h4>Dear ${tenant.name}, we are glad to tell you that your offer for the space ${titleSpace} was accepted by ${nameLender}</br>from ${initialDate} to ${finalDate} </h4><br><br>
    <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> to see more information about your transaction</strong>`,
  }  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send(mail)  
}

const sendPayResultEmailToTenant = async (titleSpace,initialDate,finalDate,tenant,nameLender) => {
  let mail = {
    to: `${tenant.email}`,
    from: 'sharedbox.tech@gmail.com',
    subject: `Hi ${tenant.name}!! your transaction for the space${titleSpace} was Successful!!`,
    text: `Dear ${tenant.name}, we are glad to tell you that your offer for the space ${titleSpace} was successfully paid`,
    html:`<h4>Dear ${tenant.name}, we are glad to tell you that your transaction to rent the space ${titleSpace} was successfully taken by the Bank.
    </br>So from ${initialDate} to ${finalDate} the space is yours; congratulations!! be aware of your notifications on ${initialDate}, because the lender ${nameLender}
    is going to send you your inventory checklist.</h4><br><br>
    <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> to see more information about your transaction</strong>`,
  }  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send(mail)  
}
8
const sendReminder1DayBeforeReservationToLender = async (titleSpace,date,tenant,lender) => {
  let mail = {
    to: `${lender.email}`,
    from: 'sharedbox.tech@gmail.com',
    subject: `Hi ${lender.name}!! Tomorrow your tenant ${tenant.name} will have access to your space!`,
    text: `Dear ${lender.name}, we are glad to tell that tomorrow your tenant ${tenant.name} will have access to your reserved space ${titleSpace} `,
    html:`<h4>Dear ${lender.name}, we are glad to tell that tomorrow your tenant ${tenant.name} will have access to your reserved space ${titleSpace}.
    </br>Remember what from ${date.initialDate} to ${date.finalDate} the space is for the tenant.

    <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> to see more information about your transaction</strong>`,
  }  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send(mail)  
}

const sendReminder1DayBeforeReservationToTenant = async (titleSpace,date,tenant,lender) => {
  let mail = {
    to: `${tenant.email}`,
    from: 'sharedbox.tech@gmail.com',
    subject: `Hi ${tenant.name}!! Tomorrow you will have access to your space!`,
    text: `Dear ${tenant.name}, we are glad to tell that tomorrow you will have access to your reserved space ${titleSpace} `,
    html:`<h4>Dear ${tenant.name}, we are glad to tell that tomorrow you will have access to your reserved space ${titleSpace}.
    </br>Remember what from ${date.initialDate} to ${date.finalDate} the space is yours; congratulations!!. If you have any problem please contact with the owner ${lender.name}.
    <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> to see more information about your transaction</strong>`,
  }  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send(mail)  
}

module.exports = {
  sendRegistrationEmailToLender,
  sendOfferRejectionEmailToTenant,
  sendOfferAcceptedEmailToTenant,
  sendPayResultEmailToTenant,
  sendReminder1DayBeforeReservationToLender,
  sendReminder1DayBeforeReservationToTenant
}