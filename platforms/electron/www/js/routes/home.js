function compare(a, b) {
    const aData = new Date($(a).data('event-date'));
    const bData = new Date($(b).data('event-date'));
    if (aData < bData) {
      return -1;
    }
    if (aData > bData) {
      return 1;
    }
    return 0;
  }

function task_list(page, date){
    const tdate = parseInt(Date.parse(date).toString().substr(0, 10))
    console.log(date, tdate)
    var options = { hour: 'numeric', minute: 'numeric'};
                            app.request.get(app_api(`api/tasks/day/${tdate}`), 
                                function(request){
                                    page.find('.page-content').html('<div class="list media-list" style="margin-top: 0px;"><ul id="tasks"></ul></div>')
                                    if (JSON.parse(request).length > 0){
                                        app.tasks = JSON.parse(request)
                                        for (const [index, element] of JSON.parse(request).entries())
                                        {   
                                            var today  = new Date(element.day_actions[element.day_actions.length - 1].event_datetime);
                                            var event = ''
                                            element.day_actions.forEach(el => {
                                                event += `
                                                <div class="chip chip-outline">
                                                    <div class="chip-label">${el.events.create_event.event}</div>
                                                </div>`
                                            });
                                            page.find('.list ul').append($(`
                                            <li class="listing-item" data-event-date="${today}" style="display: flex">
                                                <a class="item-link item-content task-event" index="${index}" event="${element.pk}" 
                                                    style=" padding-right: 16px;
                                                            padding-right: 16px;
                                                            border-width: 0px 5px 0px 0px;
                                                            border-style: double;
                                                            border-color: #f3f4f6;">
                                                    <span class="material-icons">timeline</span></a>
                                                <a href="${element.history[0].events.create_event.event_link}" class="item-link item-content" style="width: 100%;">
                                                    <div class="item-inner">
                                                        <div class="item-title-row">
                                                        <div class="item-title">${element.title}</div>
                                                        <div class="item-after">${today.toLocaleTimeString("ru-RU", options)}</div>
                                                        </div>
                                                        <div class="item-subtitle" style="margin-top: 7px;">${event}</div>
                                                        <!--div class="item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis
                                                        tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum
                                                        sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec
                                                        dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.</div-->
                                                    </div>
                                                </a>
                                            </li>
                                            `))
                                            if (index + 1 == JSON.parse(request).length){
                                                const items = [...document.querySelectorAll('.listing-item')];
                                                items.sort(compare);
                                                $('#tasks').empty();
                                                items.forEach(item => {
                                                    $('#tasks').prepend(item);
                                                });
                                            }
                                        }
                                    }else{
                                        page.find('.page-content').html(`
                                        <div class="page-content parent">
                                        <center class="child">
                                          <img src="img/mm_.png" style="width: 120px;">
                                          <p style="opacity: 0.4;">Нет активности</p>
                                        </center>
                                      </div>
                                        `)
                                    }
                                    app.dialog.close();
                                }, 
                                function(request){
                                    ErrorProcessorRequest(request)
                                    app.dialog.close();
                                }                                
                            )
}

