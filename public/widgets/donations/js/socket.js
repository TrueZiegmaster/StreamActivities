socket = io('wss://socket5.donationalerts.ru:443', {
    reconnection: true,
    reconnectionDelayMax: 5000,
    reconnectionDelay: 1000,
});

socket.on('connect', function (msg) {
    if (settings.da_debug) console.debug('Connected to WS server');
    socket.emit('add-user', {token: settings.user_secret, type: 'alert_widget'});
});

socket.on('connect_error', function (msg) {
    if (settings.da_debug) console.debug('Could not connect to WS server');
});

socket.on('connect_timeout', function (msg) {
    if (settings.da_debug) console.debug('Connection to WS server is timed out');
});

socket.on('reconnect', function (msg) {
    if (settings.da_debug) console.debug('Reconnected to WS server');
});

socket.on('donation', function (msg) {
    let data = JSON.parse(msg);
    if (settings.da_debug) console.debug('[donation]');
    if (settings.da_debug) console.debug(data);
    alert_queue.push(new Alert(data));
});

socket.on('update-alert_widget', function (msg) {
    let data = JSON.parse(msg);
    if (settings.da_debug) console.debug('[update-alert_widget]');
    if (settings.da_debug) console.debug(data);
});

socket.on('update-user_general_widget_settings', function (msg) {
    let data = JSON.parse(msg);
    if (settings.da_debug) console.debug('[update-user_general_widget_settings]');
    if (settings.da_debug) console.debug(data);
});

socket.on('alert-show', function (msg) {
    let data = JSON.parse(msg);
    if (settings.da_debug) console.debug('[alert-show]');
    if (settings.da_debug) console.debug(data);

    switch (data.action){
        case 'start' :
            for (let i=0; i<alert_queue.length; i++){
                if (alert_queue[i].id == data.alert_id){
                    current_alert = alert_queue.splice(i, 1)[0];
                    current_alert.prepare();
                    current_alert.run();
                    break;
                }
            }
        case 'end' :
            current_alert?.end();
            break;
    }
});
