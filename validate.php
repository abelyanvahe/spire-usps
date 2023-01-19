<?php
$address1 = $_POST["address1"];
$address2 = $_POST["address2"];
$zip = $_POST["zip"];
$state = $_POST["state"];
$city = $_POST["city"];

$request_doc_template = <<<EOT
<?xml version="1.0"?>
<AddressValidateRequest USERID="205YEREO5417">
	<Revision>1</Revision>
	<Address ID="0">
        <Address1></Address1>
		<Address2>$address1</Address2>
		<City>$city</City>
		<State>$state</State>
		<Zip5>$zip</Zip5>
        <Zip4/>
	</Address>
</AddressValidateRequest>
EOT;

// prepare xml doc for query string
$doc_string = preg_replace('/[\t\n]/', '', $request_doc_template);
$doc_string = urlencode($doc_string);

$url = "http://production.shippingapis.com/ShippingAPI.dll?API=Verify&XML=" . $doc_string;
// echo $url . "\n\n";

// perform the get
$response = file_get_contents($url);

$xml = simplexml_load_string($response) or die("Error: Cannot create object");

if ($xml->Address->Error) {
    echo json_encode([
        "error" => true,
        "text" => $xml->Address->Error->Description->__toString()
    ]);
    die();
}

echo json_encode([
    // There is a bug related to address 1, so we return it the way we received
    "address1" => $xml->Address->Address2->__toString(),
    "address2" => $address2,
    "city" => $xml->Address->City->__toString(),
    "state" => $xml->Address->State->__toString(),
    "zip" => $xml->Address->Zip5->__toString(),
]);