function history(index){
 const event = app.tasks[index]
 const content = $(`
    <div>
        <div class="popup" style="">
            <!-- titlebar -->
            <div class="navbar queue-popup">
                <div class="navbar-bg"></div>
                <div class="navbar-inner navbar-inner-centered-title">
                    <div class="left">
                        <a href="#" class="link popup-close">Закрыть</a>
                    </div>
                    <div class="title" style="left: 250.5px;"></div>
                </div>
            </div>
            <div class="view view-popup">
                <div class="page-content" style="padding-top: 0px;margin-top: 5px;">
                <div class="block-title" style="margin-top: 10px;">${event.title}</div>
                    <div class="timeline"></div>
                </div>
            </div>
        </div>
    </div>
    `)
    for (const [index, element] of event.history.entries()){
        var options = {month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'};
        var dt = new Date(element.event_datetime)
        const timeline = $(`
            <div class="timeline-item">
                <div class="timeline-item-date custom-timlie-datetime">${dt.toLocaleTimeString("ru-RU", options)}</div>
                <div class="timeline-item-divider"></div>
                <div class="timeline-item-content" style="width: 100%;">
                    <div class="chip chip-outline" style="margin-bottom: 10px;">
                        <div class="chip-label">${element.events.create_event.event}</div>
                    </div>
                    <div class="card"></div>
                </div>
            </div>
        `)

        if (Object.keys(element.attribute).length > 0){
            const attr_list = $(`
            <div class="card-content card-content-padding">
                <div class="list">
                    <ul></ul>
                </div>
            </div>
            `)
            for (const [key, value] of Object.entries(element.attribute)){
                attr_list.find('ul').append($(`
                <li>
                    <div class="item-content">
                    <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">${value.description}</div>
                            <div class="item-after">${value.value}</div>
                        </div>
                    </div>
                </li>
                `))
            }
            timeline.find('.card').append(attr_list)
        }
        content.find('.timeline').append(timeline)
    }
    return content.html()
}

calendar.push(
    {
        path: '/calendar',
        url: './pages/calendar.html',
          // specify home route as master route
        master: true,
          // detail routes
        detailRoutes: [
            {
                path: '/today/',
                content: `<div class="page"><div class="page-content"></div></div>
                `,
                    on: {
                        pageBeforeIn: function (event, page) {
                            },
                        pageAfterIn: function (event, page) {
                            },
                        pageInit: function (event, page) {
                                // do something when page initialized

                                console.log('pageInit', 'today')
                                task_list(page.$el, calendarInline.value[0])

                                page.$el.on('click', '.task-event', function(){
                                    let index = $(this).attr('index') 
                                    var TasksPopup = app.popup.create({
                                        content: history(index)
                                    })
                                    TasksPopup.open()
                                })
                                
                            },
                        pageBeforeRemove: function (event, page) {
                                // do something before page gets removed from DOM
                                console.log('pageBeforeRemove')
                            },
                        }       
            },
            {
                path: '/not-connection/',
                content: `<div class="page">
                            <div class="page-content parent">
                                <center class="child">
                                <img src="img/mm_.png" style="width: 120px;">
                                <p style="opacity: 0.4;">Ошибка подключения к серверу</p>
                                </center>
                            </div>
                        </div>`,
                    on: {
                              pageInit: function (event, page) {
                            }
                        }
            }
        ],
        on: {
            pageBeforeIn: function (event, page) {
                },
            pageAfterIn: function (event, page) {
                page.$el.find('a[href^="/today/"]').click()
                },
            pageInit: function (event, page) {
                // Inline with custom toolbar
                var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
                calendarInline = app.calendar.create({
                    containerEl: '#demo-calendar-inline-container',
                    value: [new Date()],
                    weekHeader: false,
                    renderToolbar: function () {
                    return `
                    <div class="toolbar calendar-custom-toolbar no-shadow">
                        <div class="toolbar-inner">
                        <div class="left">
                            <a href="#" class="link icon-only"><i class="icon icon-back ${app.theme === 'md' ? 'color-black' : ''}"></i></a>
                        </div>
                        <div class="center"></div>
                        <div class="right">
                            <a href="#" class="link icon-only"><i class="icon icon-forward ${app.theme === 'md' ? 'color-black' : ''}"></i></a>
                        </div>
                        </div>
                    </div>
                    `;
                    },
                    on: {
                        init: function (c) {
                                $('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
                                $('.calendar-custom-toolbar .left .link').on('click', function () {
                                    calendarInline.prevMonth();
                                });
                                $('.calendar-custom-toolbar .right .link').on('click', function () {
                                    calendarInline.nextMonth();
                                });
                            },
                        monthYearChangeStart: function (c) {
                                $('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
                            },
                        dayClick: function(c){
                            app.dialog.preloader();
                            setTimeout(function(){
                                    task_list($('#calendar .page-master-detail'), c.value[0])
                                    //navigate(`/day/${c.value}`)
                                }, 1000)
                            },
                        
                    }
                });
                
                },
            pageBeforeRemove: function (event, page) {
                }
        }
    }
)