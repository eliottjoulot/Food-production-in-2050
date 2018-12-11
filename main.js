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

const dataValues = {};
dataValues.caloriesMin = 21.997706;
dataValues.caloriesMax = 23.707261;

dataValues.croplandMin = 239.022749;
dataValues.croplandMax = 8602;

dataValues.populationMin = 0.018170;
dataValues.populationMax = 172.571062;

dataValues.temperatureMin = 3.588515*10**9;
dataValues.temperatureMax = 1.978061*10**10;

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
		cluster: false,
		clusterMaxZoom: 6, // Max zoom to cluster points on
		clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
	});
}

function mapLayer(subData) {

	if (typeof(subData)==='undefined') subData = "calories";
	console.log("	subData :" + subData);
	console.log("	min and max " + dataValues[subData + "Min"] + " " + dataValues[subData + "Max"]);

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
				dataValues[subData + 'Max'], 1
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
				//0.7, "rgba(255,140,50,0.5)",
				0.8, "rgba(31,131,4,0.5)",
				//0.9, "rgba(11,131,4,0.5)",
				//0.95, "rgba(20,170,140,0.5)",
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
                    dataValues[subData + 'Max'], 50
                ]
			],

			// Color circle by earthquake magnitude
            "circle-color": [
                "interpolate",
                ["linear"],
                ["get", subData],
                dataValues[subData + 'Min'], "rgba(250,250,250,0.1)",
                (dataValues[subData + 'Min'] + dataValues[subData + 'Max'])/2, "rgba(43,162,22,0.7)",
                dataValues[subData + 'Max'], "rgba(0,180,0,0.7)"
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
	
	//hideLoading();

}

function mapInteract() {
	// inspect a cluster on click
	map.on('click', 'clusters', function (e) {
		var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
		var clusterId = features[0].properties.cluster_id;
		map.getSource('earthquakes').getClusterExpansionZoom(clusterId, function (err, zoom) {
			if (err)
				return;

			map.easeTo({
				center: features[0].geometry.coordinates,
				zoom: zoom
			});
		});
	});

	map.on('mouseenter', 'clusters', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'clusters', function () {
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
	chromeDetect();
	// Set the SSP scenario to the default one.
	defaultSSP();
	// Create the map
	mapCreate();
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
	// Detect if the user is using chrome;
    if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
        alert('Chrome');
    }
    // If not, we advise him to use it
    else {
    	// Only display the pop up once for the session
    	if(sessionStorage.getItem("popup") != "seen") {
    		$('.help-modal').modal('show');
    		sessionStorage.setItem("popup","seen");
    	}
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
