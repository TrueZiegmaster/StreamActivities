const settings = {
    /**
    * This will enable some logging into console. You can disable it if you want.
    */
    da_debug : true,

    /**
     * Fill it if you're obtaining your credentials from the web. Otherwise, leave this property as an empty string.
     */
    credentials_url : `${window.location.origin}/streaming/api/donation_alerts/get-credentials`,

    /**
     * This url is required if you still want DA to voice your donations. You'll need a server to proxy your tts request because this endpoint is behind CORS wall.
     * - Endpoint: https://www.donationalerts.com/api/v1/speechsynthesis
     * - Query params : alert_id, alert_type, text
     */
    tts_proxy_url : '/streaming/api/donation_alerts/proxy-tts',

    /**
     * Your user token which is used in most DA widgets as a query param.
     * Get it here: https://www.donationalerts.com/dashboard/general-settings/account
     */
    user_secret : '',

    /**
     * Your widget token. Used by this widget for authentificating tts requests.
     * They call it access_token but there is already access_token for a user to use API and it's not the same thing. So it would be a widget_token for us.
     * Obtaining it is a bit tricky.
     * 1) Get your official DA widget here: https://www.donationalerts.com/dashboard/widgets/alerts
     * 2) Open it in a browser tab
     * 3) Find last script section inside <head> and search for access_token
     * 4) Or just simply press F12 and type 'access_token' in console and you'll get it
     * 5) Get the new one if your widget suddenly stopped working and you're getting 'Unauthorized' or 'Unauthenticated' errors.
     *    This probably means your token has expired or it's invalid
     */
    widget_token : '',
}

/**
 * Trying to obtain credentials using provided url.
 */
if (settings.credentials_url){
    // Change this if you want to retrieve the data and it is stored in a different way.
    fetch(settings.credentials_url).then(response=>{
        if (response.ok) return response.json();
        else return Promise.reject();
    }).then(data=>{
        settings.user_secret = data.user_secret;
        settings.widget_token = data.widget_token;
    });
}
