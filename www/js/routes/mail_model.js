function editor_parser(search, simple, parser){
  console.log(`SIMPLE: ${simple}, PARSER: ${parser}, SEARCH: ${search}`)
  if (search != 'body-html'){
      var html = $(`
          <li class="item-content item-input inline-label">
            <div class="item-inner">
              <div class="item-title item-label">Вырожение</div>
              <div class="item-input-wrap ${simple}">
                <textarea class="resizable parser" placeholder="python re.match: (?P<attrebute>[a-zA-Z]*)">${parser}</textarea>
              </div>
            </div>
          </li>
          <li class="item-content item-input inline-label">
            <div class="item-inner">
              <div class="item-title item-label">Текст</div>
              <div class="item-input-wrap">
                <input class="pattern-test-str" id="autocomplete-dropdown" type="text" placeholder="Введите текст" />
              </div>
            </div>
          </li>
          <li class="item-content item-input inline-label">
            <div class="item-inner">
              <div class="item-title item-label">Результат:</div>
              <div class="item-input-wrap">
                <input class="pattern-test-result simple" id="autocomplete-dropdown" type="text" placeholder="" />
              </div>
            </div>
          </li>`)
  }else if (search == ''){
    html = ''
  }else{
    var html = $(`
          <li class="item-content item-input inline-label">
            <div class="item-inner">
              <div class="item-title item-label">Вырожение</div>
              <div class="item-input-wrap ${simple}">
                <textarea class="resizable parser" placeholder="$('a.user-hover').text()">${parser}</textarea>
              </div>
            </div>
          </li>
          `)
  }
  return html
}


function filters(filtr, attr_list, method_list, fresh){
  var filter_list = ''
  console.dir(filtr)
  if (filtr != undefined){
      for (const [index, value] of filtr.entries()){

        obj = $(`
                <div>
                  <li class="row isfresh" index="${index}" pk="${value.pk}" style="margin: 0 21px 0 20px;">
                    <div class="col-30 item-input-wrap input-dropdown-wrap">
                      <select placeholder="Выбете из списка" name="attrebute">
                      ${attr_list}
                      </select>
                    </div>
                    <div class="col-20 item-input-wrap input-dropdown-wrap">
                      <select placeholder="Выбете из списка" name="method">
                      ${method_list}
                      </select>
                    </div>
                    <div class="col-45 item-input-wrap">
                      <input style="text-align: center;" value="${value.condition}" type="text" name="condition" placeholder="условие" />
                    </div>
                    <div class="col-5">
                    <a class="remove-fiter"><span class="material-icons hover-op" style="text-align: center;vertical-align: middle;font-size: 20px; color: #d10303;margin-top: 2px;opacity: 0.5;">cancel</span></a>
                    </div>
                  </li>
                </div>`)

      obj.find(`select[name=attrebute] option[value="${value.attribute}"]`).attr('selected', 'selected')
      obj.find(`select[name=method] option[value="${value.method}"]`).attr('selected', 'selected')
      filter_list += obj.html()
    }
      }
  return filter_list
}

function create_actions_param(action, current_rule, simple){
  const enable_action = current_rule.action
  const values = current_rule.action_parameters 
  const content = $('<div></div>')
  for (const [index, value] of action.entries()){
    const plugins = value.plugins.map(plugin => { return `<div class="chip plugin link" name="${plugin.name}">
    <div class="chip-media bg-color-blue">
      <i class="icon material-icons">${plugin.icon}</i>
    </div>
    <div class="chip-label">${plugin.description}</div>
  </div>`})
    const list = $(`<div class="list no-hairlines-md event-list ${enable_action.includes(value.id) ? '':'disable'}" action="${value.id}">
                    <div class="block-header" style="margin-left: 0;margin-right: -2px;"><font style="margin-right: 10px;">${value.parameters_title}</font>${plugins.join('')}</div>
                    <ul class="action_params" action="${value.id}" index="${index}"></ul>`)
    const action_name = value.name
    const parameters = value.parameters
    const enable = enable_action.includes(value.id)
      for (const [index, value] of parameters.entries()){
        let valid = (enable) ? (value.validate) ? 'validate': '': (value.validate) ? 'validates': '' 
        if (value.type == 'text'){
            list.find('ul').append(`
                <li class="item-content item-input">
                <div class="item-media">
                  <i class="icon material-icons demo-list-icon">data_object</i>
                </div>
                <div class="item-inner">
                  <div class="item-title item-label">${value.description}</div>
                  <div class="item-input-wrap ${simple}">
                    <input class="${valid}" type="text" name="${value.name}" placeholder="${value.placeholder}" value="${(values[action_name] && values[action_name][value.name]) ? values[action_name][value.name]: ''}" ${(valid) ? 'required validate':''} />
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>
          `)
      }else if (value.type == 'color'){
        list.find('ul').append(`
                <li class="item-content item-input">
                <div class="item-media">
                  <i class="icon demo-list-icon material-icons" id="${value.name}-color-picker-palette-value-${current_rule.pk}">invert_colors</i>
                </div>
                <div class="item-inner">
                  <div class="item-title item-label">${value.description}</div>
                  <div class="item-input-wrap item-color ${simple}">
                    <input class="${valid}" type="text" placeholder="${value.placeholder}" name="${value.name}" value="${(values[action_name] && values[action_name][value.name]) ? values[action_name][value.name]: ''}" readonly="readonly" id="${value.name}-color-picker-palette-${current_rule.pk}"  ${(valid) ? 'required validate':''}/>
                  </div>
                </div>
              </li>
          `)
      }else if (value.type == 'htmltext'){
        list.find('ul').append(`
                <li class="item-content item-input">
                <div class="item-media">
                  <i class="icon material-icons demo-list-icon">data_object</i>
                </div>
                <div class="item-inner">
                  <div class="item-title item-label">${value.description}</div>
                  <div class="item-input-wrap ${simple}">
                    <input class="count-data codemirror" type="text" style="color: #00000080;" value="${(values[action_name] && values[action_name][value.name]) ? 'Символов: '+ values[action_name][value.name].length: 'Cимволов: 0'}" readonly ${(valid) ? 'required validate':''} />
                    <textarea class="xml ${valid}" type="text" style="display:none" name="${value.name}" placeholder="${value.placeholder}">${(values[action_name] && values[action_name][value.name]) ? values[action_name][value.name]: ''}</textarea>
                    </div>
                </div>
              </li>
          `)
      }else if (value.type == 'checkbox'){
        list.find('ul').append(`
                <li class="item-content item-input">
                <div class="item-media">
                  <i class="icon material-icons demo-list-icon">data_object</i>
                </div>
                <div class="item-inner">
                  <div class="item-title item-label">${value.description}</div>
                  <div class="item-input-wrap ${simple}">
                    <input name="${value.name}" type="checkbox" ${(values[action_name] && values[action_name][value.name]) ? (values[action_name][value.name]) ? 'checked="true"': '': ''}"/>
                  </div>
                </div>
              </li>
          `)
      }
    }
    if (parameters.length > 0){
      content.append(list)
    }
  }
  return content.html()
}

