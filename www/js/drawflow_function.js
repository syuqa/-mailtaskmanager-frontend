
var $ = Dom7;

// Иформационное сообщение
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

// Дополенение шаблона
function examinationSpecHtml(spec){
  let el = $(spec.html)
  // Заголовок
  let title = el.find('.title-box')
  console.log(title[0].childElementCount)
  try{
    console.log(title, title.childElementCount)
  if (title[0].childElementCount == 0){
    title.html(`
    <div style="display: flex;">
        <i class="title-icon material-icons">${spec.icon}</i>
        <font style="width: 100%;padding-right: 30px;">${spec.description}</font>
        <div class="preloader publish color-blue" style="display:none">
            <span class="preloader-inner" style="width: 20px;height: 20px;top: 15px;left: -10px;">
                <span class="preloader-inner-circle"></span>
            </span>
        </div>
        <a class="material-icons rollback link" style="float: right;padding-top: 12px;margin-right: 10px;color: red;display: none">close</a>
        <a class="material-icons done create-model link" style="float: right;padding-top: 12px;margin-right: 10px;color: green;display: none">done</a>
        <i class="material-icons open tooltip-init" data-tooltip="Группа: двойнок щелчек по блоку." style="float: right;font-size: 18px;padding-top: 17px;margin-right: 10px;color:#80808066">open_in_new</i>
    </div>
    `)
  }
  }catch(err){
    console.log(err)
  }
  return el.html()
}

// переход
function navigate(path, reload=true){
  return app.view.current.router.navigate(path, 
     {   
       ignoreCache: reload,
       reloadCurrent: reload,
       reloadAll: reload
     }
   )
 }
// 

