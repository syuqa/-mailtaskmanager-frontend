function integrations(connectors, current_connector){
  var content = $(`
      <div>
      <div class="popup">
        <div class="view view-popup">

          <!-- titlebar -->
          <div class="navbar queue-popup">
              <div class="navbar-bg"></div>
              <div class="navbar-inner navbar-inner-centered-title">
                  <div class="left">
                      <a href="#" class="link popup-close">Закрыть</a>
                  </div>
                  <div class="title">Интеграции</label>
                  </div>
                  <div class="right">
                      <a href="#" class="link popup-clos save required-validate" validate="false">Сохранить</a>
                  </div>
              </div>
          </div>

          <div class="page-content">
              <div class="list accordion-list">
                <ul></ul>
              </div>
            </div>
        </div>
      </div>
      </div>`)
for (const [index, element] of connectors.entries()){
  let integration_param = undefined
  if (current_connector.itegration_paramets[element.name]){
    integration_param = current_connector.itegration_paramets[element.name].account
  }
  
  const integers = $(`
        <li class="accordion-item">
          <label class="toggle toggle-init color-green toggle-1" style="float: left;padding-top: 14px;margin-right: 5px;margin-left: 10px;">
              <input type="checkbox" name="integration" integration="${element.name}" ${ (integration_param) ? (integration_param.enable) ? 'checked="true"':'':''}>
              <span class="toggle-icon"></span>
            </label>
          <a class="item-content item-link" href="#">
            <div class="item-inner">
              <div class="item-title">${element.name}</div>
            </div>
          </a>
          <div class="accordion-item-content ${ (integration_param) ? (integration_param.enable) ? '':'simple':'simple'}" integration="${element.name}">
          <!--div class="block-header" style="padding-top: 10px;text-align: center;border-width: 0.5px 0px 0px 0px;border-style: inset;border-color: #0000001c;">Аккаунт</div-->
            <div class="list inline-labels no-hairlines-md integration-list" integration="${element.name}" style="border-width: 0.5px 0px 1px 0px;border-style: inset;border-color: #0000001c;">
              <ul></ul>
            </div>
            <div class="block-header" style="padding-top: 10px;">
              Дополнителные Параметры
              <a href="#" class="load-siple" integration="${element.name}" style="float: right;">загрузить шаблон</a>
            </div>
            <div id="jsoneditor_${element.name}"></div>
          </div>
        </li>`)

    for (const [index, param] of element.parametrs.entries()){
      let valid = (integration_param) ? (integration_param.enable) ? (param.validate) ? 'validate': '': (param.validate) ? 'validates': '' : ''
      let li = $(`<li class="item-content item-input">
                      <div class="item-media">
                        <i class="icon material-icons demo-list-icon">notes</i>
                      </div>
                      <div class="item-inner">
                        <div class="item-title item-label">${param.description}</div>
                        <div class="item-input-wrap">
                          <input type="${param.type}" name="${param.name}" class="${valid}" placeholder="${(param.name == 'username') ? current_connector.username:param.placeholder}" value="${(integration_param) ? integration_param[param.name] :''}"/>
                          <span class="input-clear-button"></span>
                        </div>
                      </div>
                    </li>`)
      integers.find('ul').append(li)
    }

    content.find('.accordion-list ul').append(integers)
}

return content.html()
  
}

function check_smtp(el){
  if (el.find('input[name=smtp]').is(':checked')){
    el.find('.smtp').css('display', '')
    el.find('.smtp input').addClass('validate')
    el.find('.imap').css('background', 'beige')
  }else{
    el.find('.smtp').css('display', 'none')
    el.find('.smtp .validate').removeClass('validate')
    el.find('.imap').css('background', '')
  }
}

