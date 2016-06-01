<?php

$cmd = "./test.sh";
$cmd = "python test.py &";

exec($cmd, $output, $rv);

echo "Output: '" . implode("; ", $output) . "'";

?>
