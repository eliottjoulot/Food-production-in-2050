// ---------------- Javascript functions menu ---------------- //
// 
//
// function updateSSP();
//		SSP is the global variable that corresponds to the selected scenario by the user
//		This function updates this variable by the last one;
//
// function defaultSSP();
//		This function only put a default SSP when page loads.
//
// function displayInfo();
//		Update the information displayed in the placeholder below the map. 
//
// function mapCreate();
// 		Create the map. Should be call only once.
//
// function mapRemove();
//		Remove the source and layer of the map 
//
// functon mapRemoveLayerOnly():
//		Only removes the map layer
//
// function mapSourceAndLayer();
//		This function add source and layer to the map according to the data bind
//		This function is only called in mapData after binding the data file to the map
//		==> Has been divided into two separates functions : mapSource() and mapLayer()
//
// function mapInteract();
//		Contains all event which the user can interact with the map
//
// function onSSPchanged();
//		When the SSP is selected by the user, it updates the info and map.


// Global variables
var selectedSSP;	// The current model selected
var previousSSP;	// The previous model selected
var selectedOPTION;	// The scenario choosen
var map;			// The map where the data is displayed on

// Colors used for data
var color1 = {'calories': "rgba(255,255,123,0.1)", 'yields': "rgba(255,255,123,0.1)", "population": "rgba(255,255,123,0.1)"};
var color2 = {'calories': "rgba(200,255,102,0.6)", 'yields': "rgba(200,255,102,0.6)", "population": "rgba(255,200,102,0.6)"};
var color3 = {'calories': "rgba(177,255,20,0.6)",  'yields': "rgba(177,255,20,0.6)",  "population": "rgba(255,177,20,0.6)"};
var color4 = {'calories': "rgba(123,255,47,0.6)",  'yields': "rgba(123,255,47,0.6)",  "population": "rgba(255,123,47,0.6)"};
var color5 = {'calories': "rgba(100,230,50,0.6)",  'yields': "rgba(100,230,50,0.6)",  "population": "rgba(230,50,50,0.6)"};
var color6 = {'calories': "rgba(0,100,0,0.6)",	   'yields': "rgba(0,100,0,0.6)", 	  "population": "rgba(127,0,0,0.6)"};

const dataValues = {};
	
dataValues.caloriesMin = 4*10**11;
dataValues.caloriesMax = 1.1*10**14;

dataValues.yieldsMin = 8*10**8;
dataValues.yieldsMax = 3*10**10;

dataValues.populationMin = 0;
dataValues.populationMax = 145*10**3;


var isChrome = false;

const parameter_unit = {'calories': 'kcal/year', 
						'yields': 'kcal/ha',
						'population': '/px'};


function updateSSP(i) {

	selectedSSP = SCENARIO[i]['ssp'];

	/*
	if (document.getElementById("FormControlSelect").value == null) {
		console.log("		default")
		defaultSSP();
	}
	else {
		selectedSSP = document.getElementById("FormControlSelect").value;
	}
	console.log("updateSSP :" + selectedSSP; */
	//d3.select('selectedSSP').style("opacity", 1);
	
}

function defaultSSP() {
	selectedSSP = "SSP1";
	document.getElementById("ssp1").checked = true;
    //document.getElementById(selectedSSP).style.display = "inline";
	//$('.help-modal').modal('show');
}


function displayInfo() {
	if(previousSSP) {
		console.log('	previous :' + previousSSP);
		document.getElementById(previousSSP).style.display = "none";
	}
	//console.log("Display info : " + selectedSSP);
	document.getElementById(selectedSSP).style.display = "inline";
	previousSSP = selectedSSP;	
	addTitle();	
}

var iinc=0;
function addTitle() {

	var title = document.getElementById('title');
	
	for (i=0 ; i<SCENARIO.length ; i++) {
		if (SCENARIO[i]["ssp"] == previousSSP ) {
			title.innerHTML = SCENARIO[i]["name"] + " development : " + previousCheck + " in " + parameter_unit[previousCheck];
		}
	}
}