routes.push({
    path: '/profile/',
    url: './pages/profile.html',
    on: {
      pageInit: function (event, page) {
        app.request.get(app_api('api/data/profile'), function(request){
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

            page.$el.on('click', '.integrations', function(){
              var connector_index = $(this).attr('connector_index')
              var connector = reqdata.connector.mail[connector_index]
              let integration_list = reqdata.connector.integrations
              var integrationsPopup = app.popup.create(
                {
                  content: integrations(integration_list, connector),
                  on: {
                    open: function (popup) {
                      // Проверка заполнености обязателных полей
                      popup.$el.on('input', 'input.validate', function(){
                        validate(popup.$el)
                      })
                      // Вкл./Выкл. Интеграции
                      popup.$el.on('click', 'input[type="checkbox"][name="integration"]', function(){
                       let name = $(this).attr('integration')
                       let ul = popup.$el.find(`.accordion-item-content[integration=${name}]`)
                        if (ul.hasClass('simple')){
                            ul.removeClass('simple')
                            let validate = ul.find('.validates')
                            if (validate){
                              validate.removeClass('validates')
                              validate.addClass('validate')
                            }
                        }else{
                          ul.addClass('simple')
                          let validate = ul.find('.validates')
                          if (validate){
                            validate.removeClass('validate')
                            validate.addClass('validates')
                          }
                        }
                        validate(popup.$el)
                      })

                      // Редактор js кода
                      integration_list.forEach(element => {
                          const container = document.getElementById(`jsoneditor_${element.name}`)
                          const options = {
                            mode: 'tree',
                            modes: ['code', 'tree'], // allowed modes
                            onModeChange: function (newMode, oldMode) {
                              console.log('Mode switched from', oldMode, 'to', newMode)
                            }
                          }
                          const editor = new JSONEditor(container, options)
                          app.editors = {}
                          app.editors[element.name] = editor
                          // get json
                          var initialJson = {}
                          if (connector.itegration_paramets[element.name]){
                             initialJson = connector.itegration_paramets[element.name].parameters
                          }
                          // set list
                          editor.set(initialJson)

                          // get json
                          const updatedJson = editor.get()

                      });

                      // Сохранение настроек интеграции
                      popup.$el.on('click', '.save', function(){
                        const integration_param = {}
                        $('.accordion-item').forEach(el => {

                          const account = {}
                           
                          // собираем параметры аккаунта
                          $(el).find('.accordion-item-content .list li input').forEach(el => {
                            account[el.name] = el.value
                          })

                          // собираем дополнительные параметры
                          let name = $(el).find('.accordion-item-content').attr('integration')

                          // вкл./выкл.
                          let enable = $(el).find(`input[name="integration"][integration="${name}"]`).is(':checked')

                            if (!integration_param[name]){
                              integration_param[name] = {}
                            }
                          
                          integration_param[name]['account'] = account
                          integration_param[name]['account']['enable'] = enable
                          integration_param[name]['parameters'] = app.editors[name].get()
                        })

                        // Сохранение
                        app.request(
                          {
                            url: app_api(`api/data/connection/mail/connector/${connector.pk}`),
                            method: "PATCH",
                            dataType: 'json',
                            contentType: "application/json",
                            data: {itegration_paramets: integration_param},
                            statusCode: {
                              200: function (xhr) {
                                var response = JSON.parse(xhr.response)
                                app.app_profile_data.connector.mail[connector_index] = response
                                integrationsPopup.close()
                              },
                              401: function (xhr) {
                                console.log(xhr)
                                ErrorProcessorRequest({status: '401'})
                              } 
                          }
                        })
            
                        console.log(integration_param)
                      })

                      // Загрузка маппинга
                      popup.$el.on('click', '.load-siple', function(){
                        let integration = $(this).attr('integration')
                        const account = {connector: connector.pk}
                        app.preloader.show()
                        popup.$el.find('.accordion-item-content[integration="Timetta"] ul input').forEach(el => account[el.name] = el.value)
                        const container = document.getElementById(`jsoneditor_${integration}`)
                        app.request.postJSON(app_api(`api/integration/simple/${integration}`), account,
                          function(request){
                            app.editors[integration].set(request)
                            app.preloader.hide()
                          }, 
                          function(request){
                            app.preloader.hide()
                            console.log(request)
                          })
                      })
                    }
                  }
                }
              )
              integrationsPopup.open()
          })

            // Open dynamic popup
            page.$el.on('click', '.connector-popup', function () {
              var connector = $(this).attr('connector')
              var connector_index = $(this).attr('connector_index')
              console.log(this, connector_index, connector)
              if (connector && connector_index){
                var email = reqdata.connector.mail[connector_index]
                console.log('try:', email)  
              }else{
                var email = {host: '', port: '', username: '', password: '', tls: false, smtp: false, smtphost: '', smtport: 0, smtpssl: true, connection_model: '', load_interval: '', debug: false, path: 'INBOX'}
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
                          <div class="block-header">Параметры подключения<label class="toggle toggle-init color-blue " style="float: right;"><input name="smtp"  type="checkbox" ${(email.smtp) ? 'checked': ''}><span class="toggle-icon"></span></label><label style="float:right;padding-right: 10px;padding-top: 0px;">Отправка писем</label></div>
                          <ul>
    
                            <li class="item-content item-input">
                              <div class="item-media">
                                <i class="icon material-icons demo-list-icon">email</i>
                              </div>
                              <div class="item-inner">
                                <div class="item-title item-label">Адрес сервера</div>
                                <div class="item-input-wrap imap" style="
                                    padding-left: 5px;
                                    margin-right: 5px;
                                ">
                                  <input type="url" name="host" class="validate " placeholder="IMAP хост" value="${email.host}"/>
                                  <span class="input-clear-button" style="padding-right: 10px;"></span>
                                </div>
                                <div class="item-input-wrap smtp" style="background: #5ac8fa54;dispaly:none;">
                                  <input type="url" name="smtphost" class="input-with-value" placeholder="SMTP хост" value="${(email.smtphost) ? email.smtphost: ''}"  style="padding-left: 5px;padding-right: 0px;">
                                  <span class="input-clear-button" style="padding-right: 5px;"></span>
                                </div>
                              </div>
                            </li>

                            <li class="item-content item-input">
                              <div class="item-media">
                                <i class="icon material-icons demo-list-icon">restore</i>
                              </div>
                              <div class="item-inner">
                                <div class="item-title item-label">Порт</div>
                                <div class="item-input-wrap imap" style="
                                    padding-left: 5px;
                                    margin-right: 5px;
                                ">
                                  <input type="number" style="padding-right: 5px;" class="validate" name="port" placeholder="IMAP порт" value="${email.port}"/>
                                </div>
                                <div class="item-input-wrap smtp" style="background: #c9edfd;dispaly:none;">
                                  <input type="number" class="" name="smtport" placeholder="SMTP порт" value="${email.smtport}" style="padding-left: 5px;margin-right: 0px;padding-right: 5px;">
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
                                <div class="item-input-wrap input-dropdown-wrap imap" style="margin-right: 5px;">
                                  <select placeholder="Please choose..." name="protocol" style="
                                        padding-left: 5px;
                                        margin-right: 5px;
                                   ">
                                    <option value="tls" ${(email.tls) ? 'selected': ''}>TLS</option>
                                    <option value="ssl" ${(email.tls) ? '': 'selected' }>SSL</option>
                                  </select>
                                </div>
                                <div class="item-input-wrap input-dropdown-wrap smtp" style="dispaly:none;">
                                  <select placeholder="Please choose..." name="smtpssl" style="padding-left: 5px;background: #c9edfd;">
                                    <option value="tls" ${(email.smtpssl) ? '': 'selected' }>TLS</option>
                                    <option value="ssl" ${(email.smtpssl) ? 'selected': '' }>SSL</option>
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
                      // SMTP 
                      check_smtp(popup.$el)
                      // Вкл.\выкл. дебаг 
                      popup.$el.on('click', 'input[type=debug]', function(){
                        validate(popup.$el)
                      })
                      // Вкл.\выкл SMTP
                      popup.$el.on('click', 'input[name=smtp]', function(){
                        check_smtp(popup.$el)
                        validate(popup.$el)
                      })
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
                          path: popup.$el.find('input[name=path]').val(),
                          smtp: popup.$el.find('input[name=smtp]').is(':checked'),
                          smtphost: popup.$el.find('input[name=smtphost]').val(),
                          smtport: popup.$el.find('input[name=smtport]').val(),
                          smtpssl: (popup.$el.find('select[name=smtpssl]').val() == 'ssl') ? true: false,
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