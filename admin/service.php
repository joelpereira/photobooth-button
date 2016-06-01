<?php
////////////////////////////////////////////////////////////////////////////
// Variables
//
$returnObj = new stdClass();
$returnObj->success = false;
$action = "";
$status = "";
if (isset($_GET['action'])){
	$action = $_GET['action'];
}
if (isset($_GET['name'])){
	$name = $_GET['name'];
}
if (isset($_GET['status'])){
	$status = $_GET['status'];
}

function fixCmd($cmd, $s) {
	if (strtolower($s) == 'on') {
		return $cmd . ' start 2>&1';
	} else {
		return $cmd . ' stop 2>&1';
	}
}

function serviceControl($returnObj, $dir, $cmd, $status) {
	return $returnObj;
}

function getStatus($returnObj, $grep) {
	return $returnObj;
}


try {
	switch($action){
		case "servicecontrol":
			$dir = "";
			$cmd = "";
			if ($name == "gphoto") {
				$dir = "../../gphoto-webui";
				$cmd = "./gphoto-webui.sh";
			} elseif ($name == "button") {
				$dir = "..";
				$cmd = "./button.sh";
			} elseif ($name == "photobooth") {
				$dir = "../../shmile";
				$cmd = "./shmile.sh";
			}
			if ( ! chdir($dir)) {
				$returnObj->message = "Error: Could not change to directory: " . $dir;
				break 2;
			}
			$cmd = fixCmd($cmd, $status);
			$returnObj->cmd = $cmd;
			$returnObj->dir = getcwd();
			//exec ($cmd, $output, $rv);

			$returnObj->message = shell_exec ($cmd);
			$returnObj->success = true;

/*			$returnObj->message = implode("; ", $output);
			if ($rv == 0) {
				$returnObj->success = true;
			}
*/
			break;
		case "getstatus":
			if ($name == "gphoto") {
				$grep = "grep php5 | grep 8000";
			} elseif ($name == "button") {
				$grep = "grep button.py";
			} elseif ($name == "photobooth") {
				$grep = "grep php5 | grep 8001 | grep admin";
			}
			$cmd = "ps -ef  | " . $grep . " | grep -v grep | wc -l";
			$cmd = "ps -aux | " . $grep . " | grep -v grep | wc -l";
			exec ($cmd, $output, $rv);
			$returnObj->cmd = $cmd;
			$count = $output[0];
			$returnObj->processCount = $count;
			if ($count == 0) {
				$returnObj->running = false;
			} else {
				$returnObj->running = true;
			}
			if ($rv == 0) {
				$returnObj->success = true;
			}
			break;
		default:
			break;
	}
} catch (Exception $e) { //else resize the image...
	//echo $e;
	//var_dump($e);
}

header('Content-Type: application/json');
echo json_encode($returnObj);
exit();

?>
