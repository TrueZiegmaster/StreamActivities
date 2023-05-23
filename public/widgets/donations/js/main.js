fetch(`${window.location.origin}/streaming/api/donation_alerts/get-credentials`).then(response=>{
    if (response.ok) return response.json();
    else return Promise.reject();
}).then(credentials=>{
    const websocket_connect = () => {
        let ws = new WebSocket('wss://centrifugo.donationalerts.com/connection/websocket');

        ws.onopen = (event) => {
            console.log('Websocket opened!');

            ws.onmessage = (event) => {
                let data = JSON.parse(event.data);

                switch(data['id']){
                    case 1:
                        fetch('https://www.donationalerts.com/api/v1/centrifuge/subscribe', {
                            method : 'POST',
                            headers : {
                                'Authorization' : `Bearer ${credentials['access_token']}`,
                                'Content-Type' : 'application/json',
                            },
                            body : JSON.stringify({
                                channels : [`$alerts:donation_${credentials['user_id']}`],
                                client : data['result']['client']
                            })
                        }).then(response=>{
                            if (response.ok) return response.json();
                            else return Promise.reject();
                        }).then((data)=>{
                            ws.send(JSON.stringify({
                                params : {
                                    channel : data['channels'][0]['channel'],
                                    token : data['channels'][0]['token']
                                },
                                method: 1,
                                id : 2
                            }));
                        });
                        break;
                    case 2:
                        console.log('Successfully connected to donations channel!');
                        break;
                    case undefined:
                        if (data['type'] === undefined){
                            console.log(data);
                        }
                }
            }

            ws.onclose = (event) => {
                console.log('Websocket closed! Reconnecting in 5 seconds...');
                setTimeout(websocket_connect, 5000);
            }

            ws.send(JSON.stringify({
                params : {
                    token : credentials['socket_connection_token']
                },
                id : 1
            }));
        }

        ws.onerror = (event) => {
            console.log('Websocket error! Reconnecting in 5 seconds...');
            setTimeout(websocket_connect, 5000);
        }
    }

    websocket_connect();
});
