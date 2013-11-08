/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};

//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;

//reference to our google map
gov.usgs.quakesMap;

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});


//function to call when document is ready
$(function(){
    getQuakes();
}); //doc ready


/*Queries the server to get the quake data and sets up the page*/
function getQuakes(){
	$.getJSON(gov.usgs.quakesUrl, function(quakes){
		gov.usgs.quakes = quakes;
		$('.loading').removeClass('loading');
		$('.message').html('Displaying ' + quakes.length + ' earthquakes');
		gov.usgs.quakesMap = new google.maps.Map($('.map-container')[0], {
			center: new google.maps.LatLng(0,0),
			zoom: 2,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			streetViewControl: false
		});
		addQuakeMarkers(quakes, gov.usgs.quakesMap);
	});
}

/*
Adds the markers to the map
quakes: array of quake objects
map: google map which will hold markers
*/
function addQuakeMarkers(quakes, map){
	var quake, i, loc;
	for(i=0; i<quakes.length; i++){
		quake = quakes[i];
		loc = quake.location;
		if(loc){
			quake.mapMarker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(loc.latitude, loc.longitude),
				datetime: quake.datetime,
				magnitude: quake.magnitude,
				depth: quake.depth
			});
			google.maps.event.addListener(quake.mapMarker, 'click', function(){
				if(gov.usgs.iw){
					gov.usgs.iw.close();
				}
				gov.usgs.iw = new google.maps.InfoWindow({
				content: new Date(this.datetime).toLocaleString() + 
					': magnitude ' + this.magnitude + ' at a depth of '
					+ this.depth + ' meters' 
				});
				gov.usgs.iw.open(map, this);
			});
		}
	}
}