function showLegend() {
	// Adding legend to the map

	var legendDiv = document.createElement("div");
	legendDiv.className = "legend";

	var legendTitle = document.createElement("div");
	legendTitle.id = "legend_title";
	legendTitle.innerHTML = "Legend: ";

	var legendColors = document.createElement("div");
	legendColors.id = "legend_colors";
	legendColors.style.backgroundImage = "linear-gradient(to right,"+color1[previousCheck]+","+color2[previousCheck]+","+color3[previousCheck]+","+color4[previousCheck]+","+color5[previousCheck]+","+color6[previousCheck]+")";

	var legendValues = document.createElement("div");
	legendValues.className = "legend_values";

	var legendValueMin = document.createElement("div");
	legendValueMin.id = "legend_value_min";
	legendValueMin.innerHTML = "Min";

	var legendValueMax = document.createElement("div");
	legendValueMax.id = "legend_value_max";
	legendValueMax.innerHTML = "Max";

	legendValues.appendChild(legendValueMin);
	legendValues.appendChild(legendValueMax);


	legendDiv.appendChild(legendTitle);
	legendDiv.appendChild(legendColors);
	legendDiv.appendChild(legendValues);

	var elem = document.getElementById('map');
	elem.appendChild(legendDiv);
}

function updateLegend() {
	var legendColors = document.getElementById("legend_colors");
	legendColors.style.backgroundImage = "linear-gradient(to right,"+color1[previousCheck]+","+color2[previousCheck]+","+color3[previousCheck]+","+color4[previousCheck]+","+color5[previousCheck]+","+color6[previousCheck]+")";
}

function showLoading() {
	// Adding loading gif
	//console.log('	Adding loading gif');

	var loadingDiv = document.createElement("div");
	loadingDiv.id = "loading";
	loadingDiv.className = "divGif";

	var loadingImg = document.createElement("img");
	loadingImg.className = "loadingImg"
	loadingImg.src = "src/svg/earth-spinner.svg";

	var loadingTxt = document.createElement("p");
	loadingTxt.className = "loadingText";
	loadingTxt.innerHTML = "Loading...";

	loadingDiv.appendChild(loadingImg);
	loadingDiv.appendChild(loadingTxt);

	var elem = document.getElementById('map');
	elem.appendChild(loadingDiv);
}

function hideLoading() {
	// Create the map + add layer takes around 4sec
	setTimeout(function(){
		//console.log('	Removing loading gif');
    	document.getElementById("loading").remove();
	}, 4000);
	//document.getElementById("loading").remove();
}


function mapCreate() {
	console.log("Create map");
	mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpb3R0am91bG90IiwiYSI6ImNqb3BxbWNsNTA2OWszcWsyZmhyb2RwMmcifQ.8hum7VUmAlj4syS3GZwFLA';

	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/eliottjoulot/cjosk4zex021a2spdbg1k1zkq',
		center: [15, 30], // starting position
		zoom: 1, // starting zoom
		maxZoom: 7,
		minZoom: 1
	});
}

function mapRemove() {
	let clusterId = "clusters";
    let clusterLayer = map.getLayer(clusterId);
    if(typeof clusterLayer !== 'undefined') {
    	map.removeLayer(clusterId);
    }

    let circleId = "earthquakes-point";
    let circleLayer = map.getLayer(circleId);
    if(typeof circleLayer !== 'undefined') {
    	map.removeLayer(circleId);
    }

	let mapId = 'earthquakes';
	let mapLayer = map.getLayer(mapId);

    if(typeof mapLayer !== 'undefined') {
      // Remove map layer & source.
      map.removeLayer(mapId).removeSource(mapId);
    }
}

function mapRemoveLayerOnly() {
	let mapId = 'earthquakes';
	let mapLayer = map.getLayer(mapId);
    if(typeof mapLayer !== 'undefined') {
      	map.removeLayer(mapId);
    }

    let clusterId = "clusters";
    let clusterLayer = map.getLayer(clusterId);
    if(typeof clusterLayer !== 'undefined') {
    	map.removeLayer(clusterId);
    }

    let circleId = "earthquakes-point";
    let circleLayer = map.getLayer(circleId);
    if(typeof circleLayer !== 'undefined') {
    	map.removeLayer(circleId);
    }

}




// Display the data on the map as a layer
function mapSource() {
	
	let dataSelect = selectedSSP;
	console.log('New scenario: ' + selectedSSP.toLowerCase());

	// Fly to interesting location according to the selected model
	map.flyTo({
        center: [85, 20],
		zoom: 4
    });
	

	// Add source
	map.addSource("earthquakes", {
		type: "geojson",
		data: "data_" + dataSelect.toLowerCase() + ".geojson",
		//data: _data,
		cluster: false, // Set to true to sow clusters of points
		clusterMaxZoom: 6, // Max zoom to cluster points on
		clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
	});

	console.log('Data file ==> ' + "data_" + dataSelect.toLowerCase() + ".geojson");
}

