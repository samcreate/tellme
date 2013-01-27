<?php

// $settings->setPage("Your Title Here");
// $class = "api"; 
// $content = 'tellme example content for api';

// echo "API here";

// // include DIR_VIEW.'/api.php';

switch (URI_PART_1) {

	case 'html':
			
		if( defined('URI_PART_1') ){
			_get_template(URI_PART_2, $settings);
		} 
		break;
	
	default:
		# code...
		break;
}


function _get_template($template, $settings){
	
	$template_path = $settings->protocol."://".$settings->server_name."/lib/js/bookmarklet/html/";

	switch ($template) {
		case 'modal':
			# code...
			
			$data = file_get_contents($template_path.$template.'.html.tpl');

			$data = json_encode($data);

			header("Content-Type: application/json");

			echo $_GET['callback'] . '(' . "{'template' : '".$data."'}" . ')';

			break;
		
		default:
			# code...
			break;
	}
}

?>
