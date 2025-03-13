// this file contains the JavaScript code for the Baird's Sparrow interactive demo

// create map
var mymap = L.map('map', {
        center: [56.1304, -106.3468], 
        minZoom: 1,
        zoom: 5
    });

// FREE TILE PROVIDES

// open-street-map
L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( mymap );

// CartoDB
//L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//	subdomains: 'abcd',
//}).addTo( mymap );

// wikimedia
//L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
//	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
//}).addTo( mymap );



// functions for modifying the location points
location_markers = [];

default_opacity = 0.4;
highlight_opacity = 1.0;

highlight_type = "none";

function fade(marker) {
    marker.setStyle({
            fillColor: "gray",
            color: "gray",
            fillOpacity: default_opacity,
            opacity: default_opacity,
            weight: 3
        });
    marker.bringToBack();
}

function highlight_sparrow(marker) {
    marker.setStyle({
            fillColor: "blue",
            color: "blue",
            fillOpacity: highlight_opacity,
            opacity: highlight_opacity,
            weight: 3
        });
    marker.bringToFront();
}

function reset_highlight(marker, color) {
    marker.setStyle({
            fillColor: color,
            color: color,
            fillOpacity: default_opacity,
            opacity: default_opacity,
            weight: 3
        });
}

function highlight_sparrows() {
    for ( var i = 0; i < location_markers.length; i++ ) {
        if (location_markers[i].location_data["species"] == "Baird's sparrow") {
            highlight_sparrow(location_markers[i].marker);
        } else {
            fade(location_markers[i].marker);
        }
    }
}

function highlight_none() {
    for ( var i = 0; i < location_markers.length; i++ ) {
        reset_highlight(location_markers[i].marker, "gray");
    }
}


function reset_highlights() {
    if (highlight_type == "none") {
        highlight_none();
    } else if (highlight_type == "bairds-sparrow") {
        highlight_sparrows();
    } 
}


// listeners
function on_opacity_changed(opacity, highlight_opacity_) {
    default_opacity = opacity;
    highlight_opacity = highlight_opacity_;
    reset_highlights();
    mymap.closePopup();
}

function on_highlight_type_changed() {
    reset_highlights();
    mymap.closePopup();
}


// functions for making markers
function make_info_block_html(title, content) {
    return "<div>" +
    "<span class=\"info-title\">" +
      title +
    "</span>" +
    "<span class=\"info-content\">"+
      content +
    "</span>" +
    "</div>"
}


function add_to_map(N, W, location_data) {
    var marker = L.circle(L.latLng(N, -1 * W))
        .bindPopup(
            "<div class=\"location-info\">" +
            make_info_block_html("DLS code: ", location_data["DLS_code"]) +
            make_info_block_html("Page (from 1): ", location_data["page_number"]) +
            make_info_block_html("Species: ", location_data["species"]) +
            make_info_block_html("Status: ", location_data["status"]) +
            "</div>"
        )
        .addTo( mymap );
    
    location_markers.push({
        marker: marker,
        location_data: location_data
    });
}

// add locations  
locations.forEach(function(location) {
    add_to_map(location.N, location.W, location);
});

// bind some events
mymap.on('click', function() {
    reset_highlights();
    mymap.closePopup();
});

// bind slider
const background_slider = document.getElementById("background-opacity");
background_slider.oninput = function() {
    opacity = this.value / 100.0;
    on_opacity_changed(opacity, highlight_opacity);
}
    
const highlight_slider = document.getElementById("highlight-opacity");
highlight_slider.oninput = function() {
    opacity = this.value / 100.0;
    on_opacity_changed(default_opacity, opacity);
}

// bind highlight
$("#submit-highlight").bind("click", function() {
    highlight_type = $("#highlight-type").val();
    on_highlight_type_changed();
    $("#submit-highlight").blur();
});


// start app
on_highlight_type_changed();