function mapLayer(subData) {

	if (typeof(subData)==='undefined') subData = "calories";
	//console.log("	subData :" + subData + " : min and max " + dataValues[subData + "Min"] + " " + dataValues[subData + "Max"]);

	var minValue = document.getElementById('legend_value_min');
	var maxValue = document.getElementById('legend_value_max');


	var legendTitle = document.getElementById("legend_title");
	legendTitle.innerHTML = "Legend : " + parameter_unit[subData];


	if(subData == "calories" || subData == "yields") {
		minValue.innerHTML = Math.round(dataValues[subData + "Min"]/10**3).toLocaleString();
		maxValue.innerHTML = Math.round(dataValues[subData + "Max"]/10**3).toLocaleString();
	}
	else if(subData == "population") {
		minValue.innerHTML = dataValues[subData + "Min"].toLocaleString();
		maxValue.innerHTML = Math.round(dataValues[subData + "Max"]).toLocaleString();
	}

	// Add layer
	map.addLayer({
		"id": "earthquakes",
		"type": "heatmap",
		"source": "earthquakes",
		"maxzoom": 10,
		"paint": {
			// Increase the heatmap weight based on frequency and property magnitude
			"heatmap-weight": [
				"interpolate",
				["linear"],
				["get", subData],
				dataValues[subData + 'Min'], 0,
				2*dataValues[subData + 'Max'], 1
			],
			// Increase the heatmap color weight weight by zoom level
			// heatmap-intensity is a multiplier on top of heatmap-weight
			"heatmap-intensity": [
				"interpolate",
				["linear"],
				["zoom"],
				0, 1,
				8, 15
			],
			// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
			// Begin color ramp at 0-stop with a 0-transparancy color
			// to create a blur-like effect.
			"heatmap-color": [
				"interpolate",
				["linear"],
				["heatmap-density"],
				0, color1[subData],
				0.2, color2[subData],
				0.4, color3[subData],
				0.6, color4[subData],
				0.8, color5[subData],
				1, color6[subData]
			],
			// Adjust the heatmap radius by zoom level
			"heatmap-radius": [
				"interpolate",
				["linear"],
				["zoom"],
				0, 2,
				8, 30
			],
			// Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5, 1,
                6, 0
            ],
		}
	});
	map.addLayer({
        id: "clusters",
        type: "circle",
		source: "earthquakes",
		minzoom: 1,
        filter: ["has", "point_count"],
        paint: {
            "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
            ]
		},
		"circle-radius": [
			"step",
			["get", "point_count"],
			20,
			100,
			30,
			750,
			40
		],
		// Transition from heatmap to circle layer by zoom level
		"circle-opacity": [
			"interpolate",
			["linear"],
			["zoom"],
			3, 0,
			5, 1
		]
    });
	map.addLayer({
        "id": "earthquakes-point",
        "type": "circle",
        "source": "earthquakes",
        "minzoom": 1,
        "paint": {
            // Size circle radius by earthquake magnitude and zoom level
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5, [
                    "interpolate",
                    ["linear"],
                    ["get", subData],
                    dataValues[subData + 'Min'], 1,
                    dataValues[subData + 'Max'], 10
                ],
                7, [
                    "interpolate",
                    ["linear"],
                    ["get", subData],
					dataValues[subData + 'Min'], 5,
                    dataValues[subData + 'Max'], 30
                ]
			],

			// Color circle by earthquake magnitude
            "circle-color": [
                "interpolate",
                ["linear"],
                ["get", subData],
                dataValues[subData + 'Min'], color1[subData],
                (dataValues[subData + 'Min'] + dataValues[subData + 'Max'])/2, color4[subData],
                dataValues[subData + 'Max'], color6[subData]
            ],
            // Transition from heatmap to circle layer by zoom level
            "circle-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5, 0,
                7, 1
            ]
        }
    });
	
	// When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'earthquakes', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;


        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

}

