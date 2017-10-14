/** This is a sample code for your bot**/
var userAmount = 0;

function MessageHandler(context, event) 
{
    if(event.message.toLowerCase()=='ok')
    {
        context.simpledb.roomleveldata.stage = "enteramount";
        var message = [
            "Hello "+event.senderobj.display,
            {"type":"image","originalUrl":"http://wallpaper-gallery.net/images/smile-image/smile-image-11.jpg","previewUrl":"http://wallpaper-gallery.net/images/smile-image/smile-image-11.jpg"},
            "Enter the amount to convert"
        ];

        context.sendResponse(JSON.stringify(message));
        return;
    }
    
    if (context.simpledb.roomleveldata.stage=="enteramount")
    {
        if(!isNaN(event.message))
        {
            userAmount=event.message;
            var url ="http://api.fixer.io/latest?base=USD&symbols=INR";
            context.simplehttp.makeGet(url);
            //context.sendResponse("ok converting");
            return;
        }
        else
        {
            context.sendResponse("Enter only numbers");
        }
    }
    else
    {
        context.sendResponse("Sorry, \nI only understand if you say 'ok'");
    }
}
/** Functions declared below are required **/
function EventHandler(context, event) 
{
    context.sendResponse("Welcome! I am a Currency converter Bot. I can convert USD to INR.");
}

function HttpResponseHandler(context, event) 
{
    // if(event.geturl === "http://ip-api.com/json")
    var rateobj=JSON.parse(event.getresp);
    var rate=rateobj.rates.INR;
    var crate=rate*userAmount;
    context.simpledb.roomleveldata.stage="nostage";

    context.sendResponse(crate);
}

function DbGetHandler(context, event) 
{
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) 
{
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
}
