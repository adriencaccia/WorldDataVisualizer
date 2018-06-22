var m_width = $("#map").width(),
    width = 938,
    height = 500,
	name,
	country_data,
    country;

var projectionFlat = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

var pathFlat = d3.geoPath()
    .projection(projectionFlat);

var svg = d3.select("#map").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width)
	.append("g");

svg.append("rect")
	.attr("class", "background")
	.attr("width", width)
	.attr("height", height)
	.on("click", country_clicked);

d3.json("data/countries_pretty.topo.json", function(error, us) {
  svg.append("g")
	.attr("id", "countries")
	.selectAll("path")
	.data(topojson.feature(us, us.objects.countries).features)
	.enter()
	.append("path")
	.attr("id", function(d) { return d.id; })
	.attr("d", pathFlat)
	.on("click", country_clicked);
});

function zoom(xyz) {
  svg.transition()
	.duration(750)
	.attr("transform", "translate(" + projectionFlat.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
	.selectAll(["#countries"])
	.style("stroke-width", 1.0 / xyz[2] + "px");
}

function get_xyz(d) {
  var bounds = pathFlat.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .80 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
}

function country_clicked(d) {

  if (country && data_name == 'none') {
	svg.selectAll('path').style("fill","#cde");
  }

  if (d && country !== d) {
	svg.attr("transform","translate("+0+","+0+") scale("+1+")");
	var xyz = get_xyz(d);
	country = d;
	if (data_name == 'none'){
		d3.select(this).style("fill", "#fa5");
	}
	name = d.properties.name;
	for (var i = 0; i < dataset.length; i++)
	{
		if (dataset[i].country == name)
			country_data = dataset[i];
	}
	zoom(xyz);
	update_tooltip();
  } else {
	var xyz = [width / 2, height / 1.5, 1];
	country = null;
	zoom(xyz);
  }
}

$(window).resize(function() {
  var w = $("#map").width();
  svg.attr("width", w);
  svg.attr("height", w * height / width);
});

function render_map(){
	if(document.getElementById("map").style.display == 'none'){
        document.getElementById("map").style.display = 'block';
        document.getElementById("table").style.display = 'none';
	document.getElementById("globe").style.display = 'none';
    }
}