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
        xmlDoc = $.parseXML(read.result);
        display_xml(xmlDoc)
    }
    $("#form").css("visibility", "hidden");
}

function display_xml(xml) {

    var track = $(xml).find("trk").first();
    $("#track_name").html($(track).find("name"));
    var points = $(track).find("trkpt");
    var linePoints = [];
    var heartRates = 0;
    var ratesCount = 0;
    for (var i = 0; i < points.length; i++) {
        linePoints.push([points[i].getAttribute('lat'), points[i].getAttribute('lon')]);
        heartRates += $(points[i]).find("gpxtpx:hr").first();
        alert($(points[i]).find("gpxtpx:hr").first());
        ratesCount += 1;
    }
    var polyline = L.polyline(linePoints, {
        color: 'red'
    }).addTo(mymap);
    // zoom the map to the polyline
    mymap.fitBounds(polyline.getBounds());
    alert(heartRates);
    alert(ratesCount);
    alert(heartRates / ratesCount);
    $('#heart_rate').html(heartRates / ratesCount);
    $("#mapid").css("visibility", "visible");
}
