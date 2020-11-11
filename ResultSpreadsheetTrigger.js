/*==============================================================
 * Script to associate to a result spreadsheet to launch a treatment.
 * Author: O. Rey
 * Version: 1.0
 * Licence: GPL v3
 * Date: November 11 2020
 *==============================================================*/


/*
 * Function to customize
 */
function calculateRecommendation(response){
    // response is e.values
    var res = "You want it "
        + response[2]
        + " and you judged the form "
        + response[5]
        + "/10.\n"
    res += "Congratulations !"
    return res;
}


/*
 * Trigger on spreadsheet
 */
function onFormSubmit(e) {
    Logger.log("Trigger onFormSubmitEvent dans la spreadsheet : %s", JSON.stringify(e));
  
    if (e == null) {
        Logger.log("Event is null. Exiting...");
        return;
    }
  
    // Process response
    var res = calculateRecommendation(e.values)
    Logger.log(e.values);
  
    // Log the email address of the person running the script.
    // The email of the form owner
    //var activeUserEmail = Session.getActiveUser().getEmail();
    //Logger.log(activeUserEmail);
    var email = e.values[6];
    if ((email == null) || (email == "")){
        Logger.log("Email is null. Exiting...");
        return;
    }
    else
        Logger.log("Email to send the mail to is %s", email);
  
    MailApp.sendEmail(email, "Your notation", res);
}


