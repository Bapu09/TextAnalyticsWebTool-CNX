function populateDashboardData(dashboardInput) {
	if(dashboardInput.hasOwnProperty('card') && dashboardInput.card.length > 0) {
		jQuery('#card-holder-row').html('')
		dashboardInput.card.forEach(function(cardObj, index) {
			var customHtml = '<aside class="col-md-3">\
											<div class="panel panel-cs panel-bg-gradient '+cardObj['bg_class']+'">\
												<div class="panel-body">\
													<img src="./images/dashboard-circle-bg.svg" alt="Bg" class="card-img-absolute">\
													<h4 class="font-weight-normal mb-3">'+cardObj['title']+'<i class="fas fa-'+cardObj['icon_class']+' pull-right"></i></h4>\
													<h2 class="mb-5">'+cardObj['value']+'</h2>\
													<h6 class="card-text">'+cardObj['text']+'</h6>\
												</div>\
											</div>\
										</aside>';
			jQuery('#card-holder-row').append(customHtml)	
			
		});
	}
	if(dashboardInput.hasOwnProperty('pie')) {
		var customHtml =  '<aside class="col-md-4">\
											<div class="panel panel-cs">\
												<div class="panel-heading"><h5 class="panel-title text-center">'+dashboardInput['pie']['title']+'</h5></div>\
												<div class="panel-body">\
													<div id="3d-donut"></div>\
												</div>\
											</div>\
										</aside>';
		jQuery('#graph-row-1').append(customHtml);
		customHtml = undefined;
	}
	if(jQuery('#graph-row-1').length > 0) {
		jQuery('#graph-row-1').html('')
		if(dashboardInput.hasOwnProperty('pie')) {
			var customHtml =  '<aside class="col-md-4">\
												<div class="panel panel-cs">\
													<div class="panel-heading"><h5 class="panel-title text-center">'+dashboardInput['pie']['title']+'</h5></div>\
													<div class="panel-body">\
														<div id="3d-donut"></div>\
													</div>\
												</div>\
											</aside>';
			jQuery('#graph-row-1').append(customHtml);
			customHtml = undefined;
			// 3d Donut
			Highcharts.chart('3d-donut', {
				chart: {
					type: 'pie',
					options3d: {
						enabled: true,
						alpha: 45
					},
					height: '250px'
				},
				title: {
					text: ''
				},
				plotOptions: {
					pie: {
						innerSize: 50,
						depth: 50
					}
				},
				credits : false,
				series: dashboardInput['pie']['data']
			});
		}
		
		if(dashboardInput.hasOwnProperty('bar')) {
			var customHtml =  '<aside class="col-md-8">\
												<div class="panel panel-cs">\
													<div class="panel-heading"><h5 class="panel-title text-center">'+dashboardInput['bar']['title']+'</h5></div>\
													<div class="panel-body">\
														<div id="bar-chart-vertical"></div>\
													</div>\
												</div>\
											</aside>';
			jQuery('#graph-row-1').append(customHtml);
			customHtml = undefined;
			Highcharts.chart('bar-chart-vertical', {
				chart: {
					type: 'column',
					height: '250px'
				},
				title: {
					text: ''
				},
				xAxis: {
					categories: dashboardInput['bar']['x_axis_values'],
					crosshair: true
				},
				yAxis: {
					min: 0,
					title: {
						text: dashboardInput['bar']['y_axis_values']
					}
				},
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
					pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true
				},
				plotOptions: {
					column: {
						pointPadding: 0.2,
						borderWidth: 0
					}
				},
				credits : false,
				series: dashboardInput['bar']['data']
			});
		}
	}
	
	if(jQuery('#graph-row-2').length > 0) {
		jQuery('#graph-row-2').html('')
		if(dashboardInput.hasOwnProperty('stacked_bar')) {
			var customHtml =  '<aside class="col-md-6">\
												<div class="panel panel-cs">\
													<div class="panel-heading"><h5 class="panel-title text-center">'+dashboardInput['stacked_bar']['title']+'</h5></div>\
													<div class="panel-body">\
														<div id="stacked-bar-chart"></div>\
													</div>\
												</div>\
											</aside>';
			jQuery('#graph-row-2').append(customHtml);
			Highcharts.chart('stacked-bar-chart', {
				chart: {
					type: 'bar'
				},
				title: {
					text: ''
				},
				xAxis: {
					categories: dashboardInput['stacked_bar']['x_axis_values']
				},
				yAxis: {
					min: 0,
					title: {
						text: dashboardInput['stacked_bar']['y_axis_values']
					}
				},
				legend: {
					reversed: true
				},
				plotOptions: {
					series: {
						stacking: 'normal'
					}
				},
				credits : false,
				series: dashboardInput['stacked_bar']['data']
			});
		}
		
		if(dashboardInput.hasOwnProperty('area')) {
			var customHtml =  '<aside class="col-md-6">\
												<div class="panel panel-cs">\
													<div class="panel-heading"><h5 class="panel-title text-center">'+dashboardInput['area']['title']+'</h5></div>\
													<div class="panel-body">\
														<div id="area-chart"></div>\
													</div>\
												</div>\
											</aside>';
			jQuery('#graph-row-2').append(customHtml);
			//Area Chart
			Highcharts.chart('area-chart', {
				chart: {
					type: 'area'
				},
				accessibility: {
					description: ''
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				credits : false,
				xAxis: {
					allowDecimals: false,
					labels: {
						formatter: function () {
							return this.value; // clean, unformatted number for year
						}
					},
					accessibility: {
						rangeDescription: dashboardInput['area']['x_axis_values']
					}
				},
				yAxis: {
					title: {
						text: dashboardInput['area']['y_axis_values']
					},
					labels: {
						formatter: function () {
							return this.value / 1000 + 'k';
						}
					}
				},
				tooltip: {
					pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
				},
				plotOptions: {
					area: {
						pointStart: 1940,
						marker: {
							enabled: false,
							symbol: 'circle',
							radius: 2,
							states: {
								hover: {
									enabled: true
								}
							}
						}
					}
				},
				series: dashboardInput['area']['data']
			});
		}
	}
	
	if(jQuery('#graph-row-3').length > 0) {
		jQuery('#graph-row-3').html('')
		if(dashboardInput.hasOwnProperty('conditional_bar')) {
			var customHtml =  '<aside class="col-md-12">\
												<div class="panel panel-cs">\
													<div class="panel-heading"><h5 class="panel-title text-center">'+dashboardInput['conditional_bar']['title']+'</h5></div>\
													<div class="panel-body">\
														<div id="conditonal-color-bar"></div>\
													</div>\
												</div>\
											</aside>';
			jQuery('#graph-row-3').append(customHtml);
			
			//Bar Chart with Conditional COlor
			Highcharts.chart('conditonal-color-bar', {
				chart: {
					type: 'column'
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					type: 'category',
					labels: {
						rotation: -45,
						style: {
							fontSize: '13px',
							fontFamily: 'Verdana, sans-serif'
						}
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: dashboardInput['conditional_bar']['y_axis_values']
					}
				},
				legend: {
					enabled: false
				},
				tooltip: {
					pointFormat: 'Population in 2017: <b>{point.y:.1f} millions</b>'
				},
				credits : false,
				series: [{
					name: 'Population',
					data: dashboardInput['conditional_bar']['data'],
					dataLabels: {
						enabled: true,
						rotation: -90,
						color: '#FFFFFF',
						align: 'right',
						format: '{point.y:.1f}', // one decimal
						y: 10, // 10 pixels down from the top
						style: {
							fontSize: '13px',
							fontFamily: 'Verdana, sans-serif'
						}
					}
				}]
			});
		}
	}
}
function getColor(value) {
	if(value> 18) {
		return '#ff007f';
	} else if(value < 18 && value > 14) {
		return '#fe7096';
	} else if(value < 14 && value > 10) {
		return '#d400ff';
	} else if(value < 10) {
		return '#07cdae';
	}
}

