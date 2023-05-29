const player = document.getElementById('player-wrapper');

const equalizer = document.querySelector('#equalizer > .eq-row');

let player_paused;

const getRandomHeight = (min, max) => ~~(Math.random() * (max - min)) + min;

const animateEqualizer = () => {
    const lines = equalizer.querySelectorAll('div');
    setInterval(() => {
    lines.forEach((line, idx) => {
        const max = equalizer.clientHeight;
        const min = max/4;
        const height = getRandomHeight(min, max);
        const shadowLine = equalizer.nextSibling.children[idx];
        line.style.height = `${player_paused ? min : height}px`;
        shadowLine.style.height = `${player_paused ? min : height}px`;
    })}, 100);
}

const createEqualizer = (n) => {
    for (let i = 0; i < n; i++) {
    const line = document.createElement('div');
    equalizer.appendChild(line);
    }
    const shadow = equalizer.cloneNode(true);
    equalizer.after(shadow);

    animateEqualizer();
}

createEqualizer(50);

/*
* WEBSOCKET
*/

const websocket_connect = () => {
    let ws = new WebSocket('wss://ziegmaster.keenetic.pro/websocket/music');

    ws.onopen = (event) => {
        console.log('Websocket opened!');

        ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if (Object.keys(data).length > 0){
                document.getElementById('title').innerText = data.title;
                document.getElementById('progress-bar').style.display = 'block';
                document.getElementById('elapsed-time').style.width = `${data.progress / data.duration * 100}%`;
                player.classList.add('active');
                player_paused = data.paused;
                if (player_paused){
                    player.classList.add('paused')
                }
                else{
                    player.classList.remove('paused');
                }
            }
            else{
                player.classList.remove('active');
            }
        }

        ws.onclose = (event) => {
            console.log('Websocket closed! Reconnecting in 5 seconds...');
            setTimeout(websocket_connect, 5000);

            player.classList.remove('active');
        }

        ws.send(JSON.stringify({
            command : 'subscribe',
            guild_id : '884352642028015636'
        }));
    }

    ws.onerror = (event) => {
        console.log('Websocket error! Reconnecting in 5 seconds...');
        setTimeout(websocket_connect, 5000);

        player.classList.remove('active');
    }
}

websocket_connect();
