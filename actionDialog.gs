function action(json) {
  var message = json.message;
  
  var ts = message.ts;
  
  if(json.callback_id=="change_image"){
    message.attachments[0].image_url = getGoogleCustomSearchImage(message.attachments[0].title);
    
  }else if(json.callback_id=="priority_display"){
    //何もしない
  }else if(json.callback_id=="new"){
    var messageData = {
    "attachments": [{
      "title": message.attachments[0].title,
      "fields": [{
        "title": "在庫数",
        "value":  message.attachments[0].fields[0].value,
        "short": true
      }, {
        "title": "出品者",
        "value": message.attachments[0].fields[1].value,
        "short": true
      }],
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "trigger_shop",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
        "name": "buy",
        "text": message.attachments[0].actions[0].text,
        "type": "button",
        "value": message.attachments[0].actions[0].value,
        "confirm": {
          "title": "購入画面",
          "text": message.attachments[0].title+"を購入しますか？",
          "ok_text": "購入"
        }
      }],
      "image_url": message.attachments[0].image_url,
    }]
    }
    message = messageData;
     
  }
  
  //投稿
  if(json.callback_id!="product_delete"){
    var slackUrl = PropertiesService.getScriptProperties().getProperty('SLACK_INCOMMING_URL');
    res_fetch(slackUrl, message);
  }
  chatDelete(ts);
  
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function chatDelete(ts) {
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var app = SlackApp.create(slack_access_token);  
  app.chatDelete("C810A6QBF", ts)
}