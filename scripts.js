function clicked() {

    var infos = document.getElementsByClassName("info");

    var swap = 0;
    var first = true;
    var top = 0;

    for (i = 0; i < infos.length; i++) {
        if (first == true) {
            top = $('#' + infos[i].id).css("top");
            first = false;
        }

        swap = i + 1;
        if (swap >= infos.length) {
            swap = 0;
        }
        if (swap == 0) {
            $('#' + infos[i].id).css('top', top);
        } else {
            $('#' + infos[i].id).css('top', $('#' + infos[swap].id).css("top"));
        }
    }

}

function upload_gpx_pressed() {
    var read = new FileReader();
    file = $("#input").prop('files')[0];

    read.readAsBinaryString(file);

    read.onloadend = function() {
	var gpx = read.result.replace(/gpxtpx:/ig, 'gpxtpx');
	//alert(gpx);
        xmlDoc = $.parseXML(gpx);
        display_xml(xmlDoc);
    }
    $("#form").css("visibility", "hidden");
}

function get_speed(first_lat, first_lng, second_lat, second_lng, first_time, second_time){ // This totally works and is incredibly accurate

    var lat_diff = Math.abs(second_lat - first_lat);
    var lng_diff = Math.abs(second_lng - first_lng);

    var date_diff = Math.abs((new Date(second_time[0]['innerHTML']).getTime()) - (new Date(first_time[0]['innerHTML']).getTime())) / (10*60*60);
    
    var R = 6371; // Radius of the earth in km

    var a = Math.sin(lat_diff/2) * Math.sin(lat_diff/2) +
    Math.cos(deg2rad(lat_diff)) * Math.cos(deg2rad(lat_diff)) * 
    Math.sin(lng_diff/2) * Math.sin(lng_diff/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
console.log((d/date_diff) + "km/h")
    return d/date_diff; //km/h

}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function display_xml(xml) {

    var track = $(xml).find("trk").first();
    $("#track_name").html($(track).find("name"));
    var points = $(track).find("trkpt");
    var linePoints = [];
    var elevations = [];
    var speeds = [];
    var heartRates = 0;
    var ratesCount = 0;
    for (var i = 0; i < points.length; i++) {
        linePoints.push([points[i].getAttribute('lat'), points[i].getAttribute('lon')]);
	elevations.push([$(points[i]).find('time').first(), $(points[i]).find('ele').first()]);
        heartRates += parseInt($(points[i]).find("gpxtpxhr")[0]['innerHTML']);
        ratesCount += 1;
        if (i==0){
	    continue;
	}
	speeds.push([$(points[i]).find('time').first(),get_speed(points[i-1].getAttribute('lat'), points[i-1].getAttribute('lon'),points[i].getAttribute('lat'), points[i].getAttribute('lon'),$(points[i-1]).find('time').first(),$(points[i]).find('time').first())]);
    }
    var polyline = L.polyline(linePoints, {
        color: 'red'
    }).addTo(mymap);
    // zoom the map to the polyline
    mymap.fitBounds(polyline.getBounds());
    $('#heart_rate').html("Average Heart Rate : " + Math.round(heartRates / ratesCount));
    $("#mapid").css("visibility", "visible");

var ctx = document.getElementById("myChart").getContext('2d');
alert(elevations);
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: elevations,
    options: "",
});

}
