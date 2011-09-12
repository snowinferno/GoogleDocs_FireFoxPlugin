const widgets = require("widget");
const tabs = require("tabs");
const net = require("request");
const panel = require("panel");
const pwd = require("passwords");

var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
//    tabs.open("http://www.google.com/");
//    getList();
      pwd.search( {
	  url: 'https://accounts.google.com',
	  onComplete: function( creds ){
	      if( creds[0] )
		  getList( creds[0].username, creds[0].password );
	  },
	  onError: function( err ){ console.log( err.toString() ); }
      } );

  }
});

function getList( username, pass ){
    var authCode = "";
    var auth = net.Request({
        url: 'https://www.google.com/accounts/ClientLogin',
        method: 'POST',
	headers: {
	    'GData-Version': '3.0'
	},
	content: { Email: username,
		  Passwd: pass,
		  accountType: 'HOSTED_OR_GOOGLE',
		  service: 'writely',
		  source: 'googleDocs@gwilburn.com' },
        onComplete: function( resp ){
	    console.log( resp.text );
            var re = /Auth=([a-z0-9_\-]+)/i;
            authCode = re.exec( resp.text )[0].split('=')[1];

	    var list = net.Request( {
		url: 'https://docs.google.com/feeds/default/private/full',
		headers: {
		    'Authorization': 'GoogleLogin auth=' + authCode,
		    'GData-Version': '3.0'
		},
		content: { service: 'writely',
			   source: 'googleDocs@gwilburn.com' },
		onComplete: function( resp ) {
		    console.log( resp.text );
		}
	    } );
	    list.get();
        }
    });
    auth.post();
}

console.log("The add-on is running.");
