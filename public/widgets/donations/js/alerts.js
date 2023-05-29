let current_alert = null;
let alert_queue = [];

class Alert
{
    constructor(data){
        this.id = data.id;
        this.username = data.username;
        this.amount = data.amount_formatted;
        this.amount_main = data.amount_main;
        this.currency = data.currency;
        this.type = data.alert_type;
        this.message = data.message;
        this.message_type = data.message_type;
    }

    prepare(){
        [...media.children].forEach(element=>{
            element.src = '#';
        });

        author.innerText = this.username;
        amount.innerText = `${this.amount} ${this.currency}`;

        switch(this.message_type){
            case 'text' :
                message.innerText = this.message;
                this.try_tts();
                break;
            case 'audio':
                message_audio.src = this.message;
        }

        const resource_list = (()=>{
            for (let i = 0; i < media_resources.length; i++){
                if (this.amount_main < media_resources[i].amount_treshold){
                    return media_resources[i > 0 ? i-1 : 0].list;
                }
            }
            return media_resources[media_resources.length-1].list;
        })();

        resource_list.forEach(resource=>{
            media.querySelector(resource.type).src = `res/${resource.type}/${resource.src}`;
        });
    }

    run(){
        if (media_video.src != `${window.location}#`){
            media_video.play();
        }
        if (media_audio.src != `${window.location}#`){
            media_audio.play();
        } else {
            if (message_audio.src != `${window.location}#`){
                message_audio.play();
            }
        }
    }

    end(){
        console.debug('Alert removed');
        current_alert = null;
    }

    try_tts(){
        if (settings.tts_proxy_url){
            fetch(settings.tts_proxy_url, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    alert_id : this.id,
                    alert_type : this.type,
                    text : this.message
                })
            })
            .then(response=>{
                if (response.ok) return response.blob();
                else return Promise.reject();
            })
            .then(blob=>{
                message_audio.src = URL.createObjectURL(blob);
            });
        }
    }
}
