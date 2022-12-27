
var routes = [
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
    path: '/mail-model/',
    url: './pages/model_list.html',
    on: {

      pageInit: function (event, page) {

        if (app.app_profile_data.model.length > 0){
          var list = page.$el.find('.list-model ul')
          list.html('')
          // CREATE MAIL MODEL LIST
          for (const [index, element] of app.app_profile_data.model.entries()){
            list.append(
              $(
                `<li>
                  <a href="#" index="${index}" model="${element.id}" class="item-link item-content mail-model-item">
                    <div class="item-media"><span class="material-icons">widgets</span></div>
                    <div class="item-inner">
                      <div class="item-title" >${element.name}</div>
                      <div class="item-after"></div>
                    </div>
                  </a>
                </li>`
              )
            )
          }
          // CLICK RILE
          page.$el.on('click', '.mail-model-item', function(){
                var model = $(this).attr('model')
                var item = $(this).attr('index')
                console.log(`MODEL: ${model}, ITEM: ${item}`)
                var attributes = app.app_profile_data.model[item].attributes.email
                var rules = app.app_profile_data.model[item].rule.email
                // CREATE DEFAULT ITEMS
                var attributes_list = $(`
                        <!--Rule list-->
                        <div class="block-title" style="margin-left: 0;margin-right: 0;">Фильры
                          <a style="float: right;">
                            <span class="material-icons">add</span>
                            </a>
                        </div>
                        <div class="list">
                            <ul>
                            </ul>
                        </div>
                        <!--Rule list-->
                `)
                var rules_list = $(`
                        <!-- Rule filtr-->
                        <div class="block-title" style="margin-left: 0;margin-right: 0;">Фильры
                          <a style="float: right;">
                            <span class="material-icons">add</span>
                            </a>
                        </div>
                        <div class="list">
                            <ul>
                            </ul>
                        </div>
                        <!-- Rule filtr-->
                `)
                // ATTR
                  if (attributes.length > 0){
                    for (const [index, element] of attributes.entries()){
                      $(attributes_list[2]).find('ul').append($(
                        `<li>
                        <a href="#" pk="${element.pk}" index="${index}" class="item-link item-content mail-attr-item">
                          <div class="item-media"><span class="material-icons">widgets</span></div>
                          <div class="item-inner">
                            <div class="item-title">${element.Attribute}</div>
                            <div class="item-after">${element.description}</div>
                          </div>
                        </a>
                      </li>`
                      ))
                    }
                  }else{
                    $(attributes_list[4]).find('ul').append($('<li><div style="padding: 15px;text-align: center;color: #00000094;">список пуст</div></li>'))
                  }
                  // RULE
                  if (rules.length > 0){
                    for (const [index, element] of rules.entries()){
                      $(rules_list[4]).find('ul').append($(
                        `  <li>
                        <a href="#" pk="${element.pk}" index="${index}" class="item-link item-content mail-rule-item">
                        <div class="item-media"><span class="material-icons">data_object</span></div>
                        <div class="item-inner">
                            <div class="item-title">${element.name}</div>
                            <div class="item-after">from</div>
                        </div>
                        </a>
                    </li>`
                      ))
                    }
                  }else{
                    $(rules_list[4]).find('ul').append($('<li><div style="padding: 15px;text-align: center;color: #00000094;">список пуст</div></li>'))
                  }
                  // INSERT ATTR LUST
                  console.log($(attributes_list[4]).html())
                  console.log($(rules_list[4]).html())
                  page.$el.find('.block-model-details').html('')
                  page.$el.find('.block-model-details').append(rules_list)
                  page.$el.find('.block-model-details').append(attributes_list)
                  
            })
        }
      }
    }
  },
  {
    path: '/profile/',
    url: './pages/profile.html',
    on: {
      pageInit: function (event, page) {
        app.request.get(app_api('api/data/profile'), function(request){
          console.log(request)
          var reqdata = JSON.parse(request)
          app['app_profile_data'] = reqdata
          $(page.el).find('.profile-user-name').text(reqdata.user.username.toUpperCase())
          $(page.el).find('.profile-user-id').text('ID: '+ reqdata.user.pk)
          // Connector list
          MailConnectionList(reqdata.connector.mail, $(page.el).find('.savelist tbody'))
          // Popup create and edit connector
          // Create dynamic Popup connector
          var model_list = ''
          for (const value of reqdata.model){
            model_list += '<option value="'+value.pk+'">'+value.name+'</option>'
          }
            var ConnectorPopup = app.popup.create({
              content: `
                <div class="popup" style="height: auto;">
                  <div class="view view-popup">

                    <!-- titlebar -->
                    <div class="navbar queue-popup">
                        <div class="navbar-bg"></div>
                        <div class="navbar-inner navbar-inner-centered-title">
                            <div class="left">
                                <a href="#" class="link popup-close">Close</a>
                            </div>
                            <div class="title" style="left: 250.5px;">Email connection</div>
                            <div class="right">
                                <a href="#" class="link popup-clos queue-items-save " url="./members/create" member="{{member.id}}">Save</a>
                            </div>
                        </div>
                    </div>

                    <!-- content -->
                    <div class="page-content">
                      <div class="list inline-labels no-hairlines-md" style="margin-top: 0px;">
                      <ul>

                        <li class="item-content item-input">
                          <div class="item-media">
                            <i class="icon material-icons demo-list-icon">view_kanban</i>
                          </div>
                          <div class="item-inner">
                            <div class="item-title item-label">Model connection</div>
                            <div class="item-input-wrap input-dropdown-wrap">
                              <select placeholder="Please choose...">
                                `+model_list+`
                              </select>
                            </div>
                            <a href="/mail-model/" class="link hover-op popup-close" style="opacity: 0.5;margin-left: 5px;"><span style="color: black;font-size: 20px;" class="material-icons">tune</span></a>
                          </div>
                        </li>

                        <li class="item-content item-input">
                          <div class="item-media">
                            <i class="icon material-icons demo-list-icon">email</i>
                          </div>
                          <div class="item-inner">
                            <div class="item-title item-label">URL</div>
                            <div class="item-input-wrap">
                              <input type="url" name="host" placeholder="SMTP Host" />
                              <span class="input-clear-button"></span>
                            </div>
                          </div>
                        </li>

                        <li class="item-content item-input">
                          <div class="item-media">
                            <i class="icon material-icons demo-list-icon">alternate_email</i>
                          </div>
                          <div class="item-inner">
                            <div class="item-title item-label">Login</div>
                            <div class="item-input-wrap">
                              <input type="email" name="login" placeholder="Your login or e-mail" />
                              <span class="input-clear-button"></span>
                            </div>
                          </div>
                        </li>

                        <li class="item-content item-input">
                          <div class="item-media">
                            <i class="icon material-icons demo-list-icon">key</i>
                          </div>
                          <div class="item-inner">
                            <div class="item-title item-label">Password</div>
                            <div class="item-input-wrap">
                              <input type="password" name="password" placeholder="Your password" />
                              <span class="input-clear-button"></span>
                            </div>
                          </div>
                        </li>

                        <li class="item-content item-input">
                          <div class="item-media">
                            <i class="icon material-icons demo-list-icon">shield</i>
                          </div>
                          <div class="item-inner">
                            <div class="item-title item-label">Security</div>
                            <div class="item-input-wrap input-dropdown-wrap">
                              <select placeholder="Please choose...">
                                <option value="Male">TLS</option>
                                <option value="Female">SSL</option>
                              </select>
                            </div>
                          </div>
                        </li>

                        <li class="item-content item-input">
                          <div class="item-media">
                            <i class="icon material-icons demo-list-icon">restore</i>
                          </div>
                          <div class="item-inner">
                            <div class="item-title item-label">Load interval</div>
                            <div class="item-input-wrap">
                              <input type="number" name="load_interval" placeholder="second" />
                            </div>
                          </div>
                        </li>

                      </ul>
                    </div>
                    </div>
                  </div>
                </div>
              `,
              // Events
              on: {
                open: function (popup) {
                  console.log('Popup open');
                },
                opened: function (popup) {
                  console.log('Popup opened');
                },
              }
            });

            // Events also can be assigned on instance later
            ConnectorPopup.on('close', function (popup) {
              console.log('Popup close');
            });
            ConnectorPopup.on('closed', function (popup) {
              console.log('Popup closed');
            });

            // Open dynamic popup
            $('.connector-popup').on('click', function () {
              ConnectorPopup.open();
            });
        }, request => ErrorProcessorRequest(request))
        // Edir and create popup
      }
    }
  },
  {
    path: '/home/',
    name: 'home',
    url: './pages/home.html',
    on: {
      pageBeforeIn: function (event, page) {
      },
      pageAfterIn: function (event, page) {
        // do something after page gets into the view
        // do something before page gets into the view
        var options = {  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', };
        var today  = new Date();
        console.log(today.toLocaleDateString("en-US")); // 9/17/2016
        console.log(today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016
        console.log(today.toLocaleDateString("ru-RU", options));
        $(page.el).find('.navbar .title').text(today.toLocaleDateString("ru-RU", options))
        // Edit And Creat
      },
      pageInit: function (event, page) {
        // do something when page initialized
        console.log('pageInit')
      },
      pageBeforeRemove: function (event, page) {
        // do something before page gets removed from DOM
        console.log('pageBeforeRemove')
      },
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
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