routes.push(
    {
        path: '/mail-model/:index',
        url: './pages/model_list.html',
        on: {
          pageInit: function (event, page) {
            console.log('/mail model/', page, event)
            if (app.app_profile_data.model.length > 0){
                page.$el.find('.list-model ul').html('')
                page.$el.find('.list-sample ul').html('')
              // CREATE MAIL MODEL LIST
              for (const [index, element] of app.app_profile_data.model.entries()){
                if (element.is_owner){
                  var list = page.$el.find('.list-model ul')
                }else{
                  var list = page.$el.find('.list-sample ul')
                }
                list.append(
                  $(
                    `<li>
                      <a href="#" index="${index}" model="${element.pk}" class="item-link item-content mail-model-item">
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
              // Удаление модели
              page.$el.on('click', '.delete-model', function(){
               var model = $(this).attr('model')
               var index = $(this).attr('index')
               app.dialog.confirm('Вы хотите удалить данную модель?', 'Удаление модели', function (){
                  app.request(
                    {
                      url: app_api(`api/data/connection/mail/model/${model}`),
                      method: "DELETE",
                      statusCode: {
                        204: function (xhr) {
                          app.app_profile_data.model.splice(index, 1)
                          toast_done()
                          navigate('/mail-model/')
                          $(`.accordion-item a.model`).click()
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
              // Сортировка
              page.$el.on('click', '.sortable-toggle', function(){
                var model = undefined
                var model_index = undefined
                var icon = $(this).find('.material-icons')
                if (page.$el.find('.sortable-enabled').length > 0 ){
                    icon.text('save')
                }else{
                  icon.text('sort')
                  var sort_list = []
                    page.$el.find('a.mail-model-rule').forEach(
                      function(item){
                        console.log(item)
                        var pk = $(item).attr('pk')
                        if (pk != null){
                          model = $(item).attr('model')
                          model_index = $(item).attr('model_index')
                          sort_list.push($(item).attr('pk'))
                        }
                      })
                    console.log(sort_list)
                    app.request.postJSON(app_api(`/api/data/connection/mail/model/${model}/rules/sort`),
                                  {
                                    "order": sort_list,
                                  }
                                  , function(request){
                                      app.app_profile_data.model[model_index].rule.email = request
                                      toast_done()
                                      $(`.mail-model-item[model="${model}"]`).click()

                                    }
                                  , function (request){
                                      if (request.status == 400){
                                        console.dir(request)
                                      }else{
                                        ErrorProcessorRequest(request)
                                      }
                                    }
                                  )
                }
              })

              // Вкл./Выкл. правила
              page.$el.on('click', '.rule-enable input', function(){
                var index = $(this).attr('index')
                var pk = $(this).attr('pk')
                var model_index = $(this).attr('model_index')
                var enable = $(this).is(':checked')
                app.request(
                  {
                    url: app_api(`api/data/connection/mail/model/rules/${pk}`),
                    method: "PATCH",
                    dataType: 'json',
                    contentType: "application/json",
                    data: {rule: {enable: enable}},
                    statusCode: {
                      201: function (xhr) {
                        var response = JSON.parse(xhr.response)
                        app.app_profile_data.model[model_index].rule.email[index].enable = response.enable
                      },
                      401: function (xhr) {
                        console.log(xhr)
                        ErrorProcessorRequest({status: '401'})
                      } 
                  }
                })
              })
              // Дубликат модели
              // Создание модели
              page.$el.on('click', '.create-model', function(){
                var model = $(this).attr('model')
                if (model != undefined){
                   var url = app_api(`api/data/connection/mail/model/${model}/duplicate`)
                }else{
                  var url = app_api('api/data/connection/mail/model')
                }
                var create_model_dialog = app.dialog.create({
                  title: 'Новая модель',
                  content: `
                  <div class="list no-hairlines-md" style="margin-top: 15px;margin-bottom: 15px;">
                      <div style="margin-left: -10px;margin-right: -10px;">
                        <li class="item-content item-input item-input-outline" style="padding-left: 0px;">
                          <div class="item-inner" style="padding-right: 0px;padding-top: 0px;padding-bottom: 0px;">
                            <div class="item-title item-floating-label">Имя</div>
                            <div class="item-input-wrap">
                              <input type="text" name="name" placeholder="Имя атрибута" class="validate">
                              <span class="input-clear-button"></span>
                            </div>
                          </div>
                        </li>
                        <li class="item-content item-input item-input-outline" style="padding-left: 0px;">
                          <div class="item-inner" style="padding-right: 0px;padding-top: 8px;padding-bottom: 0px;">
                            <div class="item-title item-floating-label">Описание</div>
                            <div class="item-input-wrap" style="padding-top: 0px;">
                              <input type="text" name="description" placeholder="Краткое описание" class="validate">
                              <span class="input-clear-button"></span>
                            </div>
                          </div>
                        </li>
                      </div>
                      </div>
                      <p class="segmented segmented-raised" style="
                              margin-bottom: -20px;
                              margin-left: -20px;
                              margin-right: -20px;
                              margin-top: 28px; ">
                
                      <button class="button close" style="border-radius: 0;height: 45px;">Отмена</button>          
                      <button class="button create required-validate" validate="false" style="border-radius: 0;height: 45px;">Создать</button>
                      </p>
                        `,
                  on: {
                    opened: function (dialog) {
                      dialog.$el.on('click', 'button.close', function(){
                        create_model_dialog.close()
                        create_model_dialog.destroy()
                      })
                      dialog.$el.on('click', 'button.create', function(){
                        app.request.postJSON(url, 
                          {
                            name: dialog.$el.find('input[name=name]').val(),
                            description: dialog.$el.find('input[name=description]').val()
                          }, function(request){
                            console.log(typeof request);
                            var new_date = (model != undefined) ? request[0]:request
                                new_date['is_owner'] = true
                            app.app_profile_data.model.push(new_date)
                            navigate('/mail-model/')
                          },
                          function(request){
                            if (request.status == 400){
                              console.dir(request)
                            }else{
                              ErrorProcessorRequest(request)
                            }
                          }
                          )
                        create_model_dialog.close()
                        create_model_dialog.destroy()
                      })
                      dialog.$el.on('input', 'input.validate', function(){
                        validate(dialog.$el)
                      })
                    }
                  }
                })
                create_model_dialog.open()
              });
              // CLICK RILE
              page.$el.on('click', '.mail-model-item', function(){
                    page.$el.find('.mail-model-item').forEach(function(item){$(item).css('background', '')})
                    $(this).css('background','aquamarine')

                    var model = $(this).attr('model')
                    var model_index =  $(this).attr('index')
                    var item = $(this).attr('index')
                    var model_item = app.app_profile_data.model[item]
                    try {
                      var attributes = model_item.attributes.email
                      var rules = model_item.rule.email
                    }catch(e){
                      var attributes = []
                      var rules = []
                    } 
                    var simple = (model_item.is_owner) ? '':'simple'
                    // CREATE DEFAULT ITEMS
                    var attributes_list = $(`
                            <!--Rule list-->
                            <div class="block-title" style="margin-left: 0;margin-right: 0;">Атрибуты
                              <a style="float: right;" model="${model}" model_index="${model_index}" class="mail-model-attr ${simple}" action="create">
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
                            <div class="block-title" style="margin-left: 0;margin-right: 0;">Правила
                              <a style="float: right;" model="${model}" model_index="${model_index}" class="mail-model-rule ${simple}" action="create">
                                <span class="material-icons">add</span>
                                </a>
                                <a style="float: right;" class="link sortable-toggle" data-sortable=".sortable"><span class="material-icons">sort</span></a>
                            </div>
                            <div class="list sortable sortable-opposite" style="padding-bottom: 30px;">
                                <ul>
                                </ul>
                            </div>
                            <!-- Rule filtr-->
                    `)
                    // ATTR
                      if (attributes.length > 0){
                        for (const [index, element] of attributes.entries()){
                          $(attributes_list[4]).find('ul').append($(
                            `<li>
                            <a href="#" pk="${element.pk}" index="${index}" model="${model}" model_index="${model_index}" class="item-link item-content mail-model-attr" action="update">
                              <div class="item-media"><span class="material-icons">data_object</span></div>
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
                            `  <li style="display: flex;">
                            <a href="#" style="width: 100%;" pk="${element.pk}" index="${index}" model="${model}" model_index="${model_index}" class="item-link item-content mail-model-rule" action="update">
                            <div class="item-media"><span class="material-icons">settings</span></div>
                            <div class="item-inner">
                                <div class="item-title">${element.name}</div>
                                <div class="item-after"></div>
                            </div>
                            </a>
                            <label style="float: right;margin: 0 10px 0 10px;" class="toggle toggle-init rule-enable color-green ${simple}" style="float: right;">
                                <input model_index="${model_index}" pk="${element.pk}" index="${index}" type="checkbox" ${(element.enable) ? 'checked="true"': ''}"/>
                                <span class="toggle-icon"></span>
                            </label>
                            <div class="sortable-handler"></div>
                        </li>`
                          ))
                        }
                      }else{
                        $(rules_list[4]).find('ul').append($('<li><div style="padding: 15px;text-align: center;color: #00000094;">список пуст</div></li>'))
                      }

                      // INSERT ATTR LUST
                      page.$el.find('.block-model-details').html(`
                            <!--Model info-->
                            <div class="block-title" style="margin-left: 0;margin-right: 0;">Модель
                              <a style="float: right;" model="${model}" index="${model_index}" class="delete-model ${simple}">
                                  <span class="material-icons" style="font-size: 20px;">delete</span>
                              </a>
                              <a style="float: right;" model="${model}" class="create-model">
                                  <span class="material-icons" style="margin-right: 5px;font-size: 20px;">content_copy</span>
                              </a>
                              
                            </div>
  

                              <div class="list inline-labels no-hairlines-md" style="margin-top: 0px;">
                                <ul>
                                    <li class="item-content item-input">
                                      <div class="item-media">
                                        <i class="icon material-icons demo-list-icon">segment</i>
                                      </div>
                                      <div class="item-inner">
                                        <div class="item-title item-label">Описание</div>
                                        <div class="item-input-wrap">
                                          <input type="text" name="name" placeholder="example" value="${model_item.description}" style="text-align: right;"/>
                                          <span class="input-clear-button"></span>
                                        </div>
                                      </div>
                                    </li>
                                    <li class="item-content item-input">
                                      <div class="item-media">
                                        <i class="icon material-icons demo-list-icon">segment</i>
                                      </div>
                                      <div class="item-inner">
                                        <div class="item-title item-label">Виден всем (шаблон)</div>
                                        <div class="item-input-wrap">
                                            <label class="toggle toggle-init color-green ${simple}" style="float: right;">
                                                <input type="checkbox" checked="${model_item.visible}"/>
                                                <span class="toggle-icon"></span>
                                            </label>
                                        </div>
                                      </div>
                                    </li>
                                </ul>
                            </div>
                            <!--Model info-->`)
                      page.$el.find('.block-model-details').append(attributes_list)
                      page.$el.find('.block-model-details').append(rules_list)
                })
            }

            // OPEN EMAIL NODEL ATTR
            page.$el.on('click', '.mail-model-attr', function(){
              var el = $(this).attr('pk')
              var el_index = $(this).attr('index')
              var model_index = $(this).attr('model_index')
              var model = $(this).attr('model')
              var model_item = app.app_profile_data.model[model_index]
              var simple = (model_item.is_owner) ? '':'simple'
              var search_list = ''
              
              if (el_index != null){
                var item = model_item.attributes.email[el_index]
              }else{
                var item = {search_in: '', Attribute: '', description: '', visible: false}
              }
              
              for (const value of model_item.attributes.search_choices){
                search_list += `<option value="${value[0]}" ${(value[0] == item.search_in) ? 'selected':'' }>${value[1]}</option>`
              }
              

              var MailMoldelAttrPopup = app.popup.create({
                  index: el_index,
                  simple: simple,
                  content: `
                      <div class="popup" style="">
                        <div class="view view-popup">
      
                          <!-- titlebar -->
                          <div class="navbar queue-popup">
                              <div class="navbar-bg"></div>
                              <div class="navbar-inner navbar-inner-centered-title">
                                  <div class="left">
                                      <a href="#" class="link popup-close">Закрыть</a>
                                  </div>
                                  <div class="title" style="left: 250.5px;"></div>
                                  <div class="right">
                                      <a href="#" style="display ${(simple != '') ? 'none':''}" class="link popup-close mail-attr-save required-validate" validate="false" attrebute="${el}" attr_index="${el_index}" model="${model}">Сохранить</a>
                                  </div>
                              </div>
                          </div>

                          <div class="toolbar messagebar" style="background: #f7f7f8;">
                            <center style="margin-top: 10px;">
                              <a style="opacity: 0.5" class="mail-attr-delete hover-op popup-close" attrebute="${el}" attr_index="${el_index}">
                                удалить
                              </a>
                            </center>
                          </div>

                          <!-- content -->
                          <div class="page-content">
                            <div class="list inline-labels no-hairlines-md">
                            <div class="block-header" >Параметры атрибута</div>
                            <ul>

                              <li class="item-content item-input">
                                <div class="item-media">
                                  <i class="icon material-icons demo-list-icon">text_format</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Имя</div>
                                  <div class="item-input-wrap ${simple}">
                                    <input class="validate" type="text" name="name" placeholder="example" value="${item.Attribute}"/>
                                    <span class="input-clear-button"></span>
                                  </div>
                                </div>
                              </li>

                              <li class="item-content item-input">
                                <div class="item-media">
                                  <i class="icon material-icons demo-list-icon">question_mark</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Описание</div>
                                  <div class="item-input-wrap ${simple}">
                                    <input type="text" class="validate" name="description" placeholder="Пример" value="${item.description}" />
                                    <span class="input-clear-button"></span>
                                  </div>
                                </div>
                              </li>
      
                              <li class="item-content item-input">
                                <div class="item-media">
                                  <i class="icon material-icons demo-list-icon">manage_search</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Искать в</div>
                                  <div class="item-input-wrap input-dropdown-wrap ${simple}">
                                    <select class="search" placeholder="Выбете из списка">
                                    ${search_list}
                                    </select>
                                  </div>
                                </div>
                              </li>

                              <li class="item-content item-input">
                                <div class="item-media" style="opacity: 0.6;">
                                  <i class="icon material-icons demo-list-icon">visibility</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Отображаемый</div>
                                  <div class="item-input-wrap">
                                    <label class="toggle toggle-init color-green ${simple}" style="float: right;">
                                        <input name="visible" type="checkbox" ${(item.visible) ? 'checked="true"': ''}>
                                        <span class="toggle-icon"></span>
                                    </label>
                                  </div>
                                </div>
                              </li>

                              <li></li>
                            </ul>
                          </div>
                          
                          <div class="block-title"></div>
                          <div class="list no-hairlines-md parser-test">
                            <div class="block-header">Парсирование</div>
                            <ul>
                            <ul>
                            </ul>
                          </div>

                          </div>
                        </div>
                      </div>
                    `,
                    // Events
                    on: {
                      open: function (popup) {
                        var parser = ''
                        try {
                          var parser = model_item.attributes.email[el_index].parser
                          validate(popup.$el)
                        }catch(e){
                          console.log(e)
                          }
                        var pars = editor_parser(popup.$el.find('ul select.search').val(), simple, parser)
                        popup.$el.find('.parser-test ul').append(pars)
                      },
                      opened: function (popup) {

                        // Ввод текста для тестового парсинга
                        popup.$el.on('change', '.pattern-test-str', 
                          function(){
                            var attr = popup.$el.find('ul input[name=name]').val()
                            var parser = popup.$el.find('ul textarea.parser').val().split('?P').join('?')
                            var value = $(this).val()
                            try {
                              result = value.match(parser).groups[attr]
                            }catch(e){
                              result = `Не найдено значение атрибута ${attr}`
                            }
                            popup.$el.find('.pattern-test-result').val(result)
                            console.log(`PARSER: ${parser}, VAL: ${value}`)
                          })
                        

                        // тригер заполнение полей проходящих проверку
                        popup.$el.on('input', 'ul input.validate', function(){
                          validate(popup.$el)
                        })

                        // Выбор значения в поле "искать в"
                        popup.$el.on('change', 'ul select.search', function(){
                          popup.$el.find('.parser-test ul').html('')
                          var search = popup.$el.find('ul select.search').val()
                          popup.$el.find('.parser-test ul').append(editor_parser(search, simple, ''))
                        })

                        // Сохранение почтового атирбута
                        popup.$el.on('click', '.mail-attr-save', function(){
                            var attrebute = $(this).attr('attrebute')
                            var attrebute_index = parseInt($(this).attr('attr_index'))
                            var model = $(this).attr('model')
                            var name = popup.$el.find('ul input[name=name]').val()
                            var description = popup.$el.find('ul input[name=description]').val()
                            var search = popup.$el.find('ul select.search').val()
                            var parser = popup.$el.find('ul textarea.parser').val()
                            var visible = popup.$el.find('ul input[name=visible]').is(':checked')
                            if (attrebute == 'null') {
                                app.request.postJSON(app_api('api/data/connection/mail/model/attrebutes'),
                                  {
                                    "Attribute": name,
                                    "connection_model": model,
                                    "description": description,
                                    "search_in": search,
                                    "parser": (parser == '') ? '-': parser,
                                    "visible": visible
                                  }
                                  , function(request){
                                      app.app_profile_data.model[model_index].attributes.email.push(request)
                                      toast_done()
                                      $(`.mail-model-item[model="${model}"]`).click()

                                    }
                                  , function (request){
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
                                  url: app_api(`api/data/connection/mail/model/attrebutes/${attrebute}`),
                                  method: "PATCH",
                                  data: {
                                    "Attribute": name,
                                    "description": description,
                                    "search_in": search,
                                    "parser": (parser == '') ? '-': parser,
                                    "visible": visible
                                  },
                                  statusCode: {
                                    200: function (xhr) {
                                      var attr = JSON.parse(xhr.response)
                                      console.dir({new_attr: attr, update_index: attrebute_index})
                                      app.app_profile_data.model[model_index].attributes.email[attrebute_index] = attr
                                      $(`.mail-model-item[model="${model}"]`).click()
                                      toast_done()
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
                            }
                        })
                        // удаление почтового атрибута
                        popup.$el.on('click', '.mail-attr-delete', function(){
                          attr = $(this).attr('attrebute')
                          index = parseInt($(this).attr('attr_index'))
                          
                          app.request(
                            {
                              url: app_api(`api/data/connection/mail/model/attrebutes/${attr}`),
                              method: "DELETE",
                              statusCode: {
                                204: function (xhr) {
                                  app.app_profile_data.model[model_index].attributes.email.splice(index, 1)
                                  $(`.mail-model-item[model="${model}"]`).click()
                                  toast_done()
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

                      },
                    }
                  });
                  MailMoldelAttrPopup.open()
            })

            // Создания\редактирование правил
            // OPEN EMAIL NODEL ATTR
            page.$el.on('click', '.mail-model-rule', function(){
                var rule_index = $(this).attr('index')
                var rule = $(this).attr('pk')
                var model = $(this).attr('model')
                var model_index = $(this).attr('model_index')
                var model_item = app.app_profile_data.model[model_index]

                const actions = app.app_profile_data.model[model_index].rule.email_action_list
                const method = app.app_profile_data.model[model_index].rule.email_method_list
                var filtr = []
                try {
                  var current_rule = app.app_profile_data.model[model_index].rule.email[rule_index]
                  filtr = current_rule.filter
                }catch(e){
                  console.log(e)
                  var current_rule = {name: '', stop_flag: false, action: [], notification: false, event: '', event_description: '', event_link: '', action_parameters: ''} 
                }
                const attrebute = app.app_profile_data.model[model_index].attributes.email

                var simple = (model_item.is_owner) ? '':'simple'
                var action_list = ''
                var attr_list = ''
                var method_list = ''

                for (const value of actions){
                  action_list += `<option value="${value.id}" ${(current_rule.action.includes(value.id))? 'selected': ''}>${value.description}</option>`
                }

                for (const value of attrebute){
                  attr_list += `<option value="${value.pk}">${value.Attribute}</option>`
                }

                for (const value of method){
                  method_list += `<option value="${value[0]}">${value[1]}</option>`
                }
                
                var filter_list = filters(filtr, attr_list, method_list, false)
                var MailMoldelRulePopup = app.popup.create({
                  content: `
                      <div class="popup" style="">
                        <div class="view view-popup">
      
                          <!-- titlebar -->
                          <div class="navbar queue-popup">
                              <div class="navbar-bg"></div>
                              <div class="navbar-inner navbar-inner-centered-title">
                                  <div class="left">
                                      <a href="#" class="link popup-close">Закрыть</a>
                                  </div>
                                  <div class="title" style="left: 250.5px;"></div>
                                  <div class="right">
                                      <a href="#" style="display ${(simple != '') ? 'none':''}" class="link popup-close mail-rule-save required-validate" validate="false">Сохранить</a>
                                  </div>
                              </div>
                          </div>

                          <div class="toolbar messagebar" style="background: #f7f7f8;">
                            <center style="margin-top: 10px;">
                              <a style="opacity: 0.5" class="mail-rule-delete  hover-op popup-close" >
                                удалить
                              </a>
                            </center>
                          </div>

                          <!-- content -->
                          <div class="page-content">
                            <div class="list inline-labels no-hairlines-md">
                            <div class="block-header" >Правило</div>
                            <ul>

                              <li class="item-content item-input">
                                <div class="item-media">
                                  <i class="icon material-icons demo-list-icon">text_format</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Имя</div>
                                  <div class="item-input-wrap ${simple}">
                                    <input class="validate" type="text" name="name" placeholder="example" value="${current_rule.name}" />
                                    <span class="input-clear-button"></span>
                                  </div>
                                </div>
                              </li>

                              <!--li class="item-content item-input">
                                <div class="item-media">
                                  <i class="icon material-icons demo-list-icon">manage_search</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Действие</div>
                                  <div class="item-input-wrap input-dropdown-wrap {simple}">
                                    <select name="action" placeholder="Выбете из списка" ">
                                    {action_list}
                                    </select>
                                  </div>
                                </div>
                              </li-->

                              <li class="item-content item-input">
                                <div class="item-media" style="opacity: 0.6;">
                                  <i class="icon material-icons demo-list-icon">stop_circle</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Остановить проверку</div>
                                  <div class="item-input-wrap ${simple}">
                                    <label class="toggle toggle-init color-green " style="float: right;">
                                        <input name="stop" type="checkbox" ${(current_rule.stop_flag) ? 'checked': ''}>
                                        <span class="toggle-icon"></span>
                                    </label>
                                  </div>
                                </div>
                              </li>
                              <li class="item-content item-input">
                                <div class="item-media" style="opacity: 0.6;">
                                  <i class="icon material-icons demo-list-icon">notifications</i>
                                </div>
                                <div class="item-inner">
                                  <div class="item-title item-label">Уведомление</div>
                                  <div class="item-input-wrap">
                                    <label class="toggle toggle-init color-green ${simple}" style="float: right;">
                                        <input name="notification" type="checkbox" ${(current_rule.visible) ? 'checked="true"': ''}>
                                        <span class="toggle-icon"></span>
                                    </label>
                                  </div>
                                </div>
                              </li>
                              <li class="item-content item-input">
                                <a class="item-link smart-select smart-select-init ${simple}" data-open-in="popover" style="width: 100%;">
                                  <select name="action" multiple>
                                  ${action_list}

                                  </select>
                                  <div class="item-content" style="padding-left: 0px;">
                                    <div class="item-inner">
                                      <div class="item-title">Выполнить</div>
                                    </div>
                                  </div>
                                </a>
                              </li>
                              <li></li>
                            </ul>
                          </div>
                          
                          ${create_actions_param(actions, current_rule, simple)}

                          <div class="list no-hairlines-md fiter-list">
                            <div class="block-header" style="margin-left: 0;margin-right: -2px;">Фильтры
                              <a style="float: right;" model="${model}" model_index="${model_index}" class="mail-model-fiter ${simple}">
                                <span class="material-icons">add</span>
                                </a>
                            </div>
                            <ul>
                              ${filter_list}
                            </ul>
                          </div>

                          </div>
                        </div>
                      </div>
                    `,
                    // Events
                    on: {
                      open: function (popup) {
                        validate(popup.$el)
                      },
                      opened: function (popup) {
                        // Выбор цвета
                        popup.$el.find('.item-color input').forEach(function(el){
                          let name = el.name
                          console.log(el.name, current_rule.pk, el.value)
                          const colorPicker = app.colorPicker.create({
                            inputEl: `#${name}-color-picker-palette-${current_rule.pk}`,
                            targetEl: `#${name}-color-picker-palette-value-${current_rule.pk}`,
                            targetElSetBackgroundColor: true,
                            modules: ['palette'],
                            openIn: 'auto',
                            openInPhone: 'sheet',
                            palette: [
                              ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'],
                              ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A', '#4A148C'],
                              ['#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB', '#5C6BC0', '#3F51B5', '#3949AB', '#303F9F', '#283593', '#1A237E'],
                              ['#E1F5FE', '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4', '#039BE5', '#0288D1', '#0277BD', '#01579B'],
                              ['#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B', '#00796B', '#00695C', '#004D40'],
                              ['#F1F8E9', '#DCEDC8', '#C5E1A5', '#AED581', '#9CCC65', '#8BC34A', '#7CB342', '#689F38', '#558B2F', '#33691E'],
                              ['#FFFDE7', '#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58', '#FFEB3B', '#FDD835', '#FBC02D', '#F9A825', '#F57F17'],
                              ['#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00', '#E65100'],
                            ],
                            value: {
                              hex: (el.value) ? el.value: '#ffffff'
                            },
                            formatValue: function (value) {
                              return value.hex;
                            },
                          });
                          console.log(colorPicker)
                          })
                        // Выбор действий
                        app.smartSelect.create(
                          { 
                              el: $('.smart-select'),
                              view: app.views.create('.view-popup'),
                              openIn: 'popover',
                              on: {
                                close: function () {
                                  const enable = this.getValue()
                                  popup.$el.find('.event-list').forEach(function(el){
                                    let current = $(el).attr('action')
                                    if (enable.includes(current)){
                                      // показываем параметы
                                      if ($(el).hasClass('disable')){
                                        $(el).removeClass('disable')
                                      }
                                      // включаем валидацию
                                      let validate = $(el).find('.validates')
                                      console.log(validate)
                                      if (validate){
                                          validate.removeClass('validates')
                                          validate.addClass('validate')
                                      }
                                    }else{
                                      // скрываем параметры
                                      if (!$(el).hasClass('disable')){
                                        $(el).addClass('disable')
                                      }
                                      // выключаем валидацию
                                      let validate = $(el).find('.validate')
                                      console.log(validate)
                                      if (validate){
                                          validate.removeClass('validate')
                                          validate.addClass('validates')
                                      }
                                    }
                                  })
                                  validate(popup.$el)
                                }
                              }
                          });
                        // Редактор кода
                        popup.$el.on('click', '.codemirror', function(){
                          let text = $(this.offsetParent).find('textarea')
                          let cont = this
                          var dynamicSheet = app.sheet.create({
                            content: `
                              <div class="sheet-modal" style="height: 100%">
                                <div class="toolbar">
                                  <div class="toolbar-inner">
                                    <div class="left">
                                      <p class="segmented segmented-raised">
                                        <button class="button button-active autoformat"><span class="material-icons">sort</span></button>
                                        <button class="button search"><span class="material-icons">manage_search</span></button>
                                        <button class="button replace-all" ><span class="material-icons">find_replace</span></button>
                                      </p>
                                    </div>
                                    <div class="right">
                                      <button class="button button-active sheet-close" onclick="autoFormatSelection()"><span class="material-icons">save</span></button>
                                    </div>
                                  </div>
                                </div>
                                <div class="sheet-modal-inner">
                                  <div class="block" style="height: 100%">
                                    <textarea class="xml" type="text" style="100%">${text.value()}</textarea>
                                  </div>
                                </div>
                              </div>
                            `,
                            // Events
                            on: {
                              open: function (sheet) {
                                console.log('Sheet open');
                                var code = CodeMirror.fromTextArea(sheet.$el.find('textarea')[0], 
                                { 
                                  mode: 'xml', 
                                  lineNumbers: true, 
                                  fullScreen: true,
                                  extraKeys: {"Alt-F": "findPersistent"}
                                })
                                
                                sheet.$el.on('click', '.autoformat', function(){
                                  var range = getSelectedRange();
                                  code.autoFormatRange(range.from, range.to);
                                })

                                sheet.$el.on('click', '.search', function(){
                                  CodeMirror.commands.findPrev(code)
                                })

                                sheet.$el.on('click', '.replace-all', function(){
                                  CodeMirror.commands.replaceAll(code)
                                })

                                // Выделить все
                                //CodeMirror.commands["selectAll"](code);
                                
                                function getSelectedRange() {
                                  return { from: code.getCursor(true), to: code.getCursor(false) };
                                }
                                
                                sheet.code = code

                              },
                              opened: function (sheet) {
                                console.log(sheet.code);
                              },
                              closed: function(sheet){
                                text.value(sheet.code.getValue())
                                cont.value = 'Символов: ' + sheet.code.getValue().length
                              }
                            }
                          });
                          dynamicSheet.open()
                        })
                        

                        //popup.$el.find('textarea.xml').forEach(el => {
                        //  CodeMirror.fromTextArea(el, { mode: 'xml', lineNumbers: true, viewportMargin: Infinity })
                        //})
                        // Плагины 
                        popup.$el.on('click', '.plugin', function(){
                          let ul = this.parentElement.nextElementSibling
                          let name = $(this).attr('name')
                          //
                          const params = {}

                          $(ul).find('input').forEach(function(el){
                            params[el.name] = el.value
                          })

                          $(ul).find('textarea').forEach(function(el){
                            params[el.name] = el.value
                          })
                          // Новое окно с плагином
                          newWin = window.open(app_api(`plugin/${name}/${rule}`), `Плагин ${name}`, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600,top="+(screen.height-400)+",left="+(screen.width-840));
                          
                        })
                        // Новый фильтр
                        popup.$el.on('click', '.mail-model-fiter', function(){
                          popup.$el.find('.fiter-list ul').append(filters([{condition: '', attribute: '0', method: ''}], attr_list, method_list, true))
                        })
                        // Удалить фильр
                        popup.$el.on('click', '.remove-fiter', function(){
                          $(this.offsetParent).remove()
                        })
                        // Проверка заполнености обязателных полей
                        popup.$el.on('input', 'input.validate', function(){
                          validate(popup.$el)
                        })
                        // Сохранение
                        popup.$el.on('click', '.mail-rule-save', function(){
                          var name = popup.$el.find('input[name=name]').val()
                          var action = app.smartSelect.get('.smart-select').getValue()
                          var stop = popup.$el.find('input[name=stop]').is(':checked')
                          var notification = popup.$el.find('input[name=notification]').is(':checked')
                          var new_filter_list = []

                          // собираем значение параметров "действий"
                          const params = {}
                          popup.$el.find('ul.action_params').forEach(function(el){
                            console.log($(el).attr('index'))
                            console.log(actions)
                            let _action = actions[$(el).attr('index')].name
                            if (!params[_action]){
                              params[_action] = {}
                            }
                              $(el).find('input').forEach(function(el){
                                params[_action][el.name] = el.value
                              })

                              $(el).find('textarea').forEach(function(el){
                                params[_action][el.name] = el.value
                              })
                          })
                          
                          // собираем фильтры
                          $('.fiter-list li').forEach(function(item){
                            var pk = $(item).attr('pk')
                            var attribute = $(item).find('select[name=attrebute]').val()
                            var method = $(item).find('select[name=method]').val()
                            var condition = $(item).find('input[name=condition]').val()
                            if (condition != ''){
                              new_filter_list.push({pk: pk, attribute: attribute, method: method, condition: condition})
                            }
                          })

                          
                          if (rule == null) {
                              const data = {rule: {name: name, connection_model: model, action: action, stop_flag: stop, notification: notification, action_parameters: params}, filter: new_filter_list}
                              console.log(data)
                              app.request.postJSON(app_api('api/data/connection/mail/model/rules'), data,
                                function(request){
                                  app.app_profile_data.model[model_index].rule.email.push(request)
                                  toast_done()
                                  $(`.mail-model-item[model="${model}"]`).click()
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
                            const data = {rule: {connection_model: model, name: name, action: action, stop_flag: stop, notification: notification, action_parameters: params}, filter: new_filter_list}
                            console.log(data)
                            app.request(
                              {
                                url: app_api(`api/data/connection/mail/model/rules/${rule}`),
                                method: "PATCH",
                                dataType: 'json',
                                contentType: "application/json",
                                data: data,
                                statusCode: {
                                  201: function (xhr) {
                                    var attr = JSON.parse(xhr.response)
                                    app.app_profile_data.model[model_index].rule.email[rule_index] = attr
                                    toast_done()
                                  $(`.mail-model-item[model="${model}"]`).click()
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
                          }
                          

                        })
                        // удаление
                        popup.$el.on('click', '.mail-rule-delete', function(){
                          app.request(
                            {
                              url: app_api(`api/data/connection/mail/model/rules/${rule}`),
                              method: "DELETE",
                              statusCode: {
                                204: function (xhr) {
                                  app.app_profile_data.model[model_index].rule.email.splice(rule_index, 1)
                                  $(`.mail-model-item[model="${model}"]`).click()
                                  toast_done()
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
                          
                      },
                    }
                  });
                  MailMoldelRulePopup.open()
            })
          },
          pageAfterIn: function (event, page) {
            var index = page.route.params.index
            if (index >= 0){
              page.$el.find(`.mail-model-item[index="${index}"]`).click()
            }
          }

        }
      }
)