function mapInteract() {

	// When a click event occurs on a feature in the points layer, open a popup at the
    // location of the point, with description HTML from its properties.
    map.on('click', 'earthquakes-point', function (e) {
		var coordinates = e.features[0].geometry.coordinates.slice();
		
		console.log("Point selected: ", e.features[0].properties);

		// Retrieving information of the selected point
		var calories =  Math.round(e.features[0].properties.calories/10**3);
		calories = calories.toLocaleString();
		
		var population = Math.round(e.features[0].properties.population);
		population = population.toLocaleString();
		
		var yields = Math.round(e.features[0].properties.yields/10**3);
		yields = yields.toLocaleString();

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
		}

		var checkboxes = document.getElementsByClassName("form-check-input");
		for(let i=0; i<checkboxes.length;i++){
			if (checkboxes[i].checked) {
				subitem = checkboxes[i].value;
			}
		}
		
		// Creating the popup
		var popupDiv = document.createElement("div");
		popupDiv.className = "popup";
		
		var popupTitle = document.createElement("h5");
		popupTitle.className = "popup_title";
		popupTitle.innerHTML = subitem;

		var popupValue = document.createElement("p");
		popupValue.className = "popup_value";
		
		if (subitem == "calories") {
			popupValue.innerHTML = calories + " " +parameter_unit[subitem];
		}
		else if (subitem == "yields") {
			popupValue.innerHTML = yields + " " +parameter_unit[subitem];
		}
		else if (subitem == "population") {
			popupValue.innerHTML = population + " " +parameter_unit[subitem];
		}

		popupDiv.appendChild(popupTitle);
		popupDiv.appendChild(popupValue);
		

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupDiv.innerHTML)
            .addTo(map);
    });


	map.on('mouseenter', 'earthquakes-point', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'earthquakes-point', function () {
		map.getCanvas().style.cursor = '';
	});
	
	// Search box
	map.addControl(new MapboxGeocoder({
		accessToken: mapboxgl.accessToken
	}), 'top-left');

	// Add geolocate control to the map.
	map.addControl(new mapboxgl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true
		},
		trackUserLocation: true
	}), 'top-left');

	// Add zoom and rotation controls to the map.
	//map.addControl(new mapboxgl.NavigationControl(), 'top-left');

	// Full-screen toggle
	map.addControl(new mapboxgl.FullscreenControl());
}



function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);

	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	sessionStorageDetect();
	chromeDetect();
	// Set the SSP scenario to the default one.
	defaultSSP();
	// Create the map
	mapCreate();
	// Sow legend
	showLegend();
	// Sow loading animation
	showLoading();
	// Bind the default scenario data to the map and add sourcer/layer
	map.on('load', function () {
		mapSource();
		mapLayer();

	});
	hideLoading();
	
	// Update the placeholder below the map
	displayInfo();
	// Allow interactions
	mapInteract();
	//localStorage.setItem(selectedSSP, "geo_calories_filtered_" + dataSelect + "cc.geojson");
	console.log("End onload");

	const plot = new ScatterPlot('svg_menu', SCENARIO);

	let c = d3.select('circle').style('opacity','1');
		
});


function onSSPchanged(i) {
	updateSSP(i);
	if(previousSSP != selectedSSP) {
		// Sow loading animation
		showLoading();
		// Update the scenario

		// Remove previous map source and layer bind to the previous scenario
		mapRemove();
		// Add the new source
		mapSource();

		// Keep the same parameter for the previous model (ie : population, temperature, ..)
		mapLayer(previousCheck);

		// Hidd the loading gif 
		hideLoading();
		//Update the info placeholder below the map
		displayInfo();
	}
	else {
		console.log('Do not update, clic on same circle');
	}

	previousSSP = selectedSSP;
	//console.log("");
}





///////////////////////////////////////////////

/*
function isDataCache() {
	// Is the data is the cache ?
	if (sessionStorage.getItem(selectedSSP.toLowerCase() + "_save") == undefined) {
		// If not we save it in
		sessionStorage[selectedSSP.toLowerCase() + "_save"] = JSON.stringify("_" + selectedSSP.toLowerCase() + ".geojson");
		//sessionStorage.setItem(selectedSSP.toLowerCase() + "_data", "_" + selectedSSP.toLowerCase() + ".geojson" );
		return false;	
	}
	else {
		return true;
	}
}*/


function chromeDetect() { 
	//Detect if the user is using chrome
	if(navigator.userAgent.indexOf("Chrome") != -1 ) {
		//alert('Chrome');
		isChrome = true;
	}
}

function sessionStorageDetect() { 
	//Detect if the user has already been on the page before
	if(sessionStorage.getItem("popup") != "seen") {
		$('.help-modal').modal('show');
		sessionStorage.setItem("popup","seen");
	}
}

// Use to have the space available to store some data for the session
var getLocalStorageSize = function() {
    var total = 0;
    for (var x in sessionStorage ) {

        // Value is multiplied by 2 due to data being stored in `utf-16` format, which requires twice the space.
        var amount = (sessionStorage[x].length * 2) / 1024 / 1024;
        if (!isNaN(parseFloat(amount))) {
        	console.log(x + ": " + amount);
        	total += amount;
    	}
    }
    console.log("Total amount of disk space used (in MB) : " + total.toFixed(2) + " over 5MB");
    //return total.toFixed(2);
};




