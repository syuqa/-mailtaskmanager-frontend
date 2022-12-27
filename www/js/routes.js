
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
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
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
        app.dialog.progress('Загрузка');
        app.request.get(app_api(`connector/log/${page.route.params.pk}`), function(request){
          page.$el.find('.page-content').html(request)
          app.dialog.close();
        },function(){app.dialog.close();})
      }
    }
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    componentUrl: './pages/dynamic-route.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
];

var calendar = [
]