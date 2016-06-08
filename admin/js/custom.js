// Global variables
var PHOTOSPERPAGE = 100;

var GEN_FILES;
var ORI_FILES;
var PS_FILES;

var GEN_FILESPAGENUM;
var ORI_FILESPAGENUM;
var PS_FILESPAGENUM;


//$(document).ready( initialPageLoad );
$(document).on( "pageshow","#page-one", loadFiles_gen);


function getSwitchStatus(switch_id) {
	rv = false;
	flip = $("#" + switch_id);
	if (flip[0].value.toLowerCase() == "on") {
		rv = true;
	}
	return rv;
}



function disableAllFunctions() {
	$("#page-one :input").attr("disabled", true);
}
function enableAllFunctions() {
	$("#page-one :input").attr("disabled", false);
}



function loadPrevFiles(FILESPAGENUM) {
	if (FILESPAGENUM != null && FILESPAGENUM > 2) {
		loadFiles(FILESPAGENUM - 1);
	}
}
function loadNextFiles(FILESPAGENUM) {
	if (FILESPAGENUM != null) {
		loadFiles(FILESPAGENUM + 1);
	}
}

function loadFiles_gen() {
	loadFiles(1, GEN_FILESPAGENUM, "gen");
}
function loadFiles_ori() {
	loadFiles(1, ORI_FILESPAGENUM, "ori");
}
function loadFiles_ps() {
	loadFiles(1, PS_FILESPAGENUM, "strips");
}
function loadFiles(page, FILESPAGENUM, fileName, FILES) {
	if ( page == undefined || isNaN(page) ) {
		// check if a previous page was loaded
		if (isNaN(FILESPAGENUM)) {
			page = 1;
		} else {
			page = FILESPAGENUM;
		}
	}


	// compare if the current page has already been loaded
	if (page == FILESPAGENUM) {
		console.log("Page " + page + " has already been loaded. No need to load again.");
	}
	// new page, so let's load
	else {
		//disableAllCameraFunctions();
		displayLoading("Loading photos...");

		//console.log("Loading files...");

		$.ajax({
			url: "service.php?action=getListOfFiles_" + fileName,
			dataType: "json",
			success: function (data) {

				// set global variable
				FILES = data.files;

				FILESPAGENUM = page;
				FILES = data;
				displayFiles( FILESPAGENUM, fileName, FILES );

			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr);
				console.log(ajaxOptions);
				console.log(thrownError);
			}
		});
	}
}

function displayFiles (page, fileName, FILES) {
	console.log("Loading files on page: " + page);

	$.ajax({
		url: "service.php?action=getListOfFiles_" + fileName + "&page=" + page + "&count=" + PHOTOSPERPAGE,
		dataType: "json",
		success: function (data) {

			if (data.success) {	// success
				// clear container first
				$("#thumbsContainer").html("");
				//console.log("Data::");
				console.log(data);
				// Add each photo to the array, and the page
				var items = new Array();
				var thumbsDir = data.thumbsDir
				var html = "";
				for (i = 0; i < data.files.length; i++) {
					var img     = data.files[i];
					html = $("#thumbsHTML").text();
					html = html.replace(/@thumbURL/g, data.webDir + img);
					html = html.replace(/@downloadURL/g, data.webDir + img);
					$("#thumbsContainer").append( html );
				}
				//console.log(items);

				// Enable CSS
				$("#thumbsContainer").enhanceWithin();
				// display pagination, if necessary
				displayPagination(page, FILES);

			} else {	// error; clear the div container
				$("#thumbsContainer").html("No photos");
			}

			hideLoading();
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr);
			console.log(ajaxOptions);
			console.log(thrownError);
		}
	});
}
function displayPagination(page, FILES) {
	// clear pagination
	$("#paginationTop").html("");
	$("#paginationBottom").html("");

	// set pagination, if necessary
	if (FILES.length > PHOTOSPERPAGE) {
		var html = "";
		var nexthtml = "";
		var last = lastPage();
		if (page > 1) {			// prev
			html = $("#paginationPrevHTML").text();
		}
		if (page < last) {	// next
			nexthtml = $("#paginationNextHTML").text();
		}

		// determine how many pages there are
		for (i = 1; i <= last; i++) {
			if (page == i) {
				itemhtml = $("#paginationItemDisabledHTML").text();
			} else {
				itemhtml = $("#paginationItemHTML").text();
			}
			itemhtml = itemhtml.replace(/@pageNum/g, i);
			itemhtml = itemhtml.replace(/@text/g, i);
			
			html += itemhtml;
		}
		html += nexthtml;

		// display pagination elements
		$("#paginationTop").html(html);
		$("#paginationBottom").html(html);
		// enable CSS
		$("#paginationTop").enhanceWithin();
		$("#paginationBottom").enhanceWithin();
	}
}
function lastPage() {
	var last = Math.ceil(CAMERAFILES.length / PHOTOSPERPAGE);
	return last;
}
function prepareDownload (fileNum, convertToJPG) {
	console.log("Preparing to download file: " + fileNum);
	displayLoading("Retrieving file from camera...");
	disableAllCameraFunctions();

	action = "prepareDownloadORI";
	if (convertToJPG) {
		action = "prepareDownloadJPG";
		displayLoading("Retrieving and converting image to JPG... Could take some time...");
	}

	$.ajax({
		url: "service.php?action=" + action + "&num=" + fileNum,
		dataType : "json",
		success: function(data){

			console.log(data);
			enableAllCameraFunctions();
			hideLoading();

			if (data.success) {
				// success; initiate download
				//console.log("INITIATE DOWNLOAD: " + data.filename);
				window.open(data.filename, "_blank");
			} else {
				setAlertOnPage("#alertContainer2", "danger", "Problem!", data.error);
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr);
			console.log(ajaxOptions);
			console.log(thrownError);

			hideLoading();
		}
	});
}


