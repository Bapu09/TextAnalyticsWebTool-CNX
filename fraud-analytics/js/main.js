var metrices = ["Metric One", "Metric Two", "Metric Three", "Metric Four", "Metric Five"];
var optionHtml = '<option value="">Choose Metrics</option>';
metrices.forEach(function(item, index) {
	optionHtml += '<option value="'+item.toLowerCase().split(' ').join('_')+'">'+item+'</option>';
});
jQuery(function() {
	jQuery('#start-demo').on('click', function() {
		jQuery('#landing-section').fadeOut('slow').addClass('hide');
		jQuery('#demo-section').fadeIn('slow').removeClass('hide');
	});
	
	jQuery('.upload-tab #upload-file').on('click', function() {
		console.log("uploading To Server");
		jQuery('#tab-section #input, #tab-section #metrics').attr('disabled', false);
		jQuery('#tab-section label[for="input"], #tab-section label[for="metrics"]').removeClass('disabled');
		if(typeof metrices != undefined && metrices.length > 0 ) {
			console.log("Metrics Found");
			metrices.forEach(function(item, index) {
				var metricsRowHtml = '<li class="list-group-item">\
									<div class="metrics-row-wrapper">\
										<span class="col-md-2">\
											<span class="checkbox">';
				metricsRowHtml += '<label class="fas fa-2x fa-check-square" id="metrics-'+item.split(' ').join('_')+'"> \
													<input type="checkbox" for="metrics-'+item.split(' ').join('_')+'">\
												</label>';
				metricsRowHtml += '</span>\
										</span>\
										<span class="col-md-4">';
				metricsRowHtml += '<input type="text" name="'+item.split(' ').join('_')+'_value" class="form-control" />';
				metricsRowHtml += '</span>\
										<span class="col-md-6">';
				metricsRowHtml += '<select name="'+item.split(' ').join('_')+'_selected" class="form-control">'+optionHtml+'</select>';
				metricsRowHtml += '</span>\
									</div>\
								  </li>';
				jQuery('.metrics-tab .list-group').append(metricsRowHtml);						
			});
			metricCheckboxEventListener();
		}
	});
	
	
	
})

function metricCheckboxEventListener() {
	jQuery('.metrics-tab .list-group .checkbox label').on('click', function() {
		console.log('Check Box Clicked');
		if(jQuery(this).find('input[type="checkbox"]').is(':checked') == true) {
			jQuery(this).addClass('checked');
			jQuery(this).parents('.list-group-item').addClass('selected')
		} else {
			jQuery(this).removeClass('checked');
			jQuery(this).parents('.list-group-item').removeClass('selected')
		}
	})
}