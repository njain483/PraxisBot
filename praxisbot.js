var intentname="";
function MessageHandler(context, event) {
    // var nlpToken = "xxxxxxxxxxxxxxxxxxxxxxx";//Your API.ai token
    // context.sendResponse(JSON.stringify(event));
    sendMessageToApiAi({
        message : event.message,
        sessionId : new Date().getTime() +'api',
        nlpToken : "227ade3cb57f476dabc1a3d6644c5613",
        callback : function(res){
          var loc="";
          intentname=JSON.parse(res).result.metadata.intentName;
          if (intentname=="weather" && JSON.parse(res).result.parameters.geocity!="")
            callWeatherAPI(JSON.parse(res).result.parameters.geocity);
          else if (intentname=="pagespeed" && JSON.parse(res).result.parameters.url!="")
            callPageSpeedAPI(JSON.parse(res).result.parameters.url);
          else
            context.sendResponse(JSON.parse(res).result.fulfillment.speech);
        }
    },context)
}

function callPageSpeedAPI(url)
{

  var apiurl="https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=http%3A%2F%2F"+url;
  context.simplehttp.makeGet(apiurl);
}

function callWeatherAPI(loc)
{
  var url="https://api.apixu.com/v1/current.json?key=9e854b895368407c979120711171410&q="+loc;
  context.simplehttp.makeGet(url);
}

function sendMessageToApiAi(options,botcontext) {
    var message = options.message; // Mandatory
    var sessionId = options.sessionId || ""; // optinal
    var callback = options.callback;
    if (!(callback && typeof callback == 'function')) {
       return botcontext.sendResponse("ERROR : type of options.callback should be function and its Mandatory");
    }
    var nlpToken = options.nlpToken;

    if (!nlpToken) {
       if (!botcontext.simpledb.botleveldata.config || !botcontext.simpledb.botleveldata.config.nlpToken) {
           return botcontext.sendResponse("ERROR : token not set. Please set Api.ai Token to options.nlpToken or context.simpledb.botleveldata.config.nlpToken");
       } else {
           nlpToken = botcontext.simpledb.botleveldata.config.nlpToken;
       }
    }
    var query = '?v=20150910&query='+ encodeURIComponent(message) +'&sessionId='+sessionId+'&timezone=Asia/Calcutta&lang=en    '
    var apiurl = "https://api.api.ai/api/query"+query;
    var headers = { "Authorization": "Bearer " + nlpToken};
    botcontext.simplehttp.makeGet(apiurl, headers, function(context, event) {
       if (event.getresp) {
           callback(event.getresp);
       } else {
           callback({})
       }
    });
}

/** Functions declared below are required **/
function EventHandler(context, event) {
    if (!context.simpledb.botleveldata.numinstance)
        context.simpledb.botleveldata.numinstance = 0;
    numinstances = parseInt(context.simpledb.botleveldata.numinstance) + 1;
    context.simpledb.botleveldata.numinstance = numinstances;
    context.sendResponse("Hello "+event.senderobj.display+"\r\nI am Praxis & how can I help you?\r\n\r\nTo know more just reply with 'more info' or 'about praxis'\r\n\r\nOr simply visit this link:\r\nbit.ly/praxisbot");
}

function HttpResponseHandler(context, event) {
    // if(event.geturl === "http://ip-api.com/json")
    if (intentname=="weather") {
      var weatherapi=JSON.parse(event.getresp);
      var currentweather=weatherapi.current.condition.text;
      currentweather = "Today's Weather: "+currentweather+"\r\nTemperature: "+weatherapi.current.temp_c+" °C";
      var finalweather=
      [currentweather,
        {"type":"image","originalUrl":"http:"+weatherapi.current.condition.icon,"previewUrl":"http:"+weatherapi.current.condition.icon},
        {"type":"link","href":"https://whatsapp.com/favicon.png"}
      ];
      context.sendResponse(JSON.stringify(finalweather));
    }
    else if (intentname=="pagespeed") {
      var pagespeedapi=JSON.parse(event.getresp);
      var score=pagespeedapi.score;
      score = "Score for "+pagespeedapi.title+" is "+score+"/100";
      context.sendResponse(score);
    }
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
}
