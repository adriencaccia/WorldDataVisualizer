var g_width = $("#globe").width(),
    width = 938,
    height = 500,
        name,
        country_data,
    country;

var projectionGlobe = d3.geoOrthographic()
    .scale(200)
    .translate([width / 2, height / 2]);

var pathGlobe = d3.geoPath()
    .projection(projectionGlobe);

var svg = d3.select("#globe").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 "+width+" "+height)
    .attr("width", g_width)
    .attr("height", g_width*height/width)
    .append("g");

var gGlobe = svg.append("g");

d3.json("data/countries_pretty.topo.json", function(error, us) {
    gGlobe.append("g")
	.attr("id", "countries")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.countries).features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.id; })
        .attr("d", pathGlobe)
        .on("click", country_clickedGlobe);
});

function render_globe() {
	if(document.getElementById("globe").style.display == 'none'){
        document.getElementById("globe").style.display = 'block';
        document.getElementById("table").style.display = 'none';
        document.getElementById("map").style.display = 'none';
    }
}

function country_clickedGlobe(d) {

  if (country && data_name == 'none') {
        gGlobe.selectAll('path').style("fill","#cde");
        document.getElementById("data_card").style.visibility='hidden';
        g.selectAll('path').style("fill","#cde");

  }

  if (d && country !== d) {
        svg.attr("transform","translate("+0+","+0+") scale("+1+")");
        var xyz = get_rxyzGlobe(d);
        country = d;
	p = d3.geoCentroid(d);
	console.log(p);
        if (data_name == 'none'){
                d3.select(this).style("fill", "#fa5");
        }
        name = d.properties.name;
        for (var i = 0; i < dataset.length; i++)
        {
                if (dataset[i].country == name)
                        country_data = dataset[i];
        }
        zoomGlobe(p);
        update_tooltip()
  } else {
        var xyz = [width / 2, height / 2, 1];
        country = null;
        zoomGlobe(p);
  }
}

function lul(xyz) {
  gGlobe.transition()
        .duration(750)
        .tween("rotate",function() {
	    return function() {
		projectionGlobe.rotate([xyz[0][0], xyz[0][1]]);
	    };
	})
        .selectAll(["#countries"])
        .style("stroke-width", 1.0 / xyz[2] + "px");
}

function zoomGlobe(p) {
      d3.transition()
      .duration(2500)
      .tween("rotate", function() {
        var r = d3.interpolate(projectionGlobe.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projectionGlobe.rotate(r(t));
        };
      });
}

function get_rxyzGlobe(d) {
  var bounds = pathGlobe.bounds(d);
  var p = d3.geoCentroid(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .80 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [p, x, y, z];
}