var dashboardInput = {
	"card" : [
		{
			"title" : "Weekly Sales",
			"icon_class" : "chart-line",
			"value" : "$ 15,0000",
			"text" : "Increased by 60%",
			"bg_class" : "bg-gradient-danger"
		},{
			"title" : "Weekly Sales",
			"icon_class" : "chart-line",
			"value" : "$ 15,0000",
			"text" : "Increased by 60%",
			"bg_class" : "bg-gradient-info"
		},{
			"title" : "Weekly Sales",
			"icon_class" : "chart-line",
			"value" : "$ 15,0000",
			"text" : "Increased by 60%",
			"bg_class" : "bg-gradient-success"
		},{
			"title" : "Weekly Sales",
			"icon_class" : "chart-line",
			"value" : "$ 15,0000",
			"text" : "Increased by 60%",
			"bg_class" : "bg-gradient-purple"
		}
	],
	"pie" : {
		"title" : "Pie Chart",
		"data" : [{
			"name": "Delivered amount",
			"data" : [
				["Bananas", 8],
				["Kiwi", 3],
				["Mixed nuts", 1],
				["Oranges", 6],
				["Apples", 8],
				["Pears", 4],
				["Clementines", 4],
				["Reddish (bag)", 1],
				["Grapes (bunch)", 1]
			]
		}]
	},
	"bar" : {
		"title" : "Bar Chart",
		"x_axis_values" : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		"y_axis_values" : "Rainfall (mm)",
		"data" : [{
			"name" : "Tokyo",
			"data" : [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
			"color" : "#d400ff"

		}, {
			"name" : "New York",
			"data" : [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
			"color" : "#047edf"

		}, {
			"name" : "London",
			"data" : [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
			"color" : "#07cdae"

		}]
	},
	"stacked_bar" : {
		"title" : "Stacked Bar Chart",
		"x_axis_values" : ["Apples", "Oranges", "Pears", "Grapes", "Bananas"],
		"y_axis_values" : "Total fruit consumption",
		"data" : [{
			"name" : "John",
			"data" : [5, 3, 4, 7, 2],
			"color" : "#d400ff"
		}, {
			"name" : "Jane",
			"data" : [2, 2, 3, 2, 1],
			"color" : "#047edf"
		}, {
			"name" : "Joe",
			"data" : [3, 4, 4, 2, 5],
			"color" : "#07cdae"
		}]
	},
	"area" : {
		"title" : "Area Chart",
		"x_axis_values" : "Range: 1940 to 2017.",
		"y_axis_values" : "Nuclear weapon states",
		"data" : [{
			"name" : "USA",
			"data" : [
				null, null, null, null, null, 6, 11, 32, 110, 235,369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
				20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
				24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
				10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326, 5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
			],
			"color" : "#d400ff"
		}, {
			"name" : "USSR/Russia",
			"data" : [null, null, null, null, null, null, null, null, null, null,
				5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
				11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
				37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000, 21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
				12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
			],
			"color" : "#047edf"
		}]
	},
	"conditional_bar" : {
		"title" : "Conditional Bar Chart",
		"y_axis_values" : "Population (millions)",
		"data" : [
			{"name" : "Shanghai", "y" : 25.5,"color" : getColor(25.5)
			}, {"name" : "Beijing","y" : 19.6,"color" : getColor(19.6)
			}, {"name" : "Karachi","y" : 15.4,"color" : getColor(15.4)
			}, {"name" : "Buenos Aires","y" : 14.9,"color" : getColor(14.9)
			}, {"name" : "Istanbul","y" : 14.7,"color" : getColor(14.7)
			}, {"name" : "Mumbai","y" : 19.9,"color" : getColor(19.9)
			}, {"name" : "Moscow","y" : 12.4,"color" : getColor(12.4)
			}, {"name" : "São Paulo","y" : 21.6,"color" : getColor(21.6)
			}, {"name" : "Delhi","y" : 28.5,"color" : getColor(28.5)
			}, {"name" : "Chongqing","y" : 14.8,"color" : getColor(14.8)
			}, {"name" : "Osaka","y" : 19.2,"color" : getColor(19.2)
			}, {"name" : "Kolkata","y" : 14.6,"color" : getColor(14.6)
			}, {"name" : "Dhaka","y" : 19.5,"color" : getColor(19.5)
			}, {"name" : "Lagos","y" : 13.4,"color" : getColor(13.4)
			}, {"name" : "Manila","y" : 13.4,"color" : getColor(13.4)
			}, {"name" : "Bengaluru","y" : 11.4,"color" : getColor(11.4)
			}, {"name" : "Seoul","y" : 9.9,"color" : getColor(9.9)
			}, {"name" : "Cairo","y" : 20.0,"color" : getColor(20.0)
			}, {"name" : "Tokyo","y" : 37.4,"color" : getColor(37.4)
			}, {"name" : "Mexico","y" : 21.5,"color" : getColor(21.5)
			}, {"name" : "Hyderabad","y" : 9.4,"color" : getColor(9.4)
			}, {"name" : "London","y" : 9.0,"color" : getColor(9.0)
			}, {"name" : "Chicago","y" : 8.8,"color" : getColor(8.8)
			}
		]
	}
}
jQuery(function() {	
	populateDashboardData(dashboardInput);
})






        
        