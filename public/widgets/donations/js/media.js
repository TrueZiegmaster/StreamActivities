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
const media_resources = [
    {
        amount_treshold : 0,
        list : [
            {
                type : 'audio',
                src : 'kaguya_o_kawaii_koto.mp3'
            },
            {
                type : 'img',
                src : 'tse4ge6fbpx51.jpg'
            }
        ]
    },
    {
        amount_treshold : 100,
        list : [
            {
                type : 'audio',
                src : 'SVIN.mp3'
            },
            {
                type : 'img',
                src : 'svin.gif'
            }
        ]
    },
    {
        amount_treshold : 250,
        list : [
            {
                type : 'audio',
                src : 'Papich.mp3'
            },
            {
                type : 'img',
                src : 'akari-akaza-akarin.gif'
            }
        ]
    },
    {
        amount_treshold : 500,
        list : [
            {
                type : 'audio',
                src : 'chiki.mp3'
            },
            {
                type : 'img',
                src : 'flex.gif'
            }
        ]
    }
];
