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
                center: [35,0],
                zoom: 1,
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
                layer.on({
                mouseover: fillInControl,
                mouseout: emptyControl,
                click: onClick
                });

                feature.properties.bounds_calculated=layer.getBounds();
            }
    }).addTo(map);
////////////////////////////////////////////////////////////////////////////////
    function fillInControl(e) {
        var layer = e.target;
        control_info_country.update(layer.feature.properties);
    }

    function emptyControl() {
        $("div.control_info_country").empty();
    }

    function onClick(e) {
        var layer = e.target;
        if(data.map(function(f) { return f['#country+code']; }).indexOf(layer.feature.properties['ISO_A3'])>-1){
            window.open('https://ifrcgo.github.io/pages/current_appeals/#All', '_blank');
        }
    }

    var control_info_country = L.control({position: 'topright'});
    control_info_country.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'control_info_country');
        div.innerHTML = '<h4>Mouse over a country</h4>';
        return div;
    };

    control_info_country.update = function (props) {
        $("div.control_info_country").html(props.NAME);
    };

    control_info_country.addTo(map);
///////////////////////////////////////////////////////////////////////////////

}

function rss(data){
  var string = '';
  data.forEach(function(d){
    console.log(d);
    string += '<a href="'+d.link+'">'+d.title + '</a> - ';
  });
  $('#feed').html(string);
}

function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

var appealsurl = 'https://beta.proxy.hxlstandard.org/data.json?strip-headers=on&filter03=merge&clean-date-tags01=%23date&filter02=select&merge-keys03=%23meta%2Bid&filter04=replace-map&filter05=merge&merge-tags03=%23meta%2Bcoverage%2C%23meta%2Bfunding&select-query02-01=%23date%2Bend%3E999999&merge-keys05=%23country%2Bname&merge-tags05=%23country%2Bcode&filter01=clean&replace-map-url04=https%3A//docs.google.com/spreadsheets/d/1hTE0U3V8x18homc5KxfA7IIrv1Y9F1oulhJt0Z4z3zo/edit%3Fusp%3Dsharing&merge-url03=https%3A//docs.google.com/spreadsheets/d/1rVAE8b3uC_XIqU-eapUGLU7orIzYSUmvlPm9tI0bCbU/edit%23gid%3D0&merge-url05=https%3A//docs.google.com/spreadsheets/d/1GugpfyzridvfezFcDsl6dNlpZDqI8TQJw-Jx52obny8/edit%3Fusp%3Dsharing&url=https%3A//docs.google.com/spreadsheets/d/19pBx2NpbgcLFeWoJGdCqECT2kw9O9_WmcZ3O41Sj4hU/edit%23gid%3D0';
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10) {
    dd='0'+dd
}
if(mm<10) {
    mm='0'+mm
}
var date = yyyy + '-' + mm + '-' + dd;
appealsurl = appealsurl.replace('999999',date);

var rssfeed = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=30&output=json&q=http://www.gdacs.org/xml/rss.xml'

var dataCall = $.ajax({
    type: 'GET',
    url: appealsurl,
    dataType: 'json',
});

var geomCall = $.ajax({
    type: 'GET',
    url: '/data/worldmap.json',
    dataType: 'json'
});

$.ajax({
    type: 'GET',
    url: rssfeed,
    dataType: 'jsonp',
    success:function(response){
        rss(response.responseData.feed.entries);
    }
});

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    var data = hxlProxyToJSON(dataArgs[0]);
    var geom = topojson.feature(geomArgs[0],geomArgs[0].objects.geom);
    createMap(data,geom);
});
