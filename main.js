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
var color1 = "rgba(255,228,181,0)";
var color2 = "rgba(140,221,89,0.5)";
var color3 = "rgba(84,192,49,0.5)";
var color4 = "rgba(43,162,22,0.5)";
var color5 = "rgba(31,131,4,0.5)";
var color6 = "rgba(20,120,20,0.6)";

const dataValues = {};
	
dataValues.caloriesMin = 4.31*10**11;
dataValues.caloriesMax = 1.11*10**14;

dataValues.croplandMin = 90;
dataValues.croplandMax = 8600;

dataValues.populationMin = 40;
dataValues.populationMax = 145*10**3;

dataValues.temperatureMin = 3.60*10**9;
dataValues.temperatureMax = 2*10**10;

//dataValues.
console.log(dataValues);


function updateSSP() {
	if (document.getElementById("FormControlSelect").value == null) {
		console.log("		default")
		defaultSSP();
	}
	else {
		selectedSSP = document.getElementById("FormControlSelect").value;
	}
	console.log("updateSSP :" + selectedSSP);
}

function defaultSSP() {
	selectedSSP = "SSP1";
	document.getElementById("exampleRadios1").checked = true;
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
}

function showLegend() {
	// Adding legend to the map

	var legendDiv = document.createElement("div");
	legendDiv.className = "legend";

	var legendTitle = document.createElement("div");
	legendTitle.className = "legend_title";
	legendTitle.innerHTML = "Legend:";

	var legendColors = document.createElement("div");
	legendColors.className = "legend_colors";
	legendColors.style.backgroundImage = "linear-gradient(to right,"+color1+","+color2+","+color3+","+color4+","+color5+","+color6+")";

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

function showLoading() {
	// Adding loading gif
	console.log('	Adding loading gif');

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
		console.log('	Removing loading gif');
    	document.getElementById("loading").remove();
	}, 4500);
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
	//console.log("Data file : geo_calories_filtered_" + dataSelect + "cc.geojson");

	// Add source
	map.addSource("earthquakes", {
		type: "geojson",
		// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
		// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
		data: "final" + dataSelect + ".geojson",
		//data: "geo_calories_filtered_" + dataSelect + "cc.geojson",
		cluster: false, // Set to true to sow clusters of points
		clusterMaxZoom: 6, // Max zoom to cluster points on
		clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
	});
}

function mapLayer(subData) {

	if (typeof(subData)==='undefined') subData = "calories";
	console.log("	subData :" + subData);
	console.log("	min and max " + dataValues[subData + "Min"] + " " + dataValues[subData + "Max"]);

	var minValue = document.getElementById('legend_value_min');
	//minValue.innerHTML = dataValues[subData + "Min"];
	var maxValue = document.getElementById('legend_value_max');
	//maxValue.innerHTML = dataValues[subData + "Max"];
	//str.match(/.{1,3}/g)

	if(subData == "calories" || subData == "temperature") {
		minValue.innerHTML = Math.round(dataValues[subData + "Min"]/10**3).toLocaleString();
		maxValue.innerHTML = Math.round(dataValues[subData + "Max"]/10**3).toLocaleString();
	}
	else if(subData == "cropland") {
		minValue.innerHTML = 0;
		maxValue.innerHTML = 100;
	}
	else if(subData == "population") {
		minValue.innerHTML = dataValues[subData + "Min"].toLocaleString();
		maxValue.innerHTML = dataValues[subData + "Max"].toLocaleString();
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
				0, "rgba(255,228,181,0)",
				0.2, "rgba(140,221,89,0.5)",
				0.4, "rgba(84,192,49,0.5)",
				0.6, "rgba(43,162,22,0.5)",
				0.8, "rgba(31,131,4,0.5)",
				1, "rgba(20,120,20,0.6)"
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
                dataValues[subData + 'Min'], "rgba(250,250,250,0.1)",
                (dataValues[subData + 'Min'] + dataValues[subData + 'Max'])/2, "rgba(43,162,22,0.5)",
                dataValues[subData + 'Max'], "rgba(20,120,20,0.6)"
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
		var cropland = Math.round(100*e.features[0].properties.cropland/dataValues.croplandMax);
		var population = Math.round(e.features[0].properties.population);
		population = population.toLocaleString();
		var temperature = Math.round(e.features[0].properties.temperature/10**3);
		temperature = temperature.toLocaleString();

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
		if (subitem == "calories"){
			popupValue.innerHTML = calories;}
		else if (subitem == "cropland"){
			popupValue.innerHTML = cropland;}
		else if (subitem == "temperature"){
			popupValue.innerHTML = temperature;}
		else if (subitem == "population"){
			popupValue.innerHTML = population;}

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

	// Add zoom and rotation controls to the map.
	map.addControl(new mapboxgl.NavigationControl(), 'top-left');

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
});


function onSSPchanged() {
	// Sow loading animation
	showLoading();
	// Update the scenario
	updateSSP();
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
	console.log("");
}





///////////////////////////////////////////////


function chromeDetect() { 
	//Detect if the user is using chrome
	if(navigator.userAgent.indexOf("Chrome") != -1 ) {
		//alert('Chrome');
		modalFooter = document.getElementsByClassName("modal-footer");
		//modalFooter.style.visibility = "hidden";
		modalFooter.parentNode.removeChild(modalFooter);
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
      } 
    };
}


///////////////////////////////////////////////

const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };


const SCENARIO = [{'x': 50, 'y': 100,'name' :'Sustainability'},
				  {'x': 150, 'y': 300,'name' :'Inequality'},
				  {'x': 50, 'y': 300,'name' :'Fossil'}];

console.log(SCENARIO);

class ScatterPlot {
	/* your code here */

	constructor (id, data) {

		let svg = d3.select('#'+id);
		let svgHeight = parseInt(svg.style("height"));
		let svgWidth = parseInt(svg.style("width"));

		console.log(svgHeight +" "+svgWidth);

		var scaleY = d3.scaleLinear()
								.domain([0, 400])
								.range([svgHeight - MARGIN['top'], MARGIN['top']]);

		var scaleX = d3.scaleLinear()
								.domain([0, 200])
								.range([MARGIN['bottom'], svgWidth - MARGIN['bottom']]);

		

		//svg.append("rect")
    	//		.attr("fill", "red")
    	//		.attr("fill-opacity","0.8");

	 	let circle = svg.selectAll("circle")
											.data(data)
											.enter()
											  .append('circle')
												.attr('cx', (d, i) => scaleX(d['x']))
												.attr('cy', (d, i) => scaleY(d['y']))
												.attr("class", 'svg_circle')
												.attr("r", 1)
											.transition()
											  .attr("r", 50);
											/*	.style("fill", "blue")
											.exit().transition()
												.style("fill", "purple")
												.attr("r",0)
												.remove();*/

			var x = d3.scaleOrdinal()
								.range([0, svgWidth - MARGIN['bottom']]);

										 //.rangePoints([0, 200]);

			var x_axis = d3.axisBottom()
							        .scale(x)
							        //.tickValues(DAYS)
							        					 	
			var y_axis = d3.axisLeft()
									.scale(scaleTemp);

	svg.append("g")
			//.attr("transform", "translate(" + MARGIN['left'] + ",0)")
			.call(y_axis)
					
	svg.append("g")
			.attr("transform", "translate(0," + (svgHeight - MARGIN['bottom']) + ")")
			.call(x_axis)

	}

}



