const { resolve } = require('path');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


function drawflow_request(path, resolve){

  api = (path) => new URL(path, 'https://syu-developer-02.ru/api/drawflow/').href 
  let reject = (resp) => {
    console.log(resp)
  }

  if (localStorage.getItem('api-token') != undefined){
    app.request.setup({
      headers: {
        "Authorization": "Token " + localStorage.getItem('api-token')
      }
      })
  }

  app.request.get(api(path), resolve, reject, 'json')

}
// Закодирование текста
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

// Раскодирование текста
function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}


// Список компонентов
function component_list(name="Home", metamodel=app.drawflow.meta){
  $(".wrapper .col").html('')
    try{
        let names = name.includes("/") ? name.split('/').shift(): name
        console.log(names)
        //
        const module_elements = (meta) => {
          console.log(meta)
          let list = new Object()
          for (const [key, value] of Object.entries(meta)){
            if (value.scheme == names) {
              if (! list[value.group]){
                  list[value.group] = {}
              }
              list[value.group][value.name] = {icon: value.icon, title: value.description}

            }
          }
          return list
        }
        //
        console.log(module_elements(metamodel))
        //const module_elements = Object.values(nodes).map(node => {if (node.pages.includes(names)){return node.class}}).filter(Boolean)
        for (const [group, node] of Object.entries(module_elements(metamodel))){
            $(".wrapper .col").append(
              $(`<div class="block-title node-group">
                  <span class="material-icons icon node-group-icon">sort</span>
                  <font class="node-group-title" ">Основное компоненты</font>
                </div>`))
            let list = $(`<div class="list"><ul></ul></div>`)
            for (const [name, data] of Object.entries(node)){
              list.find('ul').append(`
              <li>
                <div class="drag-drawflow item-content" draggable="true" ondragstart="drag(event)" data-node="${name}" style="line-height: 1;border-bottom: none;padding-left: 0px;">
                  <div class="item-inner">
                    <div class="item-media" style="padding-right: 15px;padding-left: 15px;"><i class="material-icons icon" style="font-size: 20px">${data.icon}</i></div>
                    <div class="item-title" style="width: 100%;">${data.title}</div>
                  </div>
                </div>
              </li>
              `)
            }
            $(".wrapper .col").append(list)
        }
    }
      catch(e){
        console.log(e)
    }
}

// Импорт схем
function import_data(f){
  // Проверка актуальности модели данных
  drawflow_request('meta/hash', function(request){
    app.drawflow.meta_hash = request.hash
    // Загрузка модели данных
    localMetaModel(request.hash, function(meta){
      console.log(meta)
      app.drawflow.meta = meta
      // Загрузка данных
      drawflow_request('data', function(ndata){
          app.drawflow.data = ndata
          //  
          const chashsum = (text) => {
            return crypto.createHash('sha1').update(text).digest('hex')
          }

          // данные ноды
          const node_data = (path, _data) => {
            let data = _data
            for (const name of path.split('.')){
              console.log('path.name', name)
              console.log(typeof data, '=>', Object.keys(data), 'in', name)
              if (typeof data === 'object' && Object.keys(data).includes(name)){
                data = data[name]
                console.log('new data', data)
              }else{
                return new Array()
              }
            }
            return data
          }

          // Проверка параметров на ключи с пробелами и на латинице
          function check_datakeys(_obj){
            parse = (_data) => {
              let replase = {"+": "_0", "/":"_1", "=":"_2"}
              let data = _data
              for (const [key, val] of Object.entries(replase)){
                data = data.split(key).join(val)
              }
              return data
            }

            let obj = _obj
            for (const [_key, _value] of Object.entries(obj)){
                let key = _key
                let value = _value
                let regexp = /[а-яё]/i;
                if (key.split(' ').length > 1 || regexp.test(key)){
                    console.log('encode', key)
                   key = parse(`bs64${utf8_to_b64(key)}`)
                   delete obj[_key]
                }
                if (typeof value === 'object' && Object.keys(value).length > 0){
                  value = check_datakeys(value)
                }
                obj[key] = value
            }
            return obj
        }
          
          // Проверка наличия шапки в html шаблоне
          const capnode = (metadata) => {
            let html = $(metadata.html)
            let title = html.find('.title-box')
            console.log('CHECK HTML MODE:', metadata.name, '=>', html, title, title.children().length)
            if (title.children().length == 0){
              title.append(
                $(`<div style="display: flex;">
                    <i class="title-icon material-icons">${metadata.icon}</i>
                    <font style="width: 100%;padding-right: 30px;">${metadata.description}</font>
                    <i class="material-icons open tooltip-init" style="float: right;font-size: 18px;padding-top: 17px;margin-right: 10px;color:#80808066">open_in_new</i>
                </div>`)
             )
            }
            return html.html()
          }

          // Входящие коннеты
          const inputs = (metadata, nodedata) => {
            console.log(`--- inputs connect <${metadata.name}> ----`)
            let connect = new Object()
            for (const [input, inode] of Object.entries(metadata.connect.input)){
              console.log('input:', input, 'inode', inode)
              if (!connect[input]){
                connect[input] = {connections: new Array()}
              }
              let field_data = nodedata[inode.field]
              if (field_data){
                console.log('hash data:', inode.name, 'and', field_data)
                let connect_id = chashsum(`${inode.name}${field_data}`)
                console.log('connect_id', connect_id)
                // find output
                let out_meta = app.drawflow.meta
                console.log('input node name:', inode.node, 'outmeta:', out_meta[inode.node])
                if (out_meta[inode.node]){
                  for (const [output, onode] of Object.entries(out_meta[inode.node].connect.output)){
                    console.log(onode.node, '==', metadata.name)
                    if (onode.node == metadata.name){
                      console.log('list', connect)
                      connect[input].connections.push({input: output, node: connect_id})
                    }
                  }
                }
              } 
            }
            console.log('------------- end -----------')
            return connect
          }

          // Исходящие коннеткы
          const outputs = (metadata, nodedata) => {
            console.log(`--- outputs connect <${metadata.name}> ----`)
            let connect = new Object()
            for (const [output, onode] of Object.entries(metadata.connect.output)){
              console.log('output:', output, 'inode', onode)
              // find intput
              let in_meta = app.drawflow.meta
              console.log('output node name:', output.node, 'inmeta:', out_meta[in_meta.node])
              if (out_meta[onode.node]){
                for (const [intput, inode] of Object.entries(in_meta[onode.node].connect.output)){
                  console.log(inode.node, '==', metadata.name)
                  if (inode.node == metadata.name){
                    let out_path_data = out_meta[onode.node].data
                    console.log('out_path_data', out_path_data)
                  }
                }
              }
            }
            console.log('------------- end -----------')
          }

          // Параметры ноды
          const pardata = (metadata, nodedata, level) =>  Object({
                "id": (nodedata.id) ? chashsum(`${metadata.name}${nodedata.id}`): chashsum(`${metadata.name}${nodedata.pk}`),
                "typedata": metadata.types,
                "level": level,
                "name": metadata.name,
                "description": metadata.description,
                "class": metadata.classes,
                "typenode": false,
                "html": capnode(metadata),
                "data": check_datakeys(nodedata),
                "pos_x": nodedata.position.pos_x || 0,
                "pos_y": nodedata.position.pos_y || 0,
                "inputs": inputs(metadata, nodedata),
                "outputs": {}
              })
          
          // Создаем шаблон

          function create_node(scheme='Home', parent=undefined, _drawflow=new Object(), _nodedata=ndata, level=0){
            console.log('scheme:', scheme, 'parent:', parent, 'data:', _drawflow)
            let drawflow = _drawflow 
            // перебираем список метадананными
            for (const [name, metadata] of Object.entries(meta)){
              if (scheme == metadata.scheme){
                // Перебераем список с данными
                let datapath = metadata.data
                try {
                  if (datapath){
                    let _node_data = node_data(metadata.data, _nodedata)
                    console.log(_node_data)
                    for (const nodedata of _node_data){

                      // создаем схему если не существует
                      let scheme = (parent) ? `${metadata.scheme}/${parent}`: metadata.scheme
                      
                      if (!drawflow[scheme]){
                        drawflow[scheme] = new Object({data: new Object()})
                      }

                      //
                      let draft = pardata(metadata, nodedata, level)
                      drawflow[scheme]['data'][draft.id] = draft
                      
                      console.log('type', metadata.types, metadata, 'nodedata', nodedata, 'draft', draft)
                      //
                      if (metadata.types == 'drawflow'){
                        console.log('Drawflow')
                        
                        drawflow = create_node(metadata.name, draft.id, drawflow, nodedata, level + 1)
                      }
                    }
                  }
                }catch(e){
                  console.log(e)
                }
              }
              
            }
            return drawflow
          }

          
          let drawflow = create_node()
          f({drawflow: drawflow})
      })
    })
  })
}

var device = Framework7.getDevice();
var app = new Framework7({
  //name: 'My App', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element
  routes: [
    {
        path: '/not-connection/:code/:status',
        content: `
        <div class="page">
            <div class="page-content parent">
                <center class="child">
                    <img src="img/mm_.png" style="width: 120px;">
                    <p style="opacity: 0.4;">Ошибка получения данных от сервера</p>
                    <p><a href="/drawflow/">Повторить</a></p>
                    <div class="error"></div>
                </center>
            </div>
        </div>
        `,
        on: {
            pageInit: function(event, page){
                let code = page.route.params.code
                let status = page.route.params.status
                page.$el.find('.error').html(`
                <p style="margin-bottom: 12px;border-style: groove;border-width: 0px 0px 1px 0px;padding-bottom: 0;color: brown;"></p>
                <p style="margin-top: 0px;color: #0000007a;">${status}</p>`)
            }
        }
    },
    {
    path: '/drawflow/',
    content: `
        <div class="page">
            <div class="page-content parent" style="position: static;">
            <div class="draft" style="dispaly:none"></div>
            <div class="wrapper" style="height: 100%;">
            <div class="col"></div>
            <div class="col-right">
                <div class="menu">
                    <div class="breadcrumbs">
                      <div class="breadcrumbs-item" index="0" style="color: black;"><a href="#" module="Home" class="link"><span>Схемы</span></a></div>
                    </div>
                </div>
              <div id="drawflow" ondrop="drop(event)" ondragover="allowDrop(event)">
                <div class="button-draft">
                    <font style="color: black;padding-right: 10px;font-weight: 100;" class="">черновик</font>
                    <label class="toggle ondraft toggle-init edit color-green">
                        <input type="checkbox">
                        <span class="toggle-icon"></span>
                    </label>
                  </div>
                  <div class="button-publish link">Опубликовать</div>
                <div class="bar-zoom">
                  <i class="fas fa-search-minus" onclick="app.editor.zoom_out()"></i>
                  <i class="fas fa-search" onclick="app.editor.zoom_reset()"></i>
                  <i class="fas fa-search-plus" onclick="app.editor.zoom_in()"></i>
                </div>
              </div>
            </div>
          </div>
            </div>
        </div>`,
    on: {
        pageInit: function (event, page) {

            // Прилодер
            app.dialog.preloader('Загрузка');
            if (localStorage.getItem('api-token') != undefined){
                app.request.setup({
                  headers: {
                    "Authorization": "Token " + localStorage.getItem('api-token')
                  }
                  })
              }
            // Окрыть модуль
            page.$el.on('click', '.breadcrumbs-item a', function(){
              let module = $(this).attr('module')
              page.$el.find('.breadcrumbs-item').forEach(el => {
                let _module = $(el).find('a').attr('module')
                if (_module === module){
                  $(el).css('color', 'black')
                }else{
                  $(el).css('color', 'var(--f7-breadcrumbs-item-color)')
                }
              })
              app.editor.changeModule(module);
            })
            // Режим черновика
            app.toggle.create({
              el: '.ondraft',
              on: {
                change: function (el) {
                  if (! el.checked){
                    page.$el.find('.button-publish').css('display', 'none')
                    app.editor.editor_mode='fixed';
                  }else{
                    page.$el.find('.button-publish').css('display', 'block')
                    app.editor.editor_mode='edit';
                  }
                }
              }
            })

            // Иницилизация редактора схем
            app.dialog.close()
            app.module_selected = 'Home'
            app.editor = new Drawflow(document.getElementById("drawflow"))
            app.editor.reroute = true
            app.editor.reroute_fix_curvature = true
            app.editor.force_first_input = false
            /*
              app.editor.createCurvature = function(start_pos_x, start_pos_y, end_pos_x, end_pos_y, curvature_value, type) {
                var center_x = ((end_pos_x - start_pos_x)/2)+start_pos_x;
                return ' M ' + start_pos_x + ' ' + start_pos_y + ' L '+ center_x +' ' +  start_pos_y  + ' L ' + center_x + ' ' +  end_pos_y  + ' L ' + end_pos_x + ' ' + end_pos_y;
              }*/
            app.editor.start()
            /*
            const dataToImport = {
                "drawflow": {
                    "Home": {
                        "data": {
                            "1e7c876d01bfe8d50f1ad7f88cdfda5ae0a23a58": {
                                "id": "1e7c876d01bfe8d50f1ad7f88cdfda5ae0a23a58",
                                "name": "welcome",
                                "data": {},
                                "class": "welcome",
                                "html": `
                                          <div>
                                              <div class="title-box">
                                                  <div style="display: flex;">
                                                  <i class="title-icon material-icons">tips_and_updates</i>
                                                  <font style="width: 100%;">Информация</font>
                                                  </div>
                                              </div>
                                              <div class="box">
                                                  <div class="row">
                                                          <p><b><u>Горячие клавиши:</u></b></p>
                                                  </div>
                                                  <div class="row">
                                                      💠 Щелкните левой кнопкой мыши, чтобы Передвинуть<br>
                                                      ❌ Щелкните правой, что бы удалить блок<br>
                                                      🔍 Ctrl + Колесо, что бы увеличить<br>
                                                  <div>
                                              </div>
                                          </div>
                                `,
                                "typenode": false,
                                "inputs": {},
                                "outputs": {},
                                "pos_x": 20,
                                "pos_y": 15
                            }
                        }
                    }
                }
            }
            */
            // Импорт
            import_data(function(data){
              console.log(data)
              component_list()
              app.editor.import(data)
            })
                  // Events!
                  app.editor.on('nodeCreated', function(id) {
                    app.node_selected_id = id
                    console.log("Node created " + id);
                    let node = app.editor.getNodeFromId(id)
                    app.node_selected = node
                  })
              
                  app.editor.on('nodeRemoved', function(id) {
                    console.log("Node removed " + id);
                  })
              
                  app.editor.on('nodeSelected', function(id) {
                    console.log("Node selected " + id);
                    app.node_selected = app.editor.getNodeFromId(id)
                    app.node_selected_id = id
                    
                    //Отмена
                    $(`#node-${id} .rollback`).on('click', function(){
                      let node_data_id = app.node_selected.data.id || -1
                      if (node_data_id == -1) {
                          app.editor.removeNodeId(`node-${id}`);
                      }
                      if (app.connect_node){
                        let action = app.connect_node.action
                        let connect = app.connect_node.data
                        if (action == 'add'){
                          app.editor.removeSingleConnection(connect.output_id, connect.input_id, connect.output_class, connect.input_class)
                        }else{
                          app.editor.addConnection(connect.output_id, connect.input_id, 'connect.output_class','connect.input_class')
                        }
                      }
                    })
      
                    // Подсказки
                      $(`#node-${id} .tooltip-init`).forEach(element => {
                          let text = $(element).attr('data-tooltip')
                          app.tooltip.create({
                              targetEl: element,
                              text: text   
                          });
                      });
                      
                  })
              
                  app.editor.on('moduleCreated', function(name) {
                    console.log("Module Created " + name);
                  })
              
                  app.editor.on('moduleChanged', function(name) {
                    app.module_selected = name
                    component_list(name)
                    console.log("Module Changed " + name);
                  })
              
                  app.editor.on('connectionCreated', function(connection) {
                    console.log('Connection created');
                    app.connect_node = { action: 'add', data: connection }  
                    console.log(connection);
                    //nodeConnection(connection)
                  })
              
                  app.editor.on('connectionRemoved', function(connection) {
                    console.log('Connection removed');
                    app.connect_node = { action: 'remove', data: connection }  
                    console.log(connection);
                    nodeConnection(connection, true)
                  })
                  /*
                      app.editor.on('mouseMove', function(position) {
                        console.log('Position mouse x:' + position.x + ' y:'+ position.y);
                      })
                  */
                  app.editor.on('nodeMoved', function(id) {
                    console.log("Node moved " + id);
                  })
              
                  app.editor.on('zoom', function(zoom) {
                    console.log('Zoom level ' + zoom);
                  })
              
                  app.editor.on('translate', function(position) {
                    console.log('Translate x:' + position.x + ' y:'+ position.y);
                  })
              
                  app.editor.on('addReroute', function(id) {
                    console.log("Reroute added " + id);
                  })
              
                  app.editor.on('removeReroute', function(id) {
                    console.log("Reroute removed " + id);
                  })
                  /* DRAG EVENT */
              
                  /* Mouse and Touch Actions */
              
                  var elements = document.getElementsByClassName('drag-drawflow');
                  for (var i = 0; i < elements.length; i++) {
                    elements[i].addEventListener('touchend', drop, false);
                    elements[i].addEventListener('touchmove', positionMobile, false);
                    elements[i].addEventListener('touchstart', drag, false );
                  }
              
                  var mobile_item_selec = '';
                  var mobile_last_move = null;
                  var transform = '';
                
        }
    }
  }],
  id: 'io.cordova.taskmanager', // App bundle ID
  version: '1.1.0',
  // App routes
  dialog: {
    // set default title for all dialog shortcuts
    // title: 'My App',
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

app.drawflow = new Object()

var mainView = app.views.create('#view_drawflow', {
	url: '/drawflow/'
});

// загрузка мета модели
function localMetaModel(hash, f){
  const mpath = path.join(path.resolve(), 'drawflow_meta_model.json')
  function save(version){
      fs.writeFile(mpath, JSON.stringify(version, 'utf8', 4), function(error){
        if(error){console.log(error)}})
    }
  const chashsum = (text) => {
      return crypto.createHash('sha1').update(text).digest('hex')
  }
  try {
      let metadata = JSON.parse(fs.readFileSync(mpath, 'utf8'))
      if (hash === metadata.hash){
          let data = metadata.data
          f(data)
      }else{
        drawflow_request('meta', function(request){
          save(request)
          f(request.data)
        })
      }  
  }catch(err){
    drawflow_request('meta', function(request){
      save(request)
      f(request.data)
    })
  }
}


function addNodeToDrawFlow(name, pos_x, pos_y) {
    
    if(app.editor.editor_mode === 'fixed') {
      return false;
    }

    pos_x = pos_x * ( app.editor.precanvas.clientWidth / (app.editor.precanvas.clientWidth * app.editor.zoom)) - (app.editor.precanvas.getBoundingClientRect().x * ( app.editor.precanvas.clientWidth / (app.editor.precanvas.clientWidth * app.editor.zoom)));
    pos_y = pos_y * ( app.editor.precanvas.clientHeight / (app.editor.precanvas.clientHeight * app.editor.zoom)) - (app.editor.precanvas.getBoundingClientRect().y * ( app.editor.precanvas.clientHeight / (app.editor.precanvas.clientHeight * app.editor.zoom)));

    let node = nodeSpecification(name)
    if (node){
        app.editor.addNode(name, node.inputs.in,  node.inputs.to, pos_x, pos_y, node.class, node.data, node.html );
    }

}

function positionMobile(ev) {
    mobile_last_move = ev;
  }

  function allowDrop(ev) {
     ev.preventDefault();
   }

   function drag(ev) {
     if (ev.type === "touchstart") {
       mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
     } else {
     ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
     }
   }

   function drop(ev) {
     if (ev.type === "touchend") {
       var parentdrawflow = document.elementFromPoint( mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
       if(parentdrawflow != null) {
         addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
       }
       mobile_item_selec = '';
     } else {
       ev.preventDefault();
       var data = ev.dataTransfer.getData("node");
       addNodeToDrawFlow(data, ev.clientX, ev.clientY);
     }

   }

   

 //var transform = '';

 function showpopup(e) {
   e.target.closest(".drawflow-node").style.zIndex = "9999";
   e.target.children[0].style.display = "block";
   //document.getElementById("modalfix").style.display = "block";

   //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
   transform = app.editor.precanvas.style.transform;
   app.editor.precanvas.style.transform = '';
   app.editor.precanvas.style.left = app.editor.canvas_x +'px';
   app.editor.precanvas.style.top = app.editor.canvas_y +'px';
   console.log(transform);

   //e.target.children[0].style.top  =  -app.editor.canvas_y - app.editor.container.offsetTop +'px';
   //e.target.children[0].style.left  =  -app.editor.canvas_x  - app.editor.container.offsetLeft +'px';
   app.editor.app.editor_mode = "fixed";

 }

  function closemodal(e) {
    e.target.closest(".drawflow-node").style.zIndex = "2";
    e.target.parentElement.parentElement.style.display  ="none";
    //document.getElementById("modalfix").style.display = "none";
    app.editor.precanvas.style.transform = transform;
      app.editor.precanvas.style.left = '0px';
      app.editor.precanvas.style.top = '0px';
     app.editor.app.editor_mode = "edit";
  }

   function changeModule(event) {
     var all = document.querySelectorAll(".menu ul li");
       for (var i = 0; i < all.length; i++) {
         all[i].classList.remove('selected');
       }
     event.target.classList.add('selected');
   }

   function changeMode(option) {

   //console.log(lock.id);
     if(option == 'lock') {
       lock.style.display = 'none';
       unlock.style.display = 'block';
     } else {
       lock.style.display = 'block';
       unlock.style.display = 'none';
     }

   }
