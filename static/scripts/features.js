jQuery(function() {
	jQuery('#back-to-landing').on('click', function() {
		jQuery('#feature-page').fadeOut('slow').addClass('d-none');
		jQuery('#landing-page').fadeIn('slow').removeClass('d-none');
	});
	
	jQuery('#landing-page .card-body .btn-cs').on('click', function() {
		var target = jQuery(this).data('target');
		if(jQuery(target).length > 0) {
			jQuery('#landing-page').fadeOut('slow').addClass('d-none');
			jQuery(target).fadeIn('slow').removeClass('d-none')
		} else {
			alert('Page Not Available');
		}
	});
	
	jQuery('#feature-page .input-type').on('change', function() {
		console.log("Input Type Changed");
		var currentTab = jQuery(this).parents('form');
		if(jQuery(this).val() == 'excel' || jQuery(this).val() == 'csv' || jQuery(this).val() == 'textfile') {
			currentTab.find('#file-input').fadeIn('slow').removeClass('d-none');
			currentTab.find('#text-input').fadeOut('slow').addClass('d-none');
		} else {
			currentTab.find('#text-input').fadeIn('slow').removeClass('d-none');
			currentTab.find('#file-input').fadeOut('slow').addClass('d-none');
		}
	});
	
	jQuery('.submit-action').on('click', function() {
		console.log("Submit Action Clicked");
		jQuery('#output-div').find('table').addClass('d-none');
		jQuery('#output-div').find('div').addClass('d-none');
		var currentForm = jQuery(this).parents('form');
		var inputType = currentForm.find('.input-type');
		var allowedFileTypes  = ['txt', 'csv', 'xlsx', 'xls']
		if(inputType.length > 0) {
			if(inputType.val() == 'manual') {
				var text = currentForm.find('textarea').val();
				jQuery('#text-output').html(text);
				jQuery('#text-output').fadeIn('slow').removeClass('d-none');
			} else {
				var file = currentForm.find('.custom-file-input')[0].files[0];
				var filename = file.name,
				extension = filename.split('.')[1];
				if(allowedFileTypes.indexOf(extension) !== -1) {
					if(file.size <= 200000 ) {
						console.log("Input Type : "+inputType.val());
						console.log('File Size : '+file.size)
						if(extension == 'csv') {
							console.log('Path : '+file.mozFullPath);
							processCSVData(file);
						}
						if(extension == 'xlsx' || extension == 'xls') {
							processFile(file);
						}
						
					} else {
						alert('File size shouldnot be more than 20 MB. For processing of large file size contact "example@abc.com"')
						return;
					}
				} else {
					alert ("Only Excel, CSV and Text file are allowed");
					return;
				}
				
			}
		}
	});
	
	$('.nav-item a').on('hide.bs.tab', function(e){
		jQuery('#output-div').find('table').addClass('d-none');
		jQuery('#output-div').find('div').addClass('d-none');
	});
})

function processFile(file) {
	var filename = file.name,
		extension = filename.split('.')[1]; 
	console.log("File Name : "+filename);
	console.log("File Extension : "+extension);
	/*Checks whether the file is a valid excel file*/  
	if (extension == 'xlsx' || extension == 'xls') {  
		var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
		var rABS = true;
		if (extension == "xlsx") {  
			xlsxflag = true;  
			console.log("New File Format");
		}  
		/*Checks whether the browser supports HTML5*/  
		if (typeof (FileReader) != "undefined") {  
			var reader = new FileReader();  
			reader.onload = function (e) {  
				var data = e.target.result;  
				/*Converts the excel data in to object*/  
				if (xlsxflag) {  
					console.log('New File Format')
					var workbook = XLSX.read(data,  { type: rABS ? 'binary' : 'array'});
				} else {  
					console.log('Old File Format')
					var workbook = XLS.read(data, { type: 'binary' });  
				}  
				/*Gets all the sheetnames of excel in to a variable*/  
				var sheet_name_list = workbook.SheetNames;  

				var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/  
				sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
					/*Convert the cell value to Json*/  
					if (xlsxflag) {  
						var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y], {header:1});
					}  
					else {  
						var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);  
					}  
					if (exceljson.length > 0 && cnt == 0) {  
						console.log('Clearing Table')
						jQuery('#exceltable').html('');
						console.log("Binding Data To Table");
						BindTable(exceljson, '#exceltable');
						
						cnt++;  
					}  
				});  
				$('#exceltable').fadeIn('slow').removeClass('d-none');  
			}
			if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
				var buffer = reader.readAsArrayBuffer(file);  
				console.log('BUffer : '+buffer);
			} else {  
				reader.readAsBinaryString(file);  
			}  
		} else {  
			alert("Sorry! Your browser does not support HTML5!");  
		}  
	} else {  
		alert("Please upload a valid Excel file!");  
	}  
	
}

function BindTable(jsondata, tableid) {/*Function used to convert the JSON array to Html Table*/  
	var columns = BindTableHeader(jsondata, tableid); /*Gets all the column headings of Excel*/  
	for (var i = 0; i < jsondata.length; i++) {  
		var row$ = $('<tr/>');  
		for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
		 var cellValue = jsondata[i][columns[colIndex]];  
		 if (cellValue == null)  
			 cellValue = "";  
		 row$.append($('<td/>').html(cellValue));  
		}  
		$(tableid).append(row$);  
	}  
 }  
 function BindTableHeader(jsondata, tableid) {/*Function used to get all column names from JSON and bind the html table header*/  
     var columnSet = [];  
     var headerTr$ = $('<tr/>');  
     for (var i = 0; i < jsondata.length; i++) {  
         var rowHash = jsondata[i];  
         for (var key in rowHash) {  
             if (rowHash.hasOwnProperty(key)) {  
                 if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/  
                     columnSet.push(key);  
                     headerTr$.append($('<th/>').html(key));  
                 }  
             }  
         }  
     }  
     $(tableid).append(headerTr$);  
     return columnSet;  
 } 
 
 function processCSVData(file) {
    if (typeof (FileReader) != "undefined") {
		var reader = new FileReader();
		reader.onload = function (e) {
			var table = document.getElementById("exceltable");
			var rows = e.target.result.split("\n");
			for (var i = 0; i < rows.length; i++) {
				var cells = rows[i].split(",");
				if (cells.length > 1) {
					var row = table.insertRow(-1);
					for (var j = 0; j < cells.length; j++) {
						var cell = row.insertCell(-1);
						cell.innerHTML = cells[j];
					}
				}
			}
		}
		reader.readAsText(file);
		$('#exceltable').fadeIn('slow').removeClass('d-none');
	} else {
		alert("This browser does not support HTML5.");
	}
}