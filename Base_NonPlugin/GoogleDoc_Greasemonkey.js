// ==UserScript==
// @name           login & list
// @namespace      gwilburn.com
// @include        http*://www.google.com*
// ==/UserScript==

	var userName,//="gwilb.ad@gmail.com",
    	password,//="4cx10m00";
    	del,
    	localStore;

	localStore = { storage: localStorage, 
				getter: function( key ){
					if( checkLocal() ){
						return this.storage.getItem( key );
					} else if ( GM_getValue ){
						GM_getValue( key );
					} else {
						; // fail silently
					}
				},
				setter: function( key, value ){
					if( checkLocal() ){
						this.storage.setItem( key, value );
					} else if ( GM_setValue ){
						gm_setValue( key, value );
					} else {
						; // fail silently
					}
				},
				credStored: function(){
					if( checkLocal() ){
						return this.storage.getItem('userName') !== null && this.storage.getItem( 'password' ) !== null;
					} else if( GM_getValue ){
						return GM_getValue( 'userName' ) !== undefined && GM_getValue( 'password' ) !== undefined;
					} else {
						return false;
					}
				},
				storeCred: function( key, value ){
					this.setter( key, value );
					this.credStored = true;
				},
				delCred: function( key ) {
					if( checkLocal() ){
						this.storage.removeItem( key );
					} else if( GM_deleteValue ){
						GM_deleteValue( key );
					} else {
						; // fail silently
					}
					this.credStored = false;
				}
		};

	if( ! localStore.credStored() ){
	// display modal for username/pass
		var overlay = document.createElement("div");
		var modal	= document.createElement("div");

		overlay.style.visibility		= "visible";
		overlay.style.position			= "absolute";
		overlay.style.left				= "0px";
		overlay.style.top				= "0px";
		overlay.style.width 			= "100%";
		overlay.style.height			= "100%";
		overlay.style.textAlign			= "center";
		overlay.style.zIndex			= "100";
		overlay.id 						= "overlay";
		overlay.style.backgroundColor	= "rgba(128,128,128,0.8)";

		modal.style.width				= "300px";
		modal.style.margin				= "100px auto";
		modal.style.backgroundColor		= "#FFF";
		modal.style.border				= "solid 1px #000";
		modal.style.padding				= "15px";
		modal.style.opacity				= "1";

		var label = document.createElement("span");
		label.appendChild(document.createTextNode("Username: "));
		modal.appendChild(label);

		var tf = document.createElement("input");
		tf.type = "text";
		tf.id="gw_username";
		modal.appendChild(tf);
		modal.appendChild(document.createElement("br"));

		label = document.createElement("span");
		label.appendChild(document.createTextNode("Password: "));
		modal.appendChild(label);

		tf = document.createElement("input");
		tf.type = "password";
		tf.id = "gw_password";
		tf.addEventListener( "keyup", function( evt ){
			var key = evt.keyCode || evt.which;
			if( key == 13 ){
				var trigger = document.createEvent("MouseEvents");
				trigger.initMouseEvent("click", true, true, window,
									0, 0, 0, 0, 0,
									false, false, false, false,
									0, null );
				var btn = document.getElementById("login");
				btn.dispatchEvent(trigger);
			}
		}, false );
		modal.appendChild(tf);
	
		modal.appendChild( document.createElement("br") );

		var login = document.createElement("button");
		login.appendChild(document.createTextNode("Log In"));
		login.id = "login";
		login.addEventListener("click", function( evt ){
			if(document.getElementById("gw_username").value != "" &&
			  document.getElementById("gw_password") != "" ){
				userName = document.getElementById("gw_username").value;
				password = document.getElementById("gw_password").value;
				document.getElementById("overlay").style.visibility = "hidden";
				localStore.storeCred( "userName", userName );
				localStore.storeCred( "password", password );
				getList();
			}
		}, false);

		var skip = document.createElement("button");
		skip.addEventListener( "click", function( evt ){
			document.getElementById("overlay").style.visibility = "hidden";
		},false );
		skip.appendChild( document.createTextNode("Skip") );

		modal.appendChild( login );

		modal.appendChild( document.createElement("br") );

		modal.appendChild( skip );

		overlay.appendChild(modal);

		document.body.appendChild(overlay);

	} else {
	// already stored the username and pass, re-use it
		userName = localStore.getter( "userName" );
		password = localStore.getter( "password" );

		getList();
	}

function checkLocal(){
	return 'localStorage' in window && window['localStorage'] !== null;
}

function getList(){
	if( document.doctype === null ){
		return;
	}

	GM_xmlhttpRequest( {
  		method: "POST",
		url: "http://www.gwilburn.com/googleDoc.php",
  		data: "username=" + userName + 
        	"&password=" + password,
  		headers: {
		     "Content-Type": "application/x-www-form-urlencoded"
           },
  		onload: function( resp ){
/*			  **** Log everything from the response to see
					what exactly we have ****
			  GM_log( [
						resp.status,
						resp.statusText,
						resp.readyState,
						resp.responseHeaders,
						resp.responseText,
						resp.finalUrl,
						resp.responseXML
					  ].join( "\n;\n" ) );*/
			var docs;
			if( document.doctype.name == "html" ){
				// HTML5 specific elements
				docs = document.createElement( "section" );
			} else {
				// HTML 4 or XHTML, use div
				docs = document.createElement("div");
			}
			docs.id = "googleDocsList"
			docs.innerHTML = resp.responseText;
			docs.style.position = "absolute";
			docs.style.top = "35px";
			docs.style.right = "5px";
			docs.style.border = "dashed 1px #CCC";
			docs.style.padding = "3px";
			docs.style.margin = "0px";
			docs.style.background = "#fff";
			docs.style.zIndex = "9001"; // I'ts over 9000!!!111oneoneone

			del = document.createElement("button");
			del.addEventListener("click",function(){
					localStore.delCred("userName");
					localStore.delCred("password");
				},false);
			del.appendChild( document.createTextNode("Delete Credtials") );
			
			docs.appendChild( document.createElement("br") );
			docs.appendChild( del );
			document.body.appendChild(docs);
		}
	} );
}

