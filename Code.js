function onFormSubmit(e){
  try{
    // 1. Get the form response from the event object
    const [name, email, description] = getFormResponse(e);

    // 2. Send the Customer an email confirmation
    sendCustomerEmail(name, email);

    // 3. Send Notification Email
    sendNotificationEmail(name, email, description)

  } catch{
    console.log('Error with onFormSubmit')
  }
}

function sendNotificationEmail(name, email, description){
  try{
    // 1. Get the message ID of the most recent message sent to this email
    const messageID = getMessageID(email);
    
    // 2. Build out notification email template
    let notificationTemplate = HtmlService.createTemplateFromFile('Notification')
    
    notificationTemplate.request = {
      "link": `https://mail.google.com/mail/u/0/#inbox/${messageID}`,
      "email": email,
      "description": description,
      "name": name
    }
    
    // 3. Send Email to my account with a link to the most recent sent message
    MailApp.sendEmail({
      to: 'youremail@email.com',
      subject: "📥 Consultation Request Notification",
      htmlBody: notificationTemplate.evaluate().getContent()
    });

  } catch{
    console.log('Error with sendNotificationEamil')
  }
}

function getMessageID(email){
  
  const sentThreads = GmailApp.search('in:sent',0,5);
  let output = []

  sentThreads.forEach(message => {
    let messageID = message.getId();
    let sentTo = GmailApp.getMessageById(messageID).getTo();
    if(sentTo == email){
      output.push(messageID)
    }
  })
  
  return output[0];
}

/**
 * Create & Send the Customer Email
 * @param {String} name
 * @param {String} email
 */
function sendCustomerEmail(name, email){
  try{
    // 1. Create the customer Email
    let customerTemplate = HtmlService.createTemplateFromFile('Confirmation')
    customerTemplate.request = {
      "name": name
    }

    MailApp.sendEmail({
      to: email,
      subject: "📥 Consultation Request Confirmation",
      htmlBody: customerTemplate.evaluate().getContent()
    });
  } catch{
    console.log('Error in the sendCustomerEmail')
  }
}

/**
 * This function will get the responses from the onFormSubmit event object
 * @returns {any[]}
 */
function getFormResponse(e){
  return e.response.getItemResponses().map(q => q.getResponse());
}
