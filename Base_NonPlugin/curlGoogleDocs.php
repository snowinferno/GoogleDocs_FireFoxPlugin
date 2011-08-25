<?php
# Author: Greg Wilburn
#
# Use provided credentials to authenticate with Google Docs and
# return HTML code for the GreaseMonkey script to display

header( 'content-type: text/xml' );
header( 'Cache-Control: no-cache, must-revalidate' );
header( 'Expires: Sun, 20 Jun 1982 05:00:00 GMT' );
$clientLoginURL = "https://www.google.com/accounts/ClientLogin";

$ch = curl_init( $clientLoginURL );

curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );

$user = $_POST["username"];
$pass = $_POST["password"];

$data = array( 'accountType' => 'HOSTED_OR_GOOGLE',
'Email' => $user,
'Passwd' => $pass,
'source'=>'PHI-cUrl-Example',
'service'=>'writely' );

curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
curl_setopt( $ch, CURLOPT_POST, true );
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_POSTFIELDS, $data );
curl_setopt( $ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY );

$authTmp = curl_exec( $ch );

preg_match("/Auth=([a-z0-9_\-]+)/i", $authTmp, $matches);
$auth = $matches[1];

unset( $data, $authTmp );

$docsListURL = "https://docs.google.com/feeds/default/private/full";

$headers = array( "Authorization: GoogleLogin auth=$auth",
		  "GData-Version: 3.0" );

curl_setopt( $ch, CURLOPT_URL, $docsListURL );
curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
curl_setopt( $ch, CURLOPT_POST, false);

$response = curl_exec( $ch );
curl_close( $ch );

$response = simplexml_load_string( $response );

$len = count( $response->entry );

if( $len > 1 ){
  $i = 0;
  foreach( $response->entry as $file ){
    echo "File: <a href=\"" . $file->link["href"] . "\">" . $file->title . "</a><br>\r\n";
    echo "Type: " . $file->content['type'] . "<br>\r\n";
    echo "Author: " . $file->author->name;
    if( $i != $len - 1 ){
      echo "<br><br>\r\n\r\n";
    }
    $i++;
  }
}
else{
  $file = $response->entry;
  echo "File: <a href=\"" . $file->link["href"] . "\">" . $file->title . "</a><br>\r\n";
  echo "Type: " . $file->content['type'] . "<br>\r\n";
  echo "Author: " . $file->author->name . "\r\n\r\n";
}
unset( $ch, $auth, $response );
?>

