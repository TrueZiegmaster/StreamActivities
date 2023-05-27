<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class DAController extends Controller
{
    public function authorize_app(){
        $url = 'https://www.donationalerts.com/oauth/authorize?';

        $app_id = 'client_id=' . DB::table('donation_alerts')->select(['prop_value'])->where('prop_name', 'app_id')->first()->prop_value;

        $redirect = 'redirect_uri=https://'.$_SERVER['HTTP_HOST'].'/streaming/donation_alerts/token';

        $response_type = 'response_type=code';

        $scopes = 'scope=oauth-user-show oauth-donation-subscribe oauth-donation-index oauth-custom_alert-store oauth-goal-subscribe oauth-poll-subscribe';

        return redirect($url.$app_id.'&'.$redirect.'&'.$response_type.'&'.$scopes);
    }

    public function get_token(Request $request){
        $app_id = DB::table('donation_alerts')->select(['prop_value'])->where('prop_name', 'app_id')->first()->prop_value;
        $app_api_key = DB::table('donation_alerts')->select(['prop_value'])->where('prop_name', 'app_api_key')->first()->prop_value;

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, 'https://www.donationalerts.com/oauth/token');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded'
        ]);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query([
            'grant_type' => 'authorization_code',
            'client_id' => $app_id,
            'client_secret' => $app_api_key,
            'redirect_uri' => 'https://'.$_SERVER['HTTP_HOST'].'/streaming/donation_alerts/token',
            'code' => $request->input('code')
        ]));


        $response = curl_exec($curl);
        curl_close($curl);

        $dataset1 = json_decode($response, true);

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, 'https://www.donationalerts.com/api/v1/user/oauth');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer '.$dataset1['access_token']
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $dataset2 = json_decode($response, true);

        DB::table('donation_alerts')->upsert([
            [
                'prop_name' => 'user_id',
                'prop_value' => $dataset2['data']['id']
            ],
            [
                'prop_name' => 'access_token',
                'prop_value' => $dataset1['access_token']
            ],
            [
                'prop_name' => 'refresh_token',
                'prop_value' => $dataset1['refresh_token']
            ],
            [
                'prop_name' => 'socket_connection_token',
                'prop_value' => $dataset2['data']['socket_connection_token']
            ],
        ], 'prop_name');

        return redirect('https://'.$_SERVER['HTTP_HOST'].'/streaming/widgets/donations');
    }

    public function get_credentials(){
        $rows = DB::table('donation_alerts')->select()->get();

        $credentials=[];

        foreach($rows as $row){
            $credentials[$row->prop_name] = $row->prop_value;
        }

        return response()->json($credentials, 200);
    }

    public function proxy_tts_request(Request $request){
        $widget_token = DB::table('donation_alerts')->select(['prop_value'])->where('prop_name', 'widget_token')->first()->prop_value;

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, 'https://www.donationalerts.com/api/v1/speechsynthesis?'.http_build_query([
            'alert_id' => $request->alert_id,
            'alert_type' => $request->alert_type,
            'text' => $request->text,
        ]));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer '.$widget_token
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        return response($response, 200, ['Content-Type' => $this->is_json($response) ? 'application/json' : 'audio/mp3']);
    }

    /**
    * Returns true, when the given parameter is a valid JSON string.
    */
    private function is_json( $value ) {
        // Numeric strings are always valid JSON.
        if ( is_numeric( $value ) ) { return true; }

        // A non-string value can never be a JSON string.
        if ( ! is_string( $value ) ) { return false; }

        // Any non-numeric JSON string must be longer than 2 characters.
        if ( strlen( $value ) < 2 ) { return false; }

        // "null" is valid JSON string.
        if ( 'null' === $value ) { return true; }

        // "true" and "false" are valid JSON strings.
        if ( 'true' === $value ) { return true; }
        if ( 'false' === $value ) { return true; }

        // Any other JSON string has to be wrapped in {}, [] or "".
        if ( '{' != $value[0] && '[' != $value[0] && '"' != $value[0] ) { return false; }

        // Verify that the trailing character matches the first character.
        $last_char = $value[strlen($value) -1];
        if ( '{' == $value[0] && '}' != $last_char ) { return false; }
        if ( '[' == $value[0] && ']' != $last_char ) { return false; }
        if ( '"' == $value[0] && '"' != $last_char ) { return false; }

        // See if the string contents are valid JSON.
        return null !== json_decode( $value );
    }
}
