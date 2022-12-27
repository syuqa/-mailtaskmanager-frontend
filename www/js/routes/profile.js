routes.push({
    path: '/profile/',
    url: './pages/profile.html',
    on: {
      pageInit: function (event, page) {
        app.request.get(app_api('api/data/profile'), function(request){
          console.log(request)
          var reqdata = JSON.parse(request)
          app['app_profile_data'] = reqdata
          // Connector list
          var body =  $(`<!-- Иконка + номер телефона -->	  
                        <center style="margin-top: 30px;">
                          <div ><a id="profile_avatar" class="actions-open link" href="#" data-actions=".avatar"><span class="material-icons" style="color: black;opacity: 0.8;font-size: 48px;">account_circle</span></a></div>
                          <h3 class="profile-user-name" style="color: brown;margin-top: 5px;">${reqdata.user.username.toUpperCase()}</h3>
                          <div style="border-width: 1px;border-style: double;border-color: #00000012;margin-top: 5px;width: 60%;"></div>
                          <div class="profile-user-id" style="margin-top: 5px;opacity: 0.5;">ID: ${reqdata.user.pk}</div>
                        </center>
                        <!--Почтовый клиент начало-->
                        <div class="data-table data-table-init card">
                                <!-- Card header -->
                                <div class="card-header">
                                  <!-- Default table header -->
                                  <div class="data-table-header">
                                    <!-- Default table title -->
                                    <div class="data-table-title">Почтовые коннеторы</div>
                                    <!-- Default table actions -->
                                    <div class="data-table-actions">
                                      <a class="link icon-only refresh-mail-connector-list">
                                        <span class="material-icons">refresh</span>
                                      </a>
                                      <a class="link icon-only add-mail-connector connector-popup">
                                        <span class="material-icons">add</span>
                                      </a>
                                    </div>
                                  </div>
                                  <!-- Selected table header -->
                                  <div class="data-table-header-selected">
                                    <!-- Selected table title -->
                                    <div class="data-table-title-selected"><span class="data-table-selected-count"></span> items selected</div>
                                    <!-- Selected table actions -->
                                    <div class="data-table-actions">
                              <!--a class="link icon-only">
                                <i class="icon f7-icons if-not-md">ellipsis_vertical_circle</i>
                                <i class="icon material-icons md-only">more_vert</i>
                                </a-->
                                      <a class="link icon-only delete-import-link">
                              <i class="icon material-icons md-only">delete</i>
                                        <i class="icon f7-icons if-not-md">trash</i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <div class="card-content">
                                  <table class="savelist mail-connector-list">
                                    <thead>
                                      <tr>
                                        <th class="label-cell">Почтовый сервер</th>
                                        <th class="label-cell">Email адрес</th>
                                        <th class="label-cell">Модель</th>
                                        <th class="actions-cell" style="text-align: center;">Состояние</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                              <tr>
                                <td class="label-cell">-</td>
                                <td class="label-cell">-</td>
                                <td class="label-cell">-</td>
                                <td class="actions-cell">
                                  <label class="toggle toggle-init color-green">
                                    <input type="checkbox" />
                                    <span class="toggle-icon"></span>
                                    </label>
                                </td>
                                <td class="actions-cell">
                                  <a class="link icon-only">
                                  <i class="icon f7-icons if-not-md">square_pencil</i>
                                  <i class="icon material-icons md-only">edit</i>
                                  </a>
                                  <!a class="link icon-only">
                                  <i class="icon f7-icons if-not-md">trash</i>
                                  <i class="icon material-icons md-only">delete</i>
                                  </a>
                                </td>
                                </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                        <!--Почтовый клиент конец-->`)
          $(page.el).find('.profile').html('')
          $(page.el).find('.profile').append(body)
          MailConnectionList(reqdata.connector.mail, $(page.el).find('.savelist tbody'))
            
            // Запуск коннектора
            page.$el.on('change', 'input[name=connector_run]', function(){
              var connector = $(this).attr('connector')
              var connector_index = $(this).attr('connector_index')
              if(this.checked) {
                url = app_api('connector/thread/create')
              }else{
                url = app_api('connector/thread/close')
              }

              $(page.el).find(`.toggle-${connector}`).css('display', 'none')
              $(page.el).find(`.preload-${connector}`).css('display', '')

              app.request.postJSON(url, {connector: connector},
                                function(request){
                                  console.log(request)
                                  $(page.el).find(`.toggle-${connector}`).css('display', '')
                                  $(page.el).find(`.preload-${connector}`).css('display', 'none')
                                  app.app_profile_data.connector.mail[connector_index].thread = request
                                  if (request.connection_status != "('OK', [b'LOGIN Completed.'])" && request.connection_status == ''){
                                    MailConnectionList(app.app_profile_data.connector.mail, $(page.el).find('.savelist tbody'))
                                  }
                                },
                                function(request){
                                  if (request.status == 400){
                                          console.dir(request)
                                        }else{
                                          ErrorProcessorRequest(request)
                                        }
                                }
                              )
            })
            // Удаление конектора
            page.$el.on('click', 'a.delete', function(){
              var connector = $(this).attr('connector')
              var connector_index = $(this).attr('connector_index')
              app.dialog.confirm('Вы хотите удалить данный конекор?', 'Удаление конекора', function (){
                app.request(
                  {
                    url: app_api(`api/data/connection/mail/connector/${connector}`),
                    method: "DELETE",
                    statusCode: {
                      204: function (xhr) {
                        app.app_profile_data.connector.mail.splice(connector_index, 1)
                        MailConnectionList(app.app_profile_data.connector.mail, $('.savelist tbody'))
                      },
                      404: function (xhr) {
                        console.log(xhr);
                      },
                      401: function (xhr) {
                        console.log(xhr)
                        ErrorProcessorRequest({status: '401'})
                      } 
                  }
                })
              })
            })

            // Open dynamic popup
            $('.connector-popup').on('click', function () {
              var connector = $(this).attr('connector')
              var connector_index = $(this).attr('connector_index')
              console.log(this, connector_index, connector)
              if (connector && connector_index){
                var email = reqdata.connector.mail[connector_index]
                console.log('try:', email)  
              }else{
                var email = {host: '', port: '', username: '', password: '', tls: false, connection_model: '', load_interval: '', debug: false, path: 'INBOX'}
              }  
              // Popup create and edit connector
              // Create dynamic Popup connector
              console.log(reqdata.connector.mail)
              var model_list = ''
              for (const value of reqdata.model){
                model_list += `<option value="${value.pk}" ${(email.connection_model == value.pk) ? 'selected': ''}>${value.name}</option>`
              }
                var ConnectorPopup = app.popup.create({
                  content: `
                    <div class="popup">
                      <div class="view view-popup">
    
                        <!-- titlebar -->
                        <div class="navbar queue-popup">
                            <div class="navbar-bg"></div>
                            <div class="navbar-inner navbar-inner-centered-title">
                                <div class="left">
                                    <a href="#" class="link popup-close">Закрыть</a>
                                </div>
                                <div class="title" style="left: 250.5px;">Коннетор</div>
                                <div class="right">
                                    <a href="#" class="link popup-clos save required-validate" validate="false">Сохранить</a>
                                </div>
                            </div>
                        </div>
    
                        <!-- content -->
                        <div class="page-content">
                          <div class="list inline-labels no-hairlines-md" style=" margin-top: 20px;margin-bottom: 20px;">
                          <div class="block-header">Параметры подключения</div>
                          <ul>
    
                            <li class="item-content item-input">
                              <div class="item-media">
                                <i class="icon material-icons demo-list-icon">email</i>
                              </div>
                              <div class="item-inner">
                                <div class="item-title item-label">Адрес сервера</div>
                                <div class="item-input-wrap">
                                  <input type="url" name="host" class="validate" placeholder="SMTP хост" value="${email.host}"/>
                                  <span class="input-clear-button"></span>
                                </div>
                              </div>
                            </li>

                            <li class="item-content item-input">
                              <div class="item-media">
                                <i class="icon material-icons demo-list-icon">restore</i>
                              </div>
                              <div class="item-inner">
                                <div class="item-title item-label">Порт</div>
                                <div class="item-input-wrap">
                                  <input type="number" class="validate" name="port" placeholder="порт почтового сервера" value="${email.port}"/>
                                </div>
                              </div>
                            </li>
    
                            <li class="item-content item-input">
                              <div class="item-media">
                                <i class="icon material-icons demo-list-icon">alternate_email</i>
                              </div>
                              <div class="item-inner">
                                <div class="item-title item-label">Логин</div>
                                <div class="item-input-wrap">
                                  <input type="email" class="validate" name="login" value="${email.username}" placeholder="Логин или email адрес" />
                                  <span class="input-clear-button"></span>
                                </div>
                              </div>
                            </li>
    
                            <li class="item-content item-input">
                              <div class="item-media">
                                <i class="icon material-icons demo-list-icon">key</i>
                              </div>
                              <div class="item-inner">
                                <div class="item-title item-label">Пароль</div>
                                <div class="item-input-wrap">
                                  <input type="password" class="validate" name="password" placeholder="Введите пароль" value="${email.password}" />
                                  <span class="input-clear-button"></span>
                                </div>
                              </div>
                            </li>
    
                            <li class="item-content item-input">
                              <div class="item-media">
                                <i class="icon material-icons demo-list-icon">shield</i>
                              </div>
                              <div class="item-inner">
                                <div class="item-title item-label">Протокол защиты</div>
                                <div class="item-input-wrap input-dropdown-wrap">
                                  <select placeholder="Please choose..." name="protocol">
                                    <option value="tls" ${(email.tls) ? 'selected': ''}>TLS</option>
                                    <option value="ssl" ${(email.tls) ? '': 'selected' }>SSL</option>
                                  </select>
                                </div>
                              </div>
                            </li>
    
                          </ul>
                        </div>
                        
                        <div class="list inline-labels no-hairlines-md" style=" margin-top: 20px;margin-bottom: 20px;">
                        <div class="block-header">Параметры обработки сообщений</div>
                        <ul>

                          <li class="item-content item-input">
                            <div class="item-media">
                              <i class="icon material-icons demo-list-icon">folder</i>
                            </div>
                            <div class="item-inner">
                              <div class="item-title item-label">Читать из папки</div>
                              <div class="item-input-wrap">
                                <input type="url" name="path" class="validate" placeholder="По умолчанию INBOX (входящие)" value="${email.path}"/>
                                <span class="input-clear-button"></span>
                              </div>
                            </div>
                          </li>

                          <li class="item-content item-input">
                            <div class="item-media">
                              <i class="icon material-icons demo-list-icon">view_kanban</i>
                            </div>
                            <div class="item-inner">
                              <div class="item-title item-label">Модель</div>
                              <div class="item-input-wrap input-dropdown-wrap">
                                <select placeholder="Please choose..." name="model">
                                  ${model_list}
                                </select>
                              </div>
                              <a href="/mail-model/-1" class="link hover-op popup-close" style="opacity: 0.5;margin-left: 5px;"><span style="color: black;font-size: 20px;" class="material-icons">tune</span></a>
                            </div>
                          </li>
    
                          <li class="item-content item-input">
                              <div class="item-media">
                                <i class="icon material-icons demo-list-icon">restore</i>
                              </div>
                              <div class="item-inner">
                                <div class="item-title item-label">Интервал</div>
                                <div class="item-input-wrap">
                                  <input type="number" class="validate" validate_length="0" name="load_interval" placeholder="second" value="${email.load_interval}"/>
                                </div>
                              </div>
                            </li>

                            <li class="item-content item-input">
                                <div class="item-media" style="opacity: 0.6;">
                                  <i class="icon material-icons demo-list-icon">lightbulb</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Дебаг режим</div>
                                  <div class="item-input-wrap ">
                                    <label class="toggle toggle-init color-green " style="float: right;">
                                        <input name="debug" type="checkbox" ${(email.debug) ? 'checked': ''}>
                                        <span class="toggle-icon"></span>
                                    </label>
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
                      // Проверка заполнености обязателных полей
                      popup.$el.on('input', 'ul input.validate', function(){
                        validate(popup.$el)
                      })
                      // Cохренение
                      popup.$el.on('click', 'a.save', function(){
                        const data = {
                          host: popup.$el.find('input[name=host]').val(),
                          port: popup.$el.find('input[name=port]').val(),
                          username: popup.$el.find('input[name=login]').val(),
                          password: popup.$el.find('input[name=password]').val(),
                          tls: (popup.$el.find('select[name=protocol]').val() == 'tls') ? true: false,
                          connection_model: popup.$el.find('select[name=model]').val(),
                          load_interval: popup.$el.find('input[name=load_interval]').val(),
                          debug: popup.$el.find('input[name=debug]').is(':checked'),
                          path: popup.$el.find('input[name=path]').val()
                        }
                        if (connector == null){
                          app.request.postJSON(app_api('api/data/connection/mail/connector'), data,
                                function(request){
                                  app.app_profile_data.connector.mail.push(request)
                                  toast_done()
                                  MailConnectionList(app.app_profile_data.connector.mail, $('.savelist tbody'))
                                },
                                function(request){
                                  if (request.status == 400){
                                          console.dir(request)
                                        }else{
                                          ErrorProcessorRequest(request)
                                        }
                                }
                              )
                        }else{
                          app.request(
                            {
                              url: app_api(`api/data/connection/mail/connector/${connector}`),
                              method: "PATCH",
                              dataType: 'json',
                              contentType: "application/json",
                              data: data,
                              statusCode: {
                                200: function (xhr) {
                                  var response = JSON.parse(xhr.response)
                                  app.app_profile_data.connector.mail[connector_index] = response
                                  toast_done()
                                  MailConnectionList(app.app_profile_data.connector.mail, $('.savelist tbody'))
                                  ConnectorPopup.close()
                                },
                                401: function (xhr) {
                                  console.log(xhr)
                                  ErrorProcessorRequest({status: '401'})
                                } 
                            }
                          })
                        }
                      })
                    },
                    opened: function (popup) {
                      console.log('Popup opened');
                    },
                  }
                });
    
              ConnectorPopup.open();
            });
        }, request => ErrorProcessorRequest(request))
        // Edir and create popup
      }
    }
  })