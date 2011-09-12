const widgets = require("widget");
const tabs = require("tabs");
const net = require("request");

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
    var authCode = "";
    var auth = net.Request({
        url: 'https://www.google.com/accounts/ClientLogin',
        method: 'POST',
	headers: {
	    'GData-Version': '3.0'
	},
	conent: { Email: 'gwilb.ad@gmail.com',
		  Passwd: 'XXXXXXXXX',
		  accountType: 'HOSTED_OR_GOOGLE',
		  service: 'writely',
		  source: 'googleDocs@gwilburn.com' },
        onComplete: function( resp ){
            var re = /Auth=([a-z0-9_\-]+)/i;
            authCode = re.exec( resp.text )[0].split('=')[1];

	    var list = net.Request( {
		url: 'https://docs.google.com/feeds/default/private/full',
		headers: {
		    'Authorization': 'GoogleLogin auth=' + authCode,
		    'GData-Version': '3.0'
		},
		content: { Email: 'gwilb.ad@gmail.com',
			   Passwd: 'XXXXXXXXX',
			   accountType: 'HOSTED_OR_GOOGLE',
			   service: 'writely',
			   source: 'googleDocs@gwilburn.com' },
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
