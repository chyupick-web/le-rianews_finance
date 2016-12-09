$(document).ready(function() {
    $('.rollover').css('display', 'none');
    $('.icons').hover(function() {
        $(this).children('.rollover').fadeIn(250);
    }, function() {
        $(this).children('.rollover').fadeOut(250);
    });
});

$(document).ready(function() {
    $('.rollover-regions').css('display', 'none');
    $('.icons-regions').hover(function() {
        $(this).children('.rollover-regions').fadeIn(100);
    }, function() {
        $(this).children('.rollover-regions').fadeOut(100);
    });
});

function createMap(data,geom){

    var baselayer = L.tileLayer('https://data.hdx.rwlabs.org/mapbox-base-tiles/{z}/{x}/{y}.png', {});
    var baselayer2 = L.tileLayer('https://data.hdx.rwlabs.org/mapbox-layer-tiles/{z}/{x}/{y}.png', {minZoom:4});

    map = L.map('map',{
                center: [0,0],
                zoom: 2,
                layers: [baselayer,baselayer2]
            });

    var style = function(feature) {
        var color = '#aaaaaa';
        var fillOpacity = 0;
        var cls = 'country'

        if(data.map(function(e) { return e['#country+code']; }).indexOf(feature.properties['ISO_A3'])>-1){
            color = '#B71C1C';
            fillOpacity = 0.7;
            cls = 'appealcountry country appeal'+feature.properties['ISO_A3']
        };

        return {
                'color': color,
                'fillcolor': color,
                'weight': 1,
                'opacity': 0.7,
                'fillOpacity':fillOpacity,
                'className':cls
            };
    }

    map.overlay = L.geoJson(geom,{
        style:style,
        onEachFeature: function (feature, layer) {
                feature.properties.bounds_calculated=layer.getBounds();
            }
    }).addTo(map);
}