///////////////////////////////////////////////


// Below we are looking at the event onclik for a checkboxes and update the layer's map depending on the parameter selected.
var checkboxes = document.getElementsByClassName("form-check-input");
// By default, the parameter is calories
var previousCheck = "calories";

for(let i=0; i<checkboxes.length;i++){

    checkboxes[i].onclick=function(){
    	// Do not update if the user clic on the same checkbox
    	if (checkboxes[i].checked && checkboxes[i].value != previousCheck) {  	
      		console.log("Update the map with : " + checkboxes[i].value);
      		mapRemoveLayerOnly();
      		mapLayer(checkboxes[i].value);
      		previousCheck = checkboxes[i].value;
      		// Sow legend
			//showLegend();
			updateLegend();
      		addTitle();
      } 
    };
}


///////////////////////////////////////////////

const MARGIN = { top: 5, right: 5, bottom: 5, left: 5 };


const SCENARIO = [{'x': 40,  'y': 65,'name' :'Sustainability', 'ssp':'SSP1'},
				  {'x': 125, 'y': 65,'name' :'Inequality',	   'ssp':'SSP4'},
				  {'x': 210, 'y': 65,'name' :'Fossil',         'ssp':'SSP5'}];
				 
//const SCENARIO_COLORS = ["rgb(51, 204, 51)","rgb(255, 153, 51)","rgb(230, 46, 0)"];



class ScatterPlot {

	constructor (id, data) {

		let svg = d3.select('#'+id);
		let svgHeight = parseInt(svg.style("height"));
		let svgWidth = parseInt(svg.style("width"));

		let gradient1 = svg.append('linearGradient')
			.attr('id', 'gradient1');
		let gradient2 = svg.append('linearGradient')
			.attr('id', 'gradient2');
		let gradient3 = svg.append('linearGradient')
			.attr('id', 'gradient3');
				
		// Creating thhe three gradients used to fill the three models
		gradient1.append('stop')
			.attr('class', 'stop-left1')
			.attr('offset', '0');
		gradient1.append('stop')
			.attr('class', 'stop-right1')
			.attr('offset', '1');

		gradient2.append('stop')
			.attr('class', 'stop-left2')
			.attr('offset', '0');
		gradient2.append('stop')
			.attr('class', 'stop-right2')
			.attr('offset', '1');

		gradient3.append('stop')
			.attr('class', 'stop-left3')
			.attr('offset', '0');
		gradient3.append('stop')
			.attr('class', 'stop-right3')
			.attr('offset', '1');
		

		//console.log(svgHeight +" "+svgWidth);

		var scaleY = d3.scaleLinear()
								.domain([0, 100])
								.range([svgHeight - MARGIN['top'], MARGIN['top']]);

		var scaleX = d3.scaleLinear()
								.domain([0, 300])
								.range([MARGIN['bottom'], svgWidth - MARGIN['bottom']]);


	 	let group = svg.selectAll("group")
						.data(data)
						.enter()
							.append('g')
							.attr('transform', (d,i) => "translate("+scaleX(d['x']) + "," + scaleY(d['y']) + ")" )

		group.append('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr("class", (d,i) => 'filled'+(i+1))
				.on('click',function(d,i) { 
					// Opacity all circle
					d3.selectAll('circle').style('opacity',0.6);
					// Light the select one
			 		d3.select(this).style("opacity", 1);
					// Update map layer
					onSSPchanged(i);
				})
				.attr("r", 45)

		group.append('text')
			  	.text((d,i) => d['name'])
			  	.attr('class', 'circle_text')	
			
					
	//line              
	svg.append("line")
	  .attr("x1", 0)
	  .attr("y1", 105)
	  .attr("x2", svgWidth-20)
	  .attr("y2", 105)          
	  .attr("stroke-width", 1)
	  .attr("stroke", "black")
	  .attr("marker-end", "url(#triangle)");

	svg.append("svg:defs").append("svg:marker")
	    .attr("id", "triangle")
	    .attr("refX", 5)
	    .attr("refY", 5)
	    .attr("markerWidth", 20)
	    .attr("markerHeight", 20)
	    .attr("orient", "auto")
	    .append("path")
	    .attr("d", "M 0 0 10 5 0 10 0 5")
	    .style("fill", "black");

	svg.append('text')
			.attr('x',0)
			.attr('y',120)
			.attr('class','legend_txt')
			.text('Socio-economic challenges');

	}
}




