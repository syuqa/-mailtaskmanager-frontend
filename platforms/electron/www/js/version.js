const fs = require('fs');
const path = require('path');
const shell = require('electron').shell;

var $ = Dom7;

function app_api(path){
    return new URL(path, 'https://syu-developer-02.ru/').href 
  }

function version_to_int(version){
   return parseInt(version.split('.').join(''))
}

class Release {
    
    constructor(){
        this.root_path = path.resolve('release/')
    }

    root() {
        var path = this.root_path
        try {
            fs.accessSync(path, fs.constants.R_OK);
            return true
        }catch (err){
            fs.mkdir(path, err => {
                if(err){
                    return false
                }else{
                    return true
                }
             });
        }
    }

    file_path(file){
        const fpath = path.join(this.root_path, file)
        try {
            fs.accessSync(fpath, fs.constants.R_OK);
            return fpath
        }catch (err){
            return undefined
            }
        }

    save(filename, data){
        this.root()
        console.log(this.root_path, filename)
        const file = path.join(this.root_path, filename)
        console.log(file)
        return new Promise((resolve, reject) => {
            var fileReader = new FileReader();
            fileReader.onload = function () {
                   //fs.writeFileSync(file, Buffer(new Uint8Array(this.result)))
                   fs.writeFile(file, Buffer(new Uint8Array(this.result)), function(error){
                        if(error) reject(new Error(error)); 
                        resolve('Файл сохранен')
                   })
            };
            fileReader.readAsArrayBuffer(data);
        })
    }

}

var device = Framework7.getDevice();
var app = new Framework7({
  //name: 'My App', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element
  routes: {
    path: '/version',
    content: `
        <div class="page">
        <div class="page-content parent">
            <center class="child">
                <img src="img/mm_.png" style="width: 120px;">
                <p class="version"></p>
                <div style="border-width: 1px;border-style: double;border-color: #00000012;margin-top: 5px;width: 60%;"></div>
                <div class="release">
                    <div style="display: flex;margin-top: 10px;">
                        <div class="preloader preload-1" style="margin-right: 10px;width: 15px;height: 15px;margin-top: 4px;opacity: 0.5;">
                            <span class="preloader-inner">
                                <span class="preloader-inner-circle"></span>
                            </span>
                        </div>
                        <div style="color: #00000075;">Проверка наличия обновлений</div></div>
                    </div>
                </div>
            </center>
        </div>
        </div>`,
    on: {
        pageInit: function (event, page) {
            // Версия клиента
            page.$el.find('.version').text(`Версия клиента:  ${app.version}`)
            // Проверка наличия обновления
            app.request.setup({
                headers: {
                  "Authorization": "Token " + localStorage.getItem('api-token')
                }
                })
            app.request.get(app_api(`api/frontend/release/${app.device.os}`),
                function(request){
                    if (version_to_int(request.version) > version_to_int(app.version)){
                        page.$el.find('.release').html(`
                            <p>Доступна новая версия ${request.version}</p>
                            <button id="upgrade" url="${request.file}" class="button button-small button-outline button-raised">Установить</button>
                        `)
                    }else{
                        page.$el.find('.release').html(`<p style="color: #00000075;">Устновлена последняя версия</p>`)
                    }

                }, 
                function(request){
                    page.$el.find('.release').html(`<p style="color: #00000075;">Ошибка провеки наличия обновления</p>`)
                }, 
                'json')
            // Устнвока обновления
            page.$el.on('click', '#upgrade', function(){
                page.$el.find('.release').html(`<p>Загрузка обновлений<p/><div class="progress"><div class="progressbar color-green" data-progress="0"</div></div>`)
                const progress = app.progressbar.show('.progress', 0);
                const url = $(this).attr('url')
                const filename = new URL(url).pathname.split('/').pop()
                console.log(url, filename)
                // Загрузка файла
                const xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.onprogress = function(event) {
                        app.progressbar.set(progress, parseInt((event.loaded / event.total)* 100));
                    }
                xhr.open('GET', url, true);
                xhr.send();
                xhr.onload = xhr.onerror = function() {
                    if (this.status == 200) {
                        let f = new Release()
                            console.log(filename)
                            f.save(filename, xhr.response)
                                .then(
                                    function(){
                                        page.$el.find('.release').html(`<p style="color: #00000075;">Обновляения загружены</p>`);
                                        let file = f.file_path(filename)
                                        if (file){
                                            shell.openExternal(file);
                                            //window.close()
                                        }
                                    })
                    } else {
                      page.$el.find('.release').html(`<p style="color: #00000075;">Ошибка провеки наличия обновления</p>`)
                      page.$el.find('.release').html(`
                            <p>Ошибка провеки наличия обновления</p>
                            <button id="upgrade" url="${url}" class="button button-small button-outline button-raised">Повторить</button>
                        `)
                    }
                  };
            })
        }
    }
  },
  id: 'io.framework7.myapp', // App bundle ID
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


var mainView = app.views.create('#version', {
	url: '/version'
});