/**
 * Created by user on 30.04.2016.
 */

var stomp;

function connect() {
    stomp = Stomp.over(new SockJS("/chat"));
    stomp.connect("guest", "guest", connectCallback, errorCallback);
}

function displayMessages(frame) {
    console.log(frame);
    var message = JSON.parse(frame.body);
    var xy = message.xy;
    var xz = message.xz;
    var zy = message.zy;
    if (camera != null) {
        speed = message.speed;
        xzLast = xz;
    }
}


var connectCallback = function () {
    stomp.subscribe('/topic/message', displayMessages);
};

var errorCallback = function (error) {
    alert(error.headers.message);
};