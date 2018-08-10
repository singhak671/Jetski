var current_env  = "staging";

function config_function(){
    var config = {};    
    switch (current_env) {
      case 'production':
        config = require('./env/production.json');
        break;
  
      case 'development':
        config = require('./env/development.json');
        break;
  
      case 'staging':
        config = require('./env/staging.json');
        break;
  
      default:
        console.error('NODE_ENV environment variable not set');
        process.exit(1);
    }
    return config; 
}

module.exports = config_function;






// function joinDateTime(d, t) {
//   // console.log('d==>>', d + " t==>>>"+t);
//   var dateString = d + " " + t,
//   dateTimeParts = dateString.split(' '),
//   timeParts = dateTimeParts[1].split(':'),
//   dateParts = (dateTimeParts[0].split('-')).reverse(),
//   date;
//   // console.log("dateTimeParts==>>", dateTimeParts);
//   // console.log("timeParts==>>", timeParts);
//   // console.log("dateParts==>>", dateParts);
//   date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
//   // console.log('date==>>' + date);
  
//   // console.log(date.getTime()); //1379426880000
//   // console.log(date);
//   var finalObj = { dateTime: date.getTime() }
//   return finalObj;
//   }
  
//   function validateEvent(duration) {
//   var eventShowTimeArr = [];
//   duration.map(x =>
//   x.times.map(y => eventShowTimeArr.push(joinDateTime(x.date.formatted, y.time)))
//   )
  
//   var currentTime = new Date().getTime();
//   var index = eventShowTimeArr.findIndex(z => (z.dateTime - currentTime) <= 0);
  
//   if (index != -1) {
//   return false;
//   } else {
//   return true;
//   }
//   }
  
  
//   module.exports = {
  
  
//   'addEvent': (req, res) => {
//   // console.log("addddddddddddd", req.body);
  
//   if (!req.body) {
//   return response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA);
//   }
//   User.findById(req.body.userId, (err4, succ) => {
//   if (err4)
//   return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err3);
//   if (!succ)
//   return response.sendResponseWithData(res, responseCode.NOT_FOUND, "UserId not found");
//   eventSchema.findOne({ userId: req.body.userId, eventName: req.body.eventName }, (err5, succ1) => {
//   if (err5)
//   return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err5);
//   if (succ1) {
//   console.log("successss>>>>>>>", succ1);
//   return response.sendResponseWithData(res, responseCode.BAD_REQUEST, "Event name already exists");
//   }
//   var base64 = req.body.eventImage
//   cloudinary.uploadImage(base64, (err, result) => {
//   if (result) {
//   req.body.eventImage = result;
//   }
//   var business = new eventSchema(req.body)
  
//   var durationArr =
//   +++++++++++++++++++++++++++
//   var durationArr = business.duration;
//   var valid = validateEvent(durationArr);
//   if (!valid) {
//   console.log("Please madam sahi data bhej do.")
//   return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Please provide correct duration time");
//   }
//   else {
//   console.log("Wahh Gauri Ma'am ab sahi data bheji ho.")
//   business.save((err2, createEvent) => {
//   if (err2) {
//   console.log("business added error>>>>>>>>>>>", err2)
//   response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err2)
//   }
//   else if (createEvent) {
//   response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Event saved successfully.", createEvent);
//   User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { services: { eventId: createEvent._id, eventIdStatus: createEvent.eventStatus } } }, { new: true }, (err3, success) => {
//   console.log("success", success)
//   if (err3)
//   console.log(err3)
//   if (!success)
//   console.log("cannot update userId with the event update")
//   })
//   }
//   else
//   response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, "Error !!!", err2)
//   })
//   }
//   })
//   })
//   })
//   },