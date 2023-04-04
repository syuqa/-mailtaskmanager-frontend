
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
  let id = data.id
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
        CataType: 'json',
        ContentType: 'application/json',
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
  switch (node.name) {
    case 'mailconnector':
      publish(node_data, spec.api, function(request, notification){
        notification.open()
        console.log(request)
        done()
      }, error)
  }
})


// Двойной клик
$(document).on('dblclick', '.drawflow-node', function(){
  let node = app.editor.getNodeFromId(app.node_selected_id)
  openSetting(node)
})

// Список компонентов
function component_list(name="Home"){
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
function openSetting(node){
  let spec = nodeSpecification(node.name)
  if (spec.type == 'data'){
    if (spec.dataform.type === 'custom-popup'){
        app.popup.create(spec.dataform.data(node.data)).open()
    }else if (spec.dataform.type === 'popup'){
      console.log('open popup')
      app.popup.create({
        el: spec.dataform.data.el,
        swipeToClose: true,
        on: spec.dataform.data.on
      }).open()
    }
  }else if (spec.type == 'drawflow'){
    if ($(`#node-${app.node_selected_id} .open`).css('display') != 'none'){
      if ($(`.wrapper .menu li[module="${node.data.id}"]`).length == 0){
        app.editor.addModule(`model_${node.data.id}`);
          $('.wrapper .menu ul').append(`
            <li module="${node.data.id}" onclick="app.editor.changeModule('model_${node.data.id}'); changeModule(event);"><i class="material-icons icon" style="font-size: 18px;">${spec.icon}</i> ${node.data.name}</li>
          `)
        }
        $(`li[module="${node.data.id}"]`).click()
    }
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
      app.editor.addNode('model', spec.inputs.in,  spec.inputs.to, model.position.pos_x, model.position.pos_y, spec.class, data(spec, model, index), spec.html );
    }
  
    // connector 
    for (const [index, mail] of eldata.connector.mail.entries()){
      let spec = nodeSpecification('mailconnector')
      let connector_node = app.editor.addNode('mailconnector', spec.inputs.in,  spec.inputs.to, mail.position.pos_x, mail.position.pos_y, spec.class, data(spec, mail, index), spec.html );
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