function takePicture(){

	disableAllCameraFunctions();
	displayLoading("Taking Photo...");

	$.ajax({
		url: "service.php?action=takePicture",
		dataType : "json",
		success: function(data){

			//console.log(data);
			enableAllCameraFunctions();
			hideLoading()

			if (data.success) {
				// success
			} else {
				setAlertOnPage("#alertContainer1", "danger", "Problem!", data.error);
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr);
			console.log(ajaxOptions);
			console.log(thrownError);
		}
	});
}



function displayLoading(myText) {
        $.mobile.loading( 'show', {
                text: myText,
                textVisible: true,
                theme: 'a'
        });
}
function hideLoading() {
	$.mobile.loading('hide');
}


function captureSettingChange ( setting, value ){
	disableAllCameraFunctions();
	displayLoading("Changing camera setting...");

	//console.log(setting);
	//console.log(value);

	$.ajax({
		url: "service.php?action=setCameraSetting&setting=" + setting + "&value=" + value,
		dataType : "json",
		success: function(data){

			//console.log(data);
			enableAllCameraFunctions();
			hideLoading()

			if ( ! data.success) {
				setAlertOnPage("#alertContainer3", "danger", "Problem!", data.error);
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr);
			console.log(ajaxOptions);
			console.log(thrownError);
		}
	});
}

function loadStorage() {
	$.ajax({
		url: "service.php?action=getRPIStorage",
		dataType : "json",
		success: function(data){

			//console.log(data);
			enableAllCameraFunctions();
			hideLoading();

			var text = "There is " + data.freeMB.toFixed(1) + "MB free of " + data.totalMB.toFixed(2) + "MB total storage";
			$("#piSettingsContainer").text( text );
		},
		error: function (xhr, ajaxOptions, thrownError) {
			enableAllCameraFunctions();
			hideLoading();

			console.log(xhr);
			console.log(ajaxOptions);
			console.log(thrownError);
		}
	});
}

function clearTempFiles() {
	displayLoading("Deleting temporary files on the RPi...");
	$.ajax({
		url: "service.php?action=clearTempFiles",
		dataType : "json",
		success: function(data){

			//console.log(data);
			hideLoading();

			if (data.success) {
				setPage3Alert("Successfully cleared files from RPi");
			} else {
				setAlertOnPage("#alertContainer3", "danger", "Problem!", data.error);
			}

			// refresh storage line
			loadStorage();
		},
		error: function (xhr, ajaxOptions, thrownError) {
			enableAllCameraFunctions();
			hideLoading();

			console.log(xhr);
			console.log(ajaxOptions);
			console.log(thrownError);
		}
	});
}

function downloadFromCamera( num ) {
	console.log("Delete: " + num);
}
