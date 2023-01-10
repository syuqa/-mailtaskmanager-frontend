
var routes = [
  {
    path: './',
    url: './pages/preloder.html'
  },
  {
    path: '/index/',
    url: './index.html',
    on:  {
      pageAfterIn: function (e, page) {
        //
      },
    }
  },
  {
    path: '/not-connection/',
    content: `<div class="page">
              <div class="page-content parent">
                  <center class="child">
                    <img src="img/mm_.png" style="width: 120px;">
                    <p style="opacity: 0.4;">Ошибка подключения к серверу</p>
                    <p style="opacity: 0.8;"><a class="reload">Повторить</a></p>
                  </center>
                </div>
          </div>`,
    on: {
          pageInit: function (event, page) {
            let url = app.views.current.history[0]
            page.$el.on('click', '.reload', function(){
              console.log(url)
              navigate(url)
            })
        }
    }
  },
  {
    path: '/bad-gateway/',
    content: `<div class="page">
              <div class="page-content parent">
                  <center class="child">
                    <img src="img/mm_.png" style="width: 120px;">
                    <p style="opacity: 0.4;">Ошибка сервера</p>
                    <p style="opacity: 0.8;"><a class="reload">Повторить</a></p>
                  </center>
                </div>
          </div>`,
    on: {
          pageInit: function (event, page) {
            let url = app.views.current.history[0]
            page.$el.on('click', '.reload', function(){
              console.log(url)
              navigate(url)
            })
        }
    }
  },
  {
    path: '/login/',
    url: './pages/login.html',
  },
  {
    path: '/connector-logs/:pk',
    name: 'connector-logs',
    url: './pages/logs.html',
    on: {
      pageInit: function (event, page) {

        page.$el.on('click','.right a', function(){
          navigate(`/connector-logs/${page.route.params.pk}`)
        })

        const progress = app.dialog.progress('Загрузка', 0);
        const url = app_api(`connector/log/${page.route.params.pk}`)
        const xhr = new XMLHttpRequest();
        xhr.onprogress = function(event){progress.setProgress(parseInt((event.loaded / event.total)* 100))}
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onload = xhr.onerror = function() {
            if (this.status == 200) {
                page.$el.find('.page-content').html(xhr.response)
                setTimeout(
                  progress.close(), 2000)
            } 
            else {
              progress.close()
            }
        }
      }
    }
  }
];

var calendar = [
]