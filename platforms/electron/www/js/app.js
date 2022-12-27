const shell = require('electron').shell;

var $ = Dom7;
function app_api(path){
  return new URL(path, 'https://syu-developer-02.ru/').href 
}
function app_ws(path){
  return new URL(path, 'ws://syu-developer-02.ru/').href 
}


  // проверка заполнености обязательных полей
function validate(el){
    var count_validate = 0
    var current_num_validate = 0
    var input_items = el.find('input.validate')
    input_items.forEach(function(item){
      count_validate += 1
      var len = $(item).attr('validate_length')
      var validate_length = (len != undefined) ?  parseInt(len): 2
      current_num_validate += (item.value.length > validate_length) ? 1:0
    })
    
    var required = el.find('.required-validate')
    if (current_num_validate == count_validate){
      required.attr('validate', 'true')
    }else{
      required.attr('validate', 'false')
    }
  }

var device = Framework7.getDevice();
var app = new Framework7({
  name: 'My App', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element

  id: 'io.framework7.myapp', // App bundle ID
  // App routes
  routes: routes,
  dialog: {
    // set default title for all dialog shortcuts
    title: 'My App',
    // change default "OK" button text
    buttonOk: 'Ок',
    buttonCancel: 'Отмена'
  },

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

function navigate(path, reload=true){
 return app.view.current.router.navigate(path, 
    {   
      ignoreCache: reload,
      reloadCurrent: reload,
      reloadAll: reload
    }
  )
}


function toast_done(){
  toastIcon = app.toast.create({
    icon: '<i class="material-icons">task_alt</i>',
    text: 'Готово',
    position: 'center',
    closeTimeout: 2000,
  });

// Open it
toastIcon.open();
}

function ErrorProcessorRequest(request){
  console.log(request)
  console.log(request.status)
  if (request.status == 401){
    localStorage.removeItem('api-token')
    console.log('navaite login')
    navigate('/login/')

  }else if (request.status == 0){
    navigate('/not-connection/', false)
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

var mainView = app.views.create('#preloder', {
	url: './'
});

var profileView = app.views.create('#setting', {
	url: './'
});

var calendarView = app.views.create('#calendar', {
	url: './calendar',
  masterDetailBreakpoint: 768,
  masterDetailResizable: true,
  routes: calendar,
});


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
if (localStorage.getItem('api-token') != undefined){
  app.request.setup({
    headers: {
      "Authorization": "Token " + localStorage.getItem('api-token')
    }
    })
    app.tab.show('#calendar')
    navigate('/today/')
}else{
  app.dialog.close();
  navigate('/login/')
}

function MailConnectionList(connector, tbody){
  var mail_connection_list = ''
  console.log(connector)
  const connectors = connector

  tbody.html('')
  for (const [index, value] of connectors.entries()){
    var thread = value.thread
    var enable = ''
    var error = ''
    if (thread != undefined){
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
    }

    tbody.append($(`
                    <tr>
                        <td class="label-cell connector-host">${value.host}</td>
                        <td class="label-cell connector-user">${value.username}</td>
                        <td class="label-cell connector-model" model="${value.connection_model.pk}"><a href="/mail-model/${index}">${value.connection_model.name}</a></td>
                        <td class="actions-cell" style="text-align: center;">
                                <div class="preloader preload-${value.pk}" style="display: none">
                                  <span class="preloader-inner">
                                    <span class="preloader-inner-circle"></span>
                                  </span>
                                </div>
                                ${(thread.connection_status == '') ? '': error}
                                <label class="toggle toggle-init color-green toggle-${value.pk}">
                                  <input type="checkbox" ${enable} name="connector_run" connector="${value.pk}" connector_index="${index}"/>
                                  <span class="toggle-icon"></span>
                                  </label>
                              </td>
                        <td class="actions-cell">
                          <a class="link icon-only" href="/connector-logs/${value.pk}">
                          <i class="icon material-icons">subject</i>
                          </a>
                          <a class="link icon-only connector-popup ${(thread.is_active) ? 'simple': ''}" connector="${value.pk}" connector_index="${index}">
                          <i class="icon f7-icons if-not-md">square_pencil</i>
                          <i class="icon material-icons md-only">edit</i>
                          </a>
                          <a class="link icon-only delete ${(thread.is_active) ? 'simple': ''} " connector="${value.pk}" connector_index="${index}">
                          <i class="icon f7-icons if-not-md">trash</i>
                          <i class="icon material-icons md-only">delete</i>
                          </a>
                        </td>
                    </tr>`));
    var options = {  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hear: 'numeric', hour: '2-digit', minute:'2-digit', second: '2-digit'};
    if (thread)
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
 

$(document).on('click', 'a[href^="http"]', function(event) {
  console.log(this)
  event.preventDefault();
  shell.openExternal(this.href);
});


$(document).on('click', '.profiles', function(){
  app.tab.show('#setting')
  navigate('/profile/')
})

$(document).on('click', 'a[href="/mail-model/-1"]', function(){
  navigate('/mail-model/-1')
})

$(document).on('click', '.today', function(){
  app.tab.show('#calendar')
  navigate('/today/')
})