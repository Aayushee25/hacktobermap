// Initialize map with lat: 20, lon: 0 and zoom level 3
var map = L.map('map').setView([20, 0], 3);

// Draw tile layer (the map imagery) from Mapbox
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 10,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYWJoaWppdHBhcmlkYSIsImEiOiJjanFtMDRoMnkxZDdzNDNueTZxdGVlbDc5In0.ViO-4hOc6V2qLFVPZ-rChA'
}).addTo(map);

// Center on user's geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    map.setView([latitude, longitude]);
  });
}

// Configure clustering and spidering options
var markers = L.markerClusterGroup({
  showCoverageOnHover: false,
  zoomToBoundsOnClick: false,
  spiderLegPolylineOptions: {
    opacity: 0.7
  },
  iconCreateFunction: function(cluster) {
    return L.divIcon({ html: '<div><span>' + cluster.getChildCount() + ' people</span></div>', className: 'marker-cluster', iconSize: L.point(40, 40)});
  },
  spiderfyShapePositions: function(count, centerPt) {
    var distanceFromCenter = 35;
    var markerDistance = 60;
    var lineLength = markerDistance * (count - 1);
    var lineStart = centerPt.y - lineLength / 2;
    var res = [];
    for (var i = count - 1; i >= 0; i--) {
      res.push(new L.Point(centerPt.x + distanceFromCenter, lineStart + markerDistance * i));
    }
    return res;
  }
});

// Get user data from hacktobermap.js and render markers
for (var i = hacktobermap.length - 1; i >= 0; i--) {
  var name = hacktobermap[i].name;
  var locality = hacktobermap[i].location;
  var latitude = hacktobermap[i].latitude;
  var longitude = hacktobermap[i].longitude;
  var marker = L.marker([latitude, longitude]).bindTooltip('<b>' + name + '</b><br>' + locality, {permanent: true, direction: 'right'});
  markers.addLayer(marker);
}
map.addLayer(markers);
markers.on('clusterclick', function (cluster) {
  cluster.layer.spiderfy();
});
markers.on('clustermouseover', function (cluster) {
  cluster.layer.spiderfy();
});
