var $ = Dom7;
function app_api(path){
  return new URL(path, 'https://syu-developer-02.ru/').href 
}

var device = Framework7.getDevice();
var app = new Framework7({
  name: 'My App', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element

  id: 'io.framework7.myapp', // App bundle ID
  // App store
  store: store,
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: device.cordova && !device.electron,
    scrollIntoViewCentered: device.cordova && !device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  },
});

function ErrorProcessorRequest(request){
  console.log(request)
  console.log(request.status)
  if (request.status == 401){
    localStorage.removeItem('api-token')
    var a = app.view.main;
    navigate('/login/')

  }
}

function NotificationMessage(title, titleRightText, subtitle, text){
  var notification = app.notification.create({
	  //icon: '<i class="icon demo-icon">7</i>',
	  title: title,
	  titleRightText: titleRightText,
	  subtitle: subtitle,
	  text: text,
	  closeTimeout: 3000,
  });
  return notification
}

var mainView = app.views.create('#app', {
	url: './'
});

function navigate(path){
  var a = app.view.main;
  a.router.navigate(path, {   
    ignoreCache: true,
    reloadCurrent: true,
    reloadAll: true
  })
  app.dialog.close();
}


function getCookie(name) {
	let cookie = {};
	document.cookie.split(';').forEach(function(el) {
	  let [k,v] = el.split('=');
	  cookie[k.trim()] = v;
	})
	return cookie[name];
  }

function setCookie(key, value){
  var date = new Date()
  	date.setDate(date.getDate()+1)
  	document.cookie = key+"="+value+";SameSite=Lax;expires=" + date.toGMTString();
}

// Login Screen Demo
$('#my-login-screen .login-button').on('click', function () {
  var username = $('#my-login-screen [name="username"]').val();
  var password = $('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br/>Password: ' + password);
});

function get_tasks(){
  app.request.get(app_api('api/tasks'), function(request){
    console.log(request)
  }, function(request){
    console.log(request.response)
  })
}

/* Вход в приложение */
$(document).on("click", ".login-button", function() {

  app.dialog.preloader("Login");

	var username = $('.login-screen-content input[name=username]').val()
  var password = $('.login-screen-content input[name=password]').val()

	var form = new FormData();
	form.append("username", username);
	form.append("password", password);

	app.request.post(app_api('authorization/token/login'), form, function (response) {
    app.dialog.close();
		try {
      console.log(response)
      var response_json = JSON.parse(response)
      localStorage.setItem('api-token', response_json.auth_token);
      app.request.setup({
        headers: {
          "Authorization": "Token " + response_json.auth_token
        }
        })
      navigate('/home/')
		} 
		catch(e){
      console.log(e)
      app.dialog.close();
		}
	  }, function (response){
      if (response.status == 400){
        var response_json = JSON.parse(response.response)
        NotificationMessage('Authorization error', 'code '+  response.status, undefined, response_json.non_field_errors.join()).open()
      }
      else if (response.status == 0){
        NotificationMessage('Authorization error', 'code '+  response.status, undefined, 'Server is not available').open()
      }
      app.dialog.close();
	  })
})



// start gui
app.dialog.preloader("loading");
if (localStorage.getItem('api-token') != undefined){
    app.request.setup({
      headers: {
        "Authorization": "Token " + localStorage.getItem('api-token')
      }
      })
      app.dialog.close();
      navigate('/home/')
}else{
  navigate('/login/')
}


function MailConnectionList(connector, tbody){
  var mail_connection_list = ''
  console.log(connector)
  const connectors = connector

  for (const value of connectors){
    var thread = value.thread
    var enable = ''
    var error = ''
    tbody.html('')
    if (Object.keys(thread).length > 0){
      if (thread.is_active){
        enable = 'checked'
        app.tooltip.create({
          targetEl: '.tooltip-init',
          text: 'One more tooltip<br>with more text<br><em>and custom formatting</em>'
        })
      }else{
        error = '<i style="font-size: 20px;color:#cf1a3c;" class="icon material-icons item-subtitle tooltip-init" data-tooltip="'+thread.connection_status+'">warning</i>'
      }
    }

    tbody.append($('\
                    <tr>\
                        <td class="checkbox-cell">\
                          <label class="checkbox">\
                          <input type="checkbox" />\
                          <i class="icon-checkbox"></i>\
                          </label>\
                        </td>\
                        <td class="label-cell connector-host">'+value.host+'</td>\
                        <td class="label-cell connector-user">'+value.username+'</td>\
                        <td class="label-cell connector-model" model="'+value.connection_model.pk+'">'+value.connection_model.name+'</td>\
                        <td class="actions-cell">\
                                '+error+'\
                                <label class="toggle toggle-init color-green">\
                                  <input type="checkbox" '+enable+'/>\
                                  <span class="toggle-icon"></span>\
                                  </label>\
                              </td>\
                        <td class="actions-cell">\
                          <a class="link icon-only">\
                          <i class="icon f7-icons if-not-md">square_pencil</i>\
                          <i class="icon material-icons md-only">edit</i>\
                          </a>\
                          <!--a class="link icon-only">\
                          <i class="icon f7-icons if-not-md">trash</i>\
                          <i class="icon material-icons md-only">delete</i>\
                          </a-->\
                        </td>\
                    </tr>'));
    var options = {  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hear: 'numeric', hour: '2-digit', minute:'2-digit', second: '2-digit'};
    var datetime = new Date(thread.created_at);
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    if (!thread.is_active){
        app.tooltip.create({
          targetEl: '.tooltip-init',
          text: '<div>'+capitalize(datetime.toLocaleDateString("ru-RU", options))+'<br><ul style="padding: 0;margin-left: 20px;margin-top: 10px;opacity: 0.8;"><li>'+thread.connection_status+'</li></ul></div>'
        })
    }
  }
}

$(document).on('click', '.refresh-mail-connector-list', function(){
  app.request.get(app_api('api/data/profile'), function(request){
    reqparse = JSON.parse(request)
    MailConnectionList(reqparse.connector.mail, $('.savelist tbody'))
  }, function(request){
    console.log(request)
  })
})

