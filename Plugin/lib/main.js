const widgets = require("widget");
const tabs = require("tabs");

var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
//    tabs.open("http://www.google.com/");
    getList();
  }
});

function getList(){
    var request = require( "request" ).Request;
    var authCode = "";
    var auth = request({
        url: 'https://www.google.com/accounts/ClientLogin',
        method: 'POST',
        content: 'Email=gwilb.ad@gmail.com&Passwd=XXXXXXX&accountType=HOSTED_OR_GOOGLE&service=writely&source=googleDocs@gwilburn.com',
	headers: {
	    'GData-Version': '3.0'
	},
/*	conent: { Email: 'gwilb.ad@gmail.com',
		  Passwd: 'XXXXXXXXXX',
		  accountType: 'HOSTED_OR_GOOGLE',
		  service: 'writely',
		  source: 'googleDocs@gwilburn.com' },*/
        onComplete: function( resp ){
            var re = /Auth=([a-z0-9_\-]+)/i;
//            console.log( resp.text );
            authCode = re.exec( resp.text )[0].split('=')[1];

	    var hdr = { 'GData-Version': '3.0' };
	    hdr['Authorization'] = authCode;
	    var list = request( {
//		url: 'https://docs.google.com/feeds/default/private/full',
		url: 'http://www.gwilburn.com/headers.php',
		headers: {
		    'Authorization': 'GoogleLogin auth=' + authCode,
		    'GData-Version': '3.0'
		},
//		method: 'POST',
//		content: 'Email=gwilb.ad@gmail.com&Passwd=4cx10m00&accountType=HOSTED_OR_GOOGLE&service=writely&source=googleDocs@gwilburn.com',
		content: 'Email=gwilb.ad@gmail.com&Passwd=XXXXXXXXX&accountType=HOSTED_OR_GOOGLE&service=writely&source=googleDocs@gwilburn.com',
/*		content: { Email: 'gwilb.ad@gmail.com',
			   Passwd: 'XXXXXXXXX',
			   accountType: 'HOSTED_OR_GOOGLE',
			   service: 'writely',
			   source: 'googleDocs@gwilburn.com' },*/
		contentType: 'text/plain',
		onComplete: function( resp ) {
		    console.log( resp.text );
		}
	    } );
	    list.post();
        }
    });
    auth.post();
}

console.log("The add-on is running.");
