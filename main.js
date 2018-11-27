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
// function mapSourceAndLayer();
//		This function add source and layer to the map according to the data bind
//		This function is only called in mapData after binding the data file to the map
//
// function mapInteract();
//		Contains all event which the user can interact with the map
//
// function onSSPchanged();
//		When the SSP is selected by the user, it updates the info and map.


// Global variables
var selectedSSP;// = document.getElementById("exampleFormControlSelect1").value;
var previousSSP;
var selectedOPTION;
var map;

function updateSSP() {
	if (document.getElementById("exampleFormControlSelect1").value == null) {
		console.log("		default")
		defaultSSP();
	}
	else {
		selectedSSP = document.getElementById("exampleFormControlSelect1").value;
	}
	console.log("updateSSP :" + selectedSSP);
}

function defaultSSP() {
	selectedSSP = "SSP1";
    //document.getElementById(selectedSSP).style.display = "inline";
	//$('.help-modal').modal('show');
}


function displayInfo() {
	if(previousSSP) {
		console.log('	previous :' + previousSSP);
		document.getElementById(previousSSP).style.display = "none";
	}
	console.log("Display info : " + selectedSSP);
	document.getElementById(selectedSSP).style.display = "inline";
	previousSSP = selectedSSP;	
}


function mapCreate() {
	console.log("Create map");
	mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpb3R0am91bG90IiwiYSI6ImNqb3BxbWNsNTA2OWszcWsyZmhyb2RwMmcifQ.8hum7VUmAlj4syS3GZwFLA';

	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/eliottjoulot/cjosk4zex021a2spdbg1k1zkq',
		center: [15, 30], // starting position
		zoom: 1, // starting zoom
		maxZoom: 4,
		minZoom: 1
	});
}


function mapRemove() {
	let mapId = 'earthquakes';
	var mapLayer = map.getLayer(mapId);

    if(typeof mapLayer !== 'undefined') {
      // Remove map layer & source.
      map.removeLayer(mapId).removeSource(mapId);
    }
}



// Display the data on the map as a layer
function mapSourceAndLayer() {
	let dataSelect = selectedSSP;
	console.log("Data file : geo_calories_filtered_" + dataSelect + "cc.geojson");

	//map.on('load', function () {

		// Add source
		map.addSource("earthquakes", {
			type: "geojson",
			// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
			// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
			//data: "geo_calories_filtered_SSP1cc.geojson",
			data: "geo_calories_filtered_" + dataSelect + "cc.geojson",
			cluster: false,
			clusterMaxZoom: 6, // Max zoom to cluster points on
			clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
		});

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
					["get", "calories"],
					22000, 0,
					35000, 1
				],
				// Increase the heatmap color weight weight by zoom level
				// heatmap-intensity is a multiplier on top of heatmap-weight
				"heatmap-intensity": [
					"interpolate",
					["linear"],
					["zoom"],
					0, 1,
					9, 10
				],
				// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
				// Begin color ramp at 0-stop with a 0-transparancy color
				// to create a blur-like effect.
				"heatmap-color": [
					"interpolate",
					["linear"],
					["heatmap-density"],
					0, "rgba(33,102,172,0)",
					0.2, "rgba(103,169,207,0.5)",
					0.4, "rgba(209,229,240,0.5)",
					0.6, "rgba(253,219,199,0.5)",
					0.8, "rgba(239,138,98,0.5)",
					1, "rgba(178,24,43,0.5)"
				],
				// Adjust the heatmap radius by zoom level
				"heatmap-radius": [
					"interpolate",
					["linear"],
					["zoom"],
					0, 2,
					8, 30
				],
			}
		});
	//});
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
	// Bind the default scenario data to the map and add sourcer/layer
	map.on('load', function () {
		mapSourceAndLayer();
	});
	// Update the placeholder below the map
	displayInfo();
	// Allow interactions
	mapInteract();

});


function onSSPchanged() {
	updateSSP();

	mapRemove();
	mapSourceAndLayer();

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





