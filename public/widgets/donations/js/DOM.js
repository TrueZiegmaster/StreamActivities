const author = document.querySelector('#message>.author');
const amount = document.querySelector('#message>.amount');
const message = document.querySelector('#message>.text');
const message_audio = document.querySelector('#message>audio');

const media = document.getElementById('media');
const media_img = media.querySelector('img');
const media_video = media.querySelector('video');
const media_audio = media.querySelector('audio');

media_audio.addEventListener('ended', ()=>{
    setTimeout(()=>{
        if (message_audio.src != `${window.location}#`){
            message_audio.play();
        }
    }, 1000);
});
