

function nodeSpecification(nodename=undefined){
    const spec = {
        model: {
            class: 'model',
            api: 'api/data/connection/mail/connector',
            description: 'Модель',
            icon: 'grid_view',
            pages: ['Home'],
            type: 'drawflow',
            inputs: {
                in: 0,
                to: 1,
                connect: { 
                    in: {
                        1: {nodename: 'mailconnector', field: 'connection_model'}
                    },
                    to: {

                    }
                }
            },
        data: {
            "id": -1, 
            "name": '', 
            "description": '', 
            "rule": new Object(),
            "attributes": new Object(),
            "visible": false,
            "is_owner": true
        },
        html: `
        <div>
            <div class="title-box">
                <div style="display: flex;">
                    <i class="title-icon material-icons">grid_view</i>
                    <font style="width: 100%;">Модель</font>
                    <div class="preloader publish color-blue" style="display:none">
                        <span class="preloader-inner" style="width: 20px;height: 20px;top: 15px;left: -10px;">
                            <span class="preloader-inner-circle"></span>
                        </span>
                    </div>
                    <a class="material-icons rollback link" style="float: right;padding-top: 12px;margin-right: 10px;color: red;display: none">close</a>
                    <a class="material-icons done create-model link" style="float: right;padding-top: 12px;margin-right: 10px;color: green;display: none">done</a>
                    <i class="material-icons open tooltip-init" data-tooltip="Группа: двойнок щелчек по блоку." style="float: right;font-size: 18px;padding-top: 17px;margin-right: 10px;color:#80808066">open_in_new</i>
                </div>
            </div>
            <div class="box list" style="padding: 0;margin: 0;background: none;">
                    <ul style="background: none;">
                        <li style="display: none">
                            <input class="" style="border: none" value="-1" type="number" placeholder="Имя модели" df-id="">
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-media"><i class="icon material-icons">lightbulb_outline</i></div>
                                <div class="item-inner">
                                    <div class="item-after"><input class="simple" style="border: none" type="text" placeholder="Имя модели" df-name=""></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-media"><i class="icon material-icons">notes</i></div>
                                <div class="item-inner">
                                    <div class="item-after"><input class="simple" style="border: none" type="text" placeholder="Краткое описание" df-description=""></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
          </div>
          `
        },
        mailconnector: {
            class: 'mailconnector',
            api: 'api/data/connection/mail/connector',
            description: 'Почтовый сервис',
            icon: 'alternate_email',
            pages: ['Home'],
            type: 'data',
            inputs: {
                in: 1,
                to: 0,
                connect: {
                    in: {
                    },
                    to: {
                        1: {nodename: 'model', field: 'id'}
                    }
                }
            },
            data: {
                "id": -1,
                "host": "",
                "port": 443,
                "password": "",
                "username": "",
                "tls": true,
                "smtp": false,
                "smtphost": "",
                "smtport": 443,
                "smtpssl": false,
                "connection_model": -1,
                "load_interval": 20,
                "path": "INBOX"
            },
            html: `
            <div>
                <div class="title-box">
                    <div style="display: flex;">
                        <i class="title-icon material-icons">alternate_email</i>
                        <font style="width: 100%;">Почтовый сервис</font>
                        <div class="preloader publish color-blue" style="display:none">
                            <span class="preloader-inner" style="width: 20px;height: 20px;top: 15px;left: -10px;">
                                <span class="preloader-inner-circle"></span>
                            </span>
                        </div>
                        <a class="material-icons rollback link" connection="false" style="float: right;padding-top: 12px;margin-right: 10px;color: red;display: none">close</a>
                        <a class="material-icons done create-model link" style="float: right;padding-top: 12px;margin-right: 10px;color: green;display: none">done</a>
                        <i class="material-icons edit tooltip-init" data-tooltip="Набор параметров.Двойной клик, отрывает параметры" style="float: right;padding-top: 12px;margin-right: 10px;color:#80808066">edit_note</i>
                    </div>
                </div>
    
                <div class="box node-email-connector" style="padding: 0px;">
                    <div class="list" style="width: auto;margin-top: 0px;margin-bottom: 0px;">
                        <ul style="background: none;">
                            <li>
                                <div class="item-content">
                                    <div class="item-media"><i class="icon material-icons">mail_outline</i></div>
                                    <div class="item-inner">
                                        <div class="item-after simple"><input style="border: none;width: 260px;" type="text" placeholder="Почтовый сервер" df-host /></div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="item-content">
                                    <div class="item-media"><i class="icon material-icons">alternate_email</i></div>
                                    <div class="item-inner">
                                        <div class="item-after simple"><input style="border: none;width: 260px;" type="text" placeholder="exemple@yandex.ru" df-username  /></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            `,
            dataform: {
                type: "custom-popup",
                data: function(email){
                    return {
                         content: `
                           <div class="popup">
                             <div class="view view-popup">
                   
                               <!-- titlebar -->
                               <div class="navbar queue-popup">
                                   <div class="navbar-bg"></div>
                                   <div class="navbar-inner navbar-inner-centered-title">
                                       <div class="left">
                                           <label class="toggle toggle-init edit color-black">
                                               <input type="checkbox" checked/>
                                               <span class="toggle-icon"></span>
                                           </label>
                                       </div>
                                       <div class="title" style="left: 250.5px;">Коннетор</div>
                                       <div class="right">
                                           <a href="#" class="link save popup-close required-validate" validate="false">Готово</a>
                                           <a href="#" style="display: none" class="link popup-close close" >Закрыть</a>
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
         
                             let node = app.editor.getNodeFromId(app.node_selected_id)
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
                   
                             // Черновик
                             console.log(node)
                             if (node.data.id != -1){
                               popup.$el.find('label.edit').click()
                             }else{
                               popup.$el.find('label.edit').css('display', 'none')
                             }
                   
                             // Проверка заполнености обязателных полей
                             popup.$el.on('input', 'ul input.validate', function(){
                               validate(popup.$el)
                             })
                             
                             // Cохренение
                             popup.$el.on('click', 'a.save', function(){
                               const data = {
                                 id: node.data.id,
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
                               app.editor.updateNodeDataFromId(app.node_selected_id, data)
                               // toast_done()
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
                           },
                           opened: function (popup) {
                             console.log('Popup opened');
                           },
                         }
                       }
                }
            }
        },
        attributes: {
            class: 'attributes',
            api: 'api/data/connection/mail/model/attrebutes',
            type: 'data',
            description: 'Атрибут',
            icon: 'data_object',
            pages: ['model'],
            inputs: {
                in: 0,
                to: 1,
                connect: { 
                    in: {
                    },
                    to: {

                    }
                }
            },
            data: {
                id: -1,
                Attribute: "",
                connection_model: "", 
                description: "",
                parser: "",
                search_in: "Apple",
                visible: ""
            }, 
            html: `
            <div>
                <div class="title-box">
                    <div style="display: flex;">
                        <i class="title-icon material-icons">data_object</i>
                        <font style="width: 100%;">Атрибут</font>
                        <div class="preloader publish color-blue" style="display:none">
                            <span class="preloader-inner" style="width: 20px;height: 20px;top: 15px;left: -10px;">
                                <span class="preloader-inner-circle"></span>
                            </span>
                        </div>
                        <a class="material-icons rollback link" style="float: right;padding-top: 12px;margin-right: 10px;color: red;display: none">close</a>
                        <a class="material-icons done create-model link" style="float: right;padding-top: 12px;margin-right: 10px;color: green;display: none">done</a>
                        <i class="material-icons edit tooltip-init" data-tooltip="Набор параметров.Двойной клик, отрывает параметры" style="float: right;padding-top: 12px;margin-right: 10px;color:#80808066">edit_note</i>
                    </div>
                </div>
                <div class="box list" style="padding: 0;margin: 0;background: none;">
                        <ul style="background: none;">
                            <li style="width: auto;">
                                <div class="item-content">
                                    <div class="item-inner" style="min-width: 200px;">
                                        <div class="item-title simple"><input style="border: none" type="text" placeholder="Новый атрибут" df-description></div>
                                        <div class="item-after "><input style="border: none;text-align: right;" type="text" placeholder="simple" df-description></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        
                        <div class="popup attr-popup model" style="display:none;">
                        
                            <div class="view">
                                <div class="page">
                                    <div class="navbar">
                                        <div class="navbar-bg"></div>
                                        <div class="navbar-inner">
                                        <div class="title">Атрибут</div>
                                        <div class="right">
                                            <!-- Link to close popup -->
                                            <a class="link popup-close in-popup-dataset">Готово</a>
                                        </div>
                                        </div>
                                    </div>

                                    <div class="page-content">
                                        <div class="list inline-labels no-hairlines-md">
                                            <ul>
                                                <li class="item-content item-input">
                                                    <div class="item-inner">
                                                        <div class="item-title item-label">Системное имя</div>
                                                        <div class="item-input-wrap">
                                                            <input type="text" placeholder="simple" name="Attribute"/>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="item-content item-input">
                                                    <div class="item-inner">
                                                        <div class="item-title item-label">Описание</div>
                                                        <div class="item-input-wrap">
                                                            <input type="text" placeholder="Новый атрибут" name="description"/>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="item-content item-input">
                                                    <div class="item-inner">
                                                        <div class="item-title item-label">Отображаемый</div>
                                                        <div class="item-input-wrap">
                                                            <label class="toggle toggle-init color-green " style="float: right;">
                                                                <input name="visible" type="checkbox">
                                                                <span class="toggle-icon"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <ul style="margin-top: 38px;">
                                                <li>
                                                    <a class="item-link smart-select smart-select-init" data-open-in="popup">
                                                        <select name="search_in">
                                                            <option value="apple">Apple</option>
                                                            <option value="pineapple">Pineapple</option>
                                                            <option value="pear">Pear</option>
                                                            <option value="orange">Orange</option>
                                                            <option value="melon">Melon</option>
                                                            <option value="peach">Peach</option>
                                                            <option value="banana">Banana</option>
                                                        </select>
                                                        <div class="item-content">
                                                            <div class="item-inner">
                                                                <div class="item-title">Искать в</div>
                                                                <div class="item-after"></div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li class="item-content item-input">
                                                    <div class="item-inner">
                                                        <div class="item-title item-label">Вырожение</div>
                                                        <div class="item-input-wrap">
                                                            <textarea name="parser" class="resizable" placeholder="Bio"></textarea>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>                                
                                    </div>

                                </div>
                            </div>
                        </div>
                </div>
            </div>
            `,
            dataform: {"type": "popup", data: {el: ".attr-popup", on: {}}}
        },
        rule: {
            class: 'rule',
            api: 'api/data/connection/mail/model/rules',
            description: 'Правило обработки сообщений',
            icon: 'data_object',
            pages: ['model'],
            inputs: {
                in: 1,
                to: 1,
                connect: { 
                    in: {
                    },
                    to: {

                    }
                }
            },
            data: {
                id: -1,
                name: "Новое правило",
                action: new Array(),
                enable: false,
                order_id: null,
                stop_flag: false,
                action_parameters: new Object(),
                filter: new Array()
            },
            html: `
                <div>
                <div class="title-box">
                    <div style="display: flex;">
                        <i class="title-icon material-icons">data_object</i>
                        <font style="width: 100%;">Правило обработки сообщений</font>
                        <div class="preloader publish color-blue" style="display:none">
                            <span class="preloader-inner" style="width: 20px;height: 20px;top: 15px;left: -10px;">
                                <span class="preloader-inner-circle"></span>
                            </span>
                        </div>
                        <a class="material-icons rollback link" style="float: right;padding-top: 12px;margin-right: 10px;color: red;display: none">close</a>
                        <a class="material-icons done create-model link" style="float: right;padding-top: 12px;margin-right: 10px;color: green;display: none">done</a>
                        <i class="material-icons edit tooltip-init" data-tooltip="Набор параметров.Двойной клик, отрывает параметры" style="float: right;padding-top: 12px;margin-right: 10px;color:#80808066">edit_note</i>                </div>
                </div>
                <div class="box list" style="padding: 0;margin: 0;background: none;">
                        <ul style="background: none;">
                            <li style="width: auto;">
                                <div class="item-content">
                                    <div class="item-inner" style="min-width: 200px;">
                                        <div class="item-title simple"><input style="border: none" type="text" placeholder="Новое правило" df-name></div>
                                        <div class="item-after">
                                            <label class="toggle toggle-init edit color-green"><input type="checkbox" df-enable checked/><span class="toggle-icon"></span></label>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
            </div>
                `
        }, 
        test: {
            class: 'test',
            api: 'api/data/connection/mail/model/rules',
            description: 'Бок для тестов',
            icon: 'data_object',
            pages: ['model'],
            inputs: {
                in: 1,
                to: 1,
                connect: { 
                    in: {
                    },
                    to: {

                    }
                }
            },
            data: {
                id: -1,
                name: "Новое правило",
                action: new Array(),
                enable: false,
                order_id: null,
                stop_flag: false,
                action_parameters: new Object(),
                filter: new Array()
            },
            html:
            `<div>
            <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
              <div class="box dbclickbox" ondblclick="showpopup(event)">
                Db Click here
                <div class="modal" style="display:none">
                  <div class="modal-content">
                    <span class="close" onclick="closemodal(event)">&times;</span>
                    Change your variable {name} !
                    <input type="text" df-name>
                  </div>

                </div>
              </div>
            </div>`
        }
    }
    if (nodename){
        return spec[nodename]
    }else{
        return spec
    }
    
}