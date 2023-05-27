/**
 * Use this list of objects to define the tresholds for the alerts to run them.
 * You may also define list of media that should be played when an alert is running.
 * - Structure :
 * -     {
 * -         amount_treshold : <AMOUNT_IN_USER_CURRENCY>,
 * -         list : [
 * -             {
 * -                 type : 'audio | video | img',
 * -                 src : '<NAME_OF_FILE_IN_MEDIA_TYPE_DIRECTORY>'
 * -             }
 * -         ]
 * -     }
 */
const media_resources = [];
