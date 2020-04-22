$.fn.gauge = function(opts) {
  this.each(function() {
    var $this = $(this),
        data = $this.data();

    if (data.gauge) {
      data.gauge.stop();
      delete data.gauge;
    }
    if (opts !== false) {
      data.gauge = new Gauge(this).setOptions(opts);
    }
  });
  return this;
};
jQuery(function() {
	jQuery('#back-to-landing').on('click', function() {
		jQuery('#feature-page').fadeOut('slow').addClass('d-none');
		jQuery('#landing-page').fadeIn('slow').removeClass('d-none');
		jQuery('#output-div').addClass('d-none');
		jQuery('#output-div').find('table').addClass('d-none');
		jQuery('#analysis-output').addClass('d-none');
	});
	
	jQuery('#landing-page .card-body .btn-cs').on('click', function() {
		var target = jQuery(this).data('target');
		if(jQuery(target).length > 0) {
			jQuery('#landing-page').fadeOut('slow').addClass('d-none');
			jQuery(target).fadeIn('slow').removeClass('d-none');
			jQuery(target).find('.nav-item a:first-child')[0].click();
		} else {
			alert('Page Not Available');
		}
	});
	
	jQuery('#feature-page .input-type').on('change', function() {
		console.log("Input Type Changed");
		var currentTab = jQuery(this).parents('form');
		if(jQuery(this).val() == 'excel' ) {
			currentTab.find('#file-input').fadeIn('slow').removeClass('d-none');
			currentTab.find('#text-input').fadeOut('slow').addClass('d-none');
		} else if(jQuery(this).val() == 'repo') {
			currentForm.find(".repo-input").fadeIn('slow').removeClass('d-none');
		} else {
			currentTab.find('#text-input').fadeIn('slow').removeClass('d-none');
			currentTab.find('#file-input').fadeOut('slow').addClass('d-none');
		}
	});
	
	jQuery('.submit-action').on('click', function() {
		jQuery('#analysis-output').addClass('d-none');
		console.log("Output is hidden");
		jQuery('#exceltable').addClass('d-none');
		jQuery('#text-output').addClass('d-none');
		var currentForm = jQuery(this).parents('form');
		var inputType = currentForm.find('.input-type');
		var allowedFileTypes  = ['xlsx', 'xls']
		if(inputType.length > 0) {
			if(inputType.val() == 'manual') {
				var text = currentForm.find('textarea').val();
				jQuery('#text-output').html(text);
				jQuery('#text-output').fadeIn('slow').removeClass('d-none');
				jQuery('.show-input').fadeIn('slow').removeClass('d-none');
			} else if(inputType.val() == 'repo') {
				console.log("Input Type : "+inputType.val())
				console.log("Repo length : "+currentForm.find(".repo-input").length)
				currentForm.find(".repo-input").fadeIn('slow').removeClass('d-none');
			} else {
				var file = currentForm.find('.custom-file-input')[0].files[0];
				var filename = file.name,
				extension = filename.split('.')[1];
				if(allowedFileTypes.indexOf(extension) !== -1) {
					/*if(file.size <= 200000 ) {
						if(extension == 'csv') {
							console.log('Path : '+file.mozFullPath);
							processCSVData(file);
						}*/
						if(extension == 'xlsx' || extension == 'xls') {
							processFile(file);
							jQuery('.show-input').fadeIn('slow').removeClass('d-none');
						}
					/*} else {
						alert('File size shouldnot be more than 20 MB. For processing of large file size contact "example@abc.com"')
						return;
					}*/
				} else {
					alert ("Only Excel files are allowed");
					return;
				}
			}
			jQuery('#output-div').removeClass('d-none');
			jQuery('#analysis-output').removeClass('d-none');
			jQuery('#analysis-output canvas').removeClass('d-none')
			initiateGaugeJS(1350, 3000, 'sentimate');
		}
	});
	
	$('.nav-item a').on('hide.bs.tab', function(e){
		jQuery('#analysis-output').addClass('d-none');
		jQuery('#exceltable').addClass('d-none');
		jQuery('#text-output').addClass('d-none');
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
						jQuery('#exceltable').html('');
						BindTable(exceljson, '#exceltable');
						
						cnt++;  
					}  
				});  
				$('#exceltable').fadeIn('slow').removeClass('d-none');  
			}
			if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
				var buffer = reader.readAsArrayBuffer(file);  
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

function initiateGaugeJS(value, maxValue, tab) {
	switch(tab) {
		case "sentimate" :
			var opts = {
				angle: -0.28, // The span of the gauge arc
				lineWidth: 0.16, // The line thickness
				radiusScale: 1, // Relative radius
				pointer: {
					length: 0.48, // // Relative to gauge radius
					strokeWidth: 0.09, // The thickness
					color: '#000000' // Fill color
				},
				limitMax: false,     // If false, max value increases automatically if value > maxValue
				limitMin: false,     // If true, the min value of the gauge will be fixed

				highDpiSupport: true,     // High resolution support
				staticZones: [
				   {strokeStyle: "#30B32D", min: 0, max: 60}, // Green from 100 to 130
				   {strokeStyle: "#FFDD00", min: 60, max: 72}, // Yellow
				   {strokeStyle: "#F03E3E", min: 72, max: 100}, // Red

				],

			};			
			demoGauge = new Gauge(document.getElementById("canvas-preview")).setOptions(opts);
			demoGauge.maxValue = 100;
			demoGauge.setMinValue(0)
			demoGauge.animationSpeed = 32
			demoGauge.set(60);	
			jQuery('#preview-textfield').html('<span class="col-md-4"><span class="analysis-text bg-green">60% Positive</span></span><span class="col-md-4"><span class="analysis-text bg-yellow">12% Neutral</span></span><span class="col-md-4"><span class="analysis-text bg-red">28% Negative<span></span>')
			break;
	}
}