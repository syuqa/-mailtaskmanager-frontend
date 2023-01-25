
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
    path: '/history/:pk',
    content: `
    <div class="page" data-page="home">
    <div class="navbar">
      <div class="navbar-bg"></div>
      <div class="navbar-inner">
        <div class="left">
            <a href="#" class="link back">
                <span class="material-icons">arrow_back</span>
            </a>
        </div>
        <div class="title sliding">История обработки входящих сообщений</div>
        <div class="right">
            <a href="#" class="link refresh">
                <span class="material-icons">refresh</span>
            </a>
        </div>
      </div>
    </div>
    <div class="page-content infinite-scroll-content" data-distance="20">
      <div class="list accordion-list virtual-list">
        <ul class="line"></ul>
      </div>
    </div>
    `,
    on: {
      pageInit: function (event, page) {

        function appendline(){
          app.request.get(app_api(`connector/history/${page.route.params.pk}`), 
              function(request){
                  const items = JSON.parse(request)
                  console.log(items)
                  let ul = page.$el.find('.accordion-list ul.line')
                  ul.html('')
                  items.forEach(item => {
                    var options = {month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'};
                    var dt = new Date(item.created_at)
                    var mdt = new Date(item.email.date)
                    
                    const attr = new Array() 
                    const rule = new Array()
                    const action = new Array()

                    for (const [key, value] of Object.entries(item.rule)) {
                      if (value.suitable){
                        action.push(`<span class="badge color-blue" style="margin-right: 5px;">${key.toUpperCase()}</span>`)
                      }
                      rule.push(`
                            <li>
                              <a href="#" class="item-link item-content">
                                <div class="item-media"><i class="icon icon-f7"></i></div>
                                <div class="item-inner">
                                  <div class="item-title">${key}</div>
                                  <div class="item-after"><span class="material-icons" style="color: ${(value.suitable) ? 'green':'#80808052'}">done_all</span></div>
                                </div>
                              </a>
                            </li>
                        ` )
                    }

                    for (const [key, value] of Object.entries(item.attributes)) {
                      attr.push(`
                            <li>
                              <a href="#" class="item-link item-content">
                                <div class="item-media"><i class="icon icon-f7"></i></div>
                                <div class="item-inner">
                                  <div class="item-title">${key}</div>
                                  <div class="item-after">${value}</div>
                                </div>
                              </a>
                            </li>
                        ` )
                    }

                    ul.append($(
                      `<li class="accordion-item"><a class="item-content item-link" href="#">
                      <div class="item-inner">
                        <div class="item-title">
                          <div style="color: darkgrey;">${dt.toLocaleTimeString("ru-RU", options)}</div>
                          <div>${item.email.subject}</div></div>
                            <div style="position: absolute;right: 50px;top: 5px;">
                              ${action.join('')}
                              ${(item.status == 'progress') ? '<span class="badge color-orange" style="margin-right: 5px;">ОБРАБОТКА</span>':''}
                              ${(item.status == 'done') ? '<span class="badge color-green" style="margin-right: 5px;"> ОБРАБОТАН</span>':''}
                              ${(item.status == 'error') ? '<span class="badge color-red" style="margin-right: 5px;"> ОШИБКА</span>':''}
                            </div>
                        </div>
                    </a>
                    <div class="accordion-item-content">
                      <!--  -->
                      <div class="list">
                      <ul>
                        <li>
                          <div class="item-content" style="border-style: groove;border-width: 0.5px 0px 0px 0px;border-color: #0000001f;">
                            <div class="item-inner">
                              <div class="item-title" style="font-weight: 600;">Информаци о сообщении</div>
                            </div>
                          </div>
                          <ul style="background: aliceblue;">
                            <li>
                              <a href="#" class="item-link item-content">
                                <div class="item-media"><i class="icon icon-f7"></i></div>
                                <div class="item-inner">
                                  <div class="item-title">Получено</div>
                                  <div class="item-after">${mdt.toLocaleTimeString("ru-RU", options)}</div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a href="#" class="item-link item-content">
                                <div class="item-media"><i class="icon icon-f7"></i></div>
                                <div class="item-inner">
                                  <div class="item-title">От кого</div>
                                  <div class="item-after">${item.email.from.replace(/</,'').replace(/>/,'')}</div>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title" style="font-weight: 600;">Атрибуты</div>
                            </div>
                          </div>
                          <ul style="background: floralwhite;">
                              ${attr.join('')}
                          </ul>
                      </li>
                      <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title" style="font-weight: 600;">Правила</div>
                            </div>
                          </div>
                          <ul style="background: lightcyan;">
                              ${rule.join('')}
                          </ul>
                      </li>
                      </ul>
                      </div>
                      <!--  -->
                    </div>
                  </li>`
                      ))})
                }, 
                function(request){console.log(request), 'json'}
          )
        }
        
        page.$el.on('click', '.refresh', function(){
          appendline()
        })

        appendline()

        //app.infiniteScroll.create(page.$el.find('.infinite-scroll-content')[0])
        //page.$el.on('infinite', '.infinite-scroll-content', function(){
        //  console.log('infinite')
        //  appendline()
        //})
      }
    }
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

        const progress = app.dialog.progress('Загрузка');
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