// Валидация полей
function validate(el){
    console.log('validate')
    var count_validate = 0
    var current_num_validate = 0
    var input_items = [...el.find('input.validate'), ...el.find('textarea.validate')]
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

// Блокировка компоненторв
function block(block){
    let wrapper = $('.wrapper .col')
    if (wrapper.hasClass('simple') && ! block){
      wrapper.removeClass('simple')
    }else if ( !wrapper.hasClass('simple') && block){
      wrapper.addClass('simple')
    }

    let menus = $('.menu')
    if (menus.hasClass('simple') &&  ! block){
      menus.removeClass('simple')
    }else if (! menus.hasClass('simple') &&  block){
      menus.addClass('simple')
    }

}

// Публикация данных
function publish(data, url, resolve, reject){

  function badGatewayMessage(title, text) {
     let note = app.notification.create({
        icon: '<i class="material-icons icon">language</i>',
        title: title,
        text: text,
        closeButton: true,
      })
      note.open()
  }

  // api/data/connection/mail/connector
  let id = data.id || -1
  let publish_data = data
    delete publish_data.id
    delete publish_data.index
    console.log('PUBLISH DATA', data)
  if (id < 0){
      app.request.postJSON(app_api(url), publish_data, resolve, reject)
  }else{
    app.request(
      {
        url: app_api(`${url}/${id}`),
        method: "PATCH",
        dataType: 'json',
        contentType: 'application/json',
        data: publish_data,
        statusCode: {
          200: function (xhr) {
            //var response = JSON.parse(xhr.response)
            let message = app.notification.create({
              icon: '<i class="material-icons icon">language</i>',
              title: 'Публикация изменений',
              text: 'Изменения опубликованы',
              closeButton: true,
            })
            resolve(xhr.response, message)
          },
          0: function(xhr){
            badGatewayMessage('Ошибка публикации', 'Отсутсвует подключение к интернету')
            reject(xhr)
          },
          502: function(xhr){
            badGatewayMessage('Ошибка публикации', 'Сервер недоступен')
            reject(xhr)
          },
          400: function(xhr){
            console.log(xhr)
            let message = new String()
            try{
              Object.entries(JSON.parse(xhr.response)).forEach((key, value) => {
                message += `${key}: ${value}`
              })
            }catch(e){
                message = xhr.response
            }
            console.log(message)
            
            badGatewayMessage('Ошибка публикации', message)
            reject(xhr)
          },
          401: function(xhr){
            reject(xhr)
          }
        }
    })
  } 
}

// Публикация
$(document).on('click', '.drawflow-node .done', function(){

  function error(request){
    function errtext(request){
      let text = new String()
      for (const [key, value] of Object.entries(JSON.parse(request.responseText))){
        text += `<p>${key}: ${value}</p>`
      }
      return text
    }

    console.log(request)
      $(`#node-${app.node_selected_id} .rollback`).css('display', '')
      $(`#node-${app.node_selected_id} .done`).css('display', '')
      $(`#node-${app.node_selected_id} .publish`).css('display', 'none')
  }

  function done(){
    block()
    $('.drawflow .shroud').remove()
    $(`#node-${app.node_selected_id} .publish`).css('display', 'none')
    $(`#node-${app.node_selected_id} .open`).css('display', '')
    $(`#node-${app.node_selected_id} .box input`).addClass('simple')
    $(`#node-${app.node_selected_id} .edit`).css('display', '')
    $(`#node-${app.node_selected_id}`).css('z-index', 2)
    $(`#node-${app.node_selected_id} input`).addClass('simple')

  }

  $(`#node-${app.node_selected_id} .rollback`).css('display', 'none')
  $(`#node-${app.node_selected_id} .done`).css('display', 'none')
  $(`#node-${app.node_selected_id} .publish`).css('display', '')

  
  let node = app.editor.getNodeFromId(app.node_selected_id)
  let node_data = node.data
      node_data.position = {
        pos_x: node.pos_x,
        pos_y: node.pos_y
      }
  let node_data_index = node.data.index
  let spec = nodeSpecification(node.name)
      
  publish(node_data, spec.api, function(request, notification){
    notification.open()
    console.log(request)
    done()
  }, error)
})


// Двойной клик
$(document).on('dblclick', '.drawflow-node', function(){
  openSetting()
})

// Список компонентов
function component_list_2(name="Home"){
      $(".wrapper .col").html('')
        try{
            let names = name.includes("_") ? name.split('_').shift(): name
            console.log(names)
            const nodes = nodeSpecification()
            const module_elements = Object.values(nodes).map(node => {if (node.pages.includes(names)){return node.class}}).filter(Boolean)
            module_elements.forEach(name => {
                console.log(name)
                let data = nodes[name]
                $(".wrapper .col").append($(`
                <div class="drag-drawflow" draggable="true" ondragstart="drag(event)" data-node="${name}">
                  <i class="material-icons icon" style="font-size: 18px;padding-right: 10px;">${data.icon}</i>
                  <span>${data.description}</span>
                </div>
              `))
            });
        }
          catch(e){
            console.log(e)
        }
                    
}

// d 
function openSetting(){
  console.log(app.node_selected_id)
  
  let node = app.editor.getNodeFromId(app.node_selected_id)
  let meta = app.drawflow.meta.data
  
  if (node.typedata == 'data'){
    if (meta.dataform.type === 'custom-popup'){
        app.popup.create(meta.dataform.data(node.data)).open()
    }else if (meta.dataform.type === 'popup'){
      $(`#node-${app.node_selected_id} ${meta.dataform.data.el}`).addClass(`popup-${app.node_selected_id}`)
      app.popup.create({
        el: `.popup-${app.node_selected_id}`,
        swipeToClose: true,
        on: {
          open: function (popup) {
            // Заполняем
            popup.$el.find('input, select, textarea').forEach(el => {
              if (el.name && Object.keys(node.data).includes(el.name)){
                if (el.localName === 'input' && el.type === 'checkbox'){
                  el.checked = node.data[el.name]
                }else{
                  el.value = node.data[el.name]
                  $(el).change()
                  if (el.localName === 'select'){
                    
                  }
                }
              }
            })
            // Навбар
            popup.$el.find('.navbar').html(`
                    <div class="navbar-bg"></div>
                    <div class="navbar-inner navbar-inner-centered-title">
                        <div class="left">
                            <label class="toggle toggle-init edit color-black">
                                <input type="checkbox" checked/>
                                <span class="toggle-icon"></span>
                            </label>
                        </div>
                        <div class="title" style="left: 250.5px;">${meta.description}</div>
                        <div class="right">
                            <a href="#" style="display: none" class="link save popup-close required-validate" validate="false">Готово</a>
                            <a href="#" class="link popup-close close" >Закрыть</a>
                        </div>
                    </div>`)

            // Черновик
            console.log(node)
            let node_data_id = node.data.id || -1
            if (node_data_id != -1){
              popup.$el.find('label.edit input').forEach(el => {el.checked = false})
              popup.$el.find('li .item-input-wrap').addClass('simple')
            }else{
              console.log(popup.$el.find('.edit'))
              popup.$el.find('.edit').css('display', 'none')
            }

            // Проверка заполнености обязателных полей
            popup.$el.on('input', 'ul .validate', function(){
              validate(popup.$el)
            })

            // Изменение
            popup.$el.on('click', 'a.save', function(){
              let data = new Object()
              // input

              for (const el of popup.$el.find('input')){
                if (el.name){
                  if (el.type === 'text'){
                    data[el.name] = el.value
                  }else if (el.type === 'checkbox'){
                    data[el.name] = $(el).is(':checked')
                  }
                }
              }
              // select
              for (const el of popup.$el.find('select')){
                if (el.name){
                  data[el.name] = el.value
                }
              }
              
              app.editor.updateNodeDataFromId(app.node_selected_id, {...node.data, ...data})

              // Активация кнопок публикации изменений
              if (node.data.id != -1){
                $(`#node-${app.node_selected_id}`).css('z-index', 100)
                $(`#node-${app.node_selected_id} .done`).css('display', '')
                $(`#node-${app.node_selected_id} .edit`).css('display', 'none')
                $(`#node-${app.node_selected_id} .rollback`).css('display', '')
                $('.drawflow').append($('<div class="shroud shroud-node"></div>'))
                block(true)
            }
            app.popup.close()
            })


            // Публикация
            popup.$el.on('click', 'label.edit input', function(){
              if ($(this).is(':checked')){
                popup.$el.find('a.close').css('display', 'none')
                popup.$el.find('a.save').css('display', '')
                popup.$el.find('li .item-input-wrap').removeClass('simple')
              }else{
                popup.$el.find('a.close').css('display', '')
                popup.$el.find('a.save').css('display', 'none')
                popup.$el.find('li .item-input-wrap').addClass('simple')
              }
            })

            // 
            popup.$el.on('change', 'input[type="checkbox"]', function(){
              validate(popup.$el)
            })

            popup.$el.on('change', '.smart-select select', function(){
              validate(popup.$el)
            })

          }
        }
      }).open()
    }
  }else if (node.typedata == 'drawflow'){
    
    $('.menu .breadcrumbs .b-item').forEach(el => {
      if ( parseInt($(el).attr('index')) >= parseInt(node.level)){
        $(el).remove()
      }
    })

    let lnk = $(`
      <div class="b-item" index="${node.level}" style="display: flex;padding-left: 10px;">
          <div class="breadcrumbs-separator"></div>
            <div class="breadcrumbs-item" style="margin-left: 0px;padding-left: 10px;color:black">
              <a href="#" class="link" module="${node.name}/${node.id}">
                <span>${node.data.name}</span>
              </a>
            </div>
      </div>`)

    console.log($('.menu .breadcrumbs'))
    $('.menu .breadcrumbs').append(lnk)
    $('.menu .breadcrumbs .breadcrumbs-item[index="0"]').css('color', 'var(--f7-breadcrumbs-item-color)')
    app.editor.changeModule(`${node.name}/${node.id}`);

  } 
}

// Генерация домашний старницы

function create_home_node(eldata){
  return new Promise((resolve, reject) => {

    let connection = (nodename, parend) => { 
      let nodes = app.editor.export().drawflow['Home']
      for (const node of Object.values(nodes.data)){
          console.log(node)
          if (node.data.id == parend && node.name == nodename)
          return node.id
      }
    }

    // Параметры
    let data = (spec, data, index) => {
      console.log()
      let newdata = new Object()
      for (const key of Object.keys(spec.data)){
         if (key == 'id'){
           newdata[key] = (Object.keys(data).includes('id')) ? data.id : data.pk
         }else{
           newdata[key] = (Object.keys(data).includes(key)) ? data[key] : spec.data[key]
         }
      }
      newdata.index = index
      return newdata 
     }
  
    // модели
    for (const [index, model] of eldata.model.entries()){
      let spec = nodeSpecification('model')
      app.editor.addNode('model', spec.inputs.in,  spec.inputs.to, model.position.pos_x, model.position.pos_y, spec.class, data(spec, model, index), examinationSpecHtml(spec));
    }
  
    // connector 
    for (const [index, mail] of eldata.connector.mail.entries()){
      let spec = nodeSpecification('mailconnector')
      let connector_node = app.editor.addNode('mailconnector', spec.inputs.in,  spec.inputs.to, mail.position.pos_x, mail.position.pos_y, spec.class, data(spec, mail, index), examinationSpecHtml(spec));
      // cоеденяем с моделью
      if (mail.connection_model) {
        let model = mail.connection_model.id
        let model_node = connection('model', model)
        console.log('connector node', connector_node, 'model node', model_node)
        if (model_node){
          app.editor.addConnection(model_node, connector_node, 'output_1','input_1')
        }
      }
      
    }
    
    resolve(app.editor.export())
  })
  // Связь
  

}

// Создания связей
function nodeConnection(connect, remove=false){
  let port = (name) => { return name.split('_').pop() }
  let nodes = app.editor.export().drawflow[app.module_selected].data
  let in_node = nodes[connect.output_id]
  let to_node = nodes[connect.input_id]
  let in_spec = nodeSpecification(in_node.name)
  let to_spec = nodeSpecification(to_node.name)

  console.log(nodes, 'in', in_node, in_spec, 'to', to_node, to_spec)

  if (in_spec.inputs.connect.in[port(connect.output_class)].nodename == to_node.name){
    let connect_to_name = to_spec.inputs.connect.to[port(connect.input_class)].nodename
    if (connect_to_name === in_node.name){
      let api = to_spec.api
      let data = to_node.data
      let connect_filed_id = (remove) ? null : String(in_node.data.id)
          data[in_spec.inputs.connect.in[port(connect.output_class)].field] = connect_filed_id
      //
      app.editor.updateNodeDataFromId(connect.input_id, data)
      // 
      $('.drawflow').append($('<div class="shroud shroud-node"></div>'))
      block(true)
      $(`#node-${connect.input_id}`).css('z-index', 100)
      $(`#node-${connect.input_id} .open`).css('display', 'none')
      $(`#node-${connect.input_id} .done`).css('display', '')
      $(`#node-${connect.input_id} .edit`).css('display', 'none')
      $(`#node-${connect.input_id} .rollback`).css('display', '')
    }
  }
}