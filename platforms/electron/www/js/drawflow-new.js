function app_api(path){
    return new URL(path, 'https://syu-developer-02.ru/').href 
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
                <ul>
                  <li module="" onclick="app.editor.changeModule('index'); changeModule(event);" class="selected"><i class="material-icons icon" style="font-size: 18px;">home</i> Модели</li>
                </ul>
              </div>
              <div id="drawflow" ondrop="drop(event)" ondragover="allowDrop(event)">
                <div class="btn-export"> <label class="toggle toggle-init edit color-black">
                    <input type="checkbox" checked/>
                    <span class="toggle-icon"></span>
                </label>
</div>
                <div class="btn-clear" onclick="app.editor.clearModuleSelected()">Clear</div>
                <!--div class="btn-lock">
                  <i id="lock" class="fas fa-lock" onclick="app.editor.editor_mode='fixed'; changeMode('lock');"></i>
                  <i id="unlock" class="fas fa-lock-open" onclick="app.editor.editor_mode='edit'; changeMode('unlock');" style="display:none;"></i>
                </div -->
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
            app.dialog.preloader('Загрузка');
            //
            if (localStorage.getItem('api-token') != undefined){
                app.request.setup({
                  headers: {
                    "Authorization": "Token " + localStorage.getItem('api-token')
                  }
                  })
              }
            //
            app.request.get(app_api('/api/drawflow'), 
                function(request){
                    app.dialog.close()
                    app.module_selected = 'Home'
                    app.metamodel = request.metamodel
                    app.data = request.data
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
                    const dataToImport = {
                        "drawflow": {
                            "Home": {
                                "data": {
                                    "1": {
                                        "id": 1,
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
                    app.editor.import(dataToImport)

                          // Events!
                          app.editor.on('nodeCreated', function(id) {
                            app.node_selected_id = id
                            console.log("Node created " + id);
                            let node = app.editor.getNodeFromId(id)
                            app.node_selected = node
                            
                              console.log(node.name)
                              switch(node.name){
                                case 'mailconnector' : 
                                    email_connector_popup()
                                    break;
                              }
              
                          })
                      
                          app.editor.on('nodeRemoved', function(id) {
                            console.log("Node removed " + id);
                          })
                      
                          app.editor.on('nodeSelected', function(id) {
                            console.log("Node selected " + id);
              
                            // Подсказки
                              $(`#node-${id} .tooltip-init`).forEach(element => {
                                  let text = $(element).attr('data-tooltip')
                                  app.tooltip.create({
                                      targetEl: '.tooltip-init',
                                      text: text   
                                  });
                              });
                              
                          })
                      
                          app.editor.on('moduleCreated', function(name) {
                            console.log("Module Created " + name);
                          })
                      
                          app.editor.on('moduleChanged', function(name) {
                            app.module_selected = name
                            $(".wrapper .col").html('')
                            try{
                                let names = name.includes("_") ? name.split('_').shift(): name
                                const node = app.metamodel
                                const module_elements = Object.values(node).map(node => {if (node.pages.includes(names)){return node.class}})

                                module_elements.forEach(name => {
                                    let data = node[name]
                                    $(".wrapper .col").append($(`
                                    <div class="drag-drawflow" draggable="true" ondragstart="drag(event)" data-node="${name}">
                                      <i class="material-icons icon" style="font-size: 18px;padding-right: 10px;">${data.icon}</i>
                                      <span>${data.description}</span>
                                    </div>
                                  `))
                                });
                            }
                              catch(e){
                                console.error(e)
                            }
                            console.log("Module Changed " + name);
                          })
                      
                          app.editor.on('connectionCreated', function(connection) {
                            console.log('Connection created');
                            app.connect_node = { action: 'add', data: connection }  
                            console.log(connection);
                            nodeConnection(connection)
                          })
                      
                          app.editor.on('connectionRemoved', function(connection) {
                            console.log('Connection removed');
                            console.log(connection);
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
                          component_list()
                },  
                
                function(request){
                    console.log(request)
                    app.dialog.close()
                    navigate(`/not-connection/${request.status}/${request.statusText}`)
                }, 'json'
            )
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


var mainView = app.views.create('#view_drawflow', {
	url: '/drawflow/'
});

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
