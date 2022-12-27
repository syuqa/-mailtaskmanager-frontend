function ConnecotNotification(){
    var ws = new WebSocket(app_ws(`ws/foobar?subscribe-broadcast&publish-broadcast&subscribe-user`));
    ws.onopen = function() {
        console.log("websocket connected");
    };
    ws.onmessage = function(e) {
        console.dir(e)
        notifi = JSON.parse(e.data)
        const NOTIFICATION_TITLE = notifi.title
        const NOTIFICATION_BODY = notifi.body
        const CLICK_MESSAGE = notifi.link

        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
        .onclick = () => console.log(CLICK_MESSAGE)
    };
    ws.onerror = function(e) {
        console.error(e);
    };
    ws.onclose = function(e) {
        console.log("connection closed");
    }
    function send_message(msg) {
        ws.send(msg);
    }
}