var g_width = $("#globe").width(),
    width = 938,
    height = 500,
    sens = 0.25,
	selected=0,
	country1_data,
  country1,
  country2_data,
  country2,
	name,
	country_data,
    country;

var projectionGlobe = d3.geoOrthographic()
    .scale(200)
    .translate([width / 2, height / 2]);

var projectionGlobe1 = projectionGlobe,
  projectionGlobe2 = projectionGlobe;

var pathGlobe = d3.geoPath()
    .projection(projectionGlobe);

var pathGlobe1 = d3.geoPath()
  .projection(projectionGlobe1);

var pathGlobe2 = d3.geoPath()
  .projection(projectionGlobe2);


var svgGlobe = d3.select("#globe").append("svg")
    .attr("width", g_width)
    .attr("height", g_width*height/width);


var svgGlobe1 = d3.select("#globe").append("svg")
  .attr('id', 'globe1')
  .attr("width", g_width)
  .attr("height", g_width * height / width)
  .style("visibility", "hidden")
  .on("click", resetGlobe);

var svgGlobe2 = d3.select("#globe").append("svg")
  .attr('id', 'globe2')
  .attr("width", g_width)
  .attr("height", g_width * height / width)
  .style("visibility", "hidden")
  .on("click", resetGlobe);
	
var drag = d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged);
			
var zoom = d3.zoom()
    .scaleExtent([200, 10000])
    .on("zoom", zoomed);

// svgGlobe.call(drag);
svgGlobe.call(zoom);

svgGlobe.append("rect")
  .attr("class", "background")
  .attr("width", width*4)
  .attr("height", height*4)
  .on("click", country_clickedGlobe)
  .call(d3.drag()
    .subject(function () { var r = projectionGlobe.rotate(); return { x: r[0] / sens, y: -r[1] / sens }; })
    .on("drag", function () {
      var rotate = projectionGlobe.rotate();
      projectionGlobe.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
      svgGlobe.selectAll("path").attr("d", pathGlobe);
      svgGlobe.selectAll(".focused").classed("focused", focused = false);
    }));

svgGlobe.append("path")
  .datum({ type: "Sphere" })
  .attr("class", "water")
  .attr("d", pathGlobe)
  .on("click", country_clickedGlobe)
  .call(d3.drag()
    .subject(function () { var r = projectionGlobe.rotate(); return { x: r[0] / sens, y: -r[1] / sens }; })
    .on("drag", function () {
      var rotate = projectionGlobe.rotate();
      projectionGlobe.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
      svgGlobe.selectAll("path").attr("d", pathGlobe);
      svgGlobe.selectAll(".focused").classed("focused", focused = false);
    }));

svgGlobe1.append("path")
  .datum({ type: "Sphere" })
  .attr("class", "water")
  .attr("d", pathGlobe1);

svgGlobe2.append("path")
  .datum({ type: "Sphere" })
  .attr("class", "water")
  .attr("d", pathGlobe2);


d3.json("data/countries_pretty.topo.json", function(error, us) {
    svgGlobe.append("g")
      .attr("id", "countries")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.countries).features)
      .enter()
      .append("path")
      .attr("id", function(d) { return d.id; })
      .attr("d", pathGlobe)
      .on("click", rotateMe)
      .on("click", country_clickedGlobe)
      .call(d3.drag()
        .subject(function () { var r = projectionGlobe.rotate(); return { x: r[0] / sens, y: -r[1] / sens }; })
        .on("drag", function () {
          var rotate = projectionGlobe.rotate();
          projectionGlobe.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
          svgGlobe.selectAll("path").attr("d", pathGlobe);
          svgGlobe.selectAll(".focused").classed("focused", focused = false);
        })
      );
});

d3.json("data/countries_pretty.topo.json", function(error, us) {
    svgGlobe1.append("g")
      .attr("id", "country1")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.countries).features)
      .enter()
      .append("path")
      .attr("id", function(d) { return d.id; });
});

d3.json("data/countries_pretty.topo.json", function(error, us) {
    svgGlobe2.append("g")
      .attr("id", "country2")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.countries).features)
      .enter()
      .append("path")
      .attr("id", function(d) { return d.id; });
});

function resetGlobe() {
  svgGlobe1.select('#' + country1.id).style('fill', '#ccaa66');
  svgGlobe1.style('visibility', 'hidden');
  svgGlobe2.select('#' + country2.id).style('fill', '#ccaa66');
  svgGlobe2.style('visibility', 'hidden');
  svgGlobe.style('visibility', 'visible');
  svgGlobe.select('#' + country1.id).style('fill', '#ccaa66');  
  document.getElementById("data_card").style.visibility='hidden';
  country1 = country2 = country1_data = country2_data = null;
  selected = 0;
}

function render_globe() {
	if(document.getElementById("globe").style.display == 'none'){
        document.getElementById("globe").style.display = 'block';
        document.getElementById("table").style.display = 'none';
        document.getElementById("map").style.display = 'none';
    }
}

svgGlobe1.select('path.water').style("fill", "#9bd8ff");
svgGlobe2.select('path.water').style("fill", "#9bd8ff");

function country_clickedGlobe(d) {
  if (country1 && data_name == 'none') {
    svgGlobe.selectAll('path').style("fill", "#ccaa66");
    svgGlobe.select('path.water').style("fill", "#9bd8ff");
    document.getElementById("data_card").style.visibility='hidden';
  }

  if (d && country1 !== d && d.type !== 'Sphere' && selected==0) {
    svgGlobe.attr("transform","translate("+0+","+0+") scale("+1+")");
    country1 = d;
    if (data_name == 'none'){
            d3.select(this).style("fill", "#f05d5e");
    }
    name = d.properties.name;
    for (var i = 0; i < dataset.length; i++) {
      if (dataset[i].country == name)
        country1_data = dataset[i];
    }
    selected = selected + 1;
    // update_tooltip();
    // rotateMe(d);
  }
  else if (d && selected == 1 && country2 !== d && country1 !== d) {
    svgGlobe.style('visibility','hidden');
    country2 = d;

    svgGlobe1.select('#'+country1.id).style('fill', '#f05d5e');
    svgGlobe1.style('visibility', 'visible');
    svgGlobe2.select('#'+country2.id).style('fill', '#0f7173');
    svgGlobe2.style('visibility', 'visible');

    console.log(country1, country2);
    rotateMe1(country1);
    setTimeout(() => {
      rotateMe2(country2);
    }, 0);

    name = d.properties.name;
    for (var i = 0; i < dataset.length; i++) {
      if (dataset[i].country == name) {
        country2_data = dataset[i];
      }
    }
    update_tooltip()
  }
  else {
    var xyz = [width / 2, height / 2, 1];

    svgGlobe1.select('#' + country1.id).style('fill', '#ccaa66');
    svgGlobe1.style('visibility', 'hidden');
    svgGlobe2.select('#' + country2.id).style('fill', '#ccaa66');
    svgGlobe2.style('visibility', 'hidden');
    svgGlobe.style('visibility', 'visible');
    svgGlobe.select('#' + country1.id).style('fill', '#ccaa66');
    country1 = country2 = country1_data = country2_data = null;
    document.getElementById("data_card").style.visibility='hidden';
    selected = 0;
  }
}

var to_radians = Math.PI / 180;
var to_degrees = 180 / Math.PI;


function cross(v0, v1) {
    return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
}

function dot(v0, v1) {
    for (var i = 0, sum = 0; v0.length > i; ++i) sum += v0[i] * v1[i];
    return sum;
}

function lonlat2xyz( coord ){

	var lon = coord[0] * to_radians;
	var lat = coord[1] * to_radians;

	var x = Math.cos(lat) * Math.cos(lon);

	var y = Math.cos(lat) * Math.sin(lon);

	var z = Math.sin(lat);

	return [x, y, z];
}

function quaternion(v0, v1) {

	if (v0 && v1) {
		
	    var w = cross(v0, v1),  // vector pendicular to v0 & v1
	        w_len = Math.sqrt(dot(w, w)); // length of w     

        if (w_len == 0)
        	return;

        var theta = .5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1)))),

	        qi  = w[2] * Math.sin(theta) / w_len; 
	        qj  = - w[1] * Math.sin(theta) / w_len; 
	        qk  = w[0]* Math.sin(theta) / w_len;
	        qr  = Math.cos(theta);

	    return theta && [qr, qi, qj, qk];
	}
}

function euler2quat(e) {

	if(!e) return;
    
    var roll = .5 * e[0] * to_radians,
        pitch = .5 * e[1] * to_radians,
        yaw = .5 * e[2] * to_radians,

        sr = Math.sin(roll),
        cr = Math.cos(roll),
        sp = Math.sin(pitch),
        cp = Math.cos(pitch),
        sy = Math.sin(yaw),
        cy = Math.cos(yaw),

        qi = sr*cp*cy - cr*sp*sy,
        qj = cr*sp*cy + sr*cp*sy,
        qk = cr*cp*sy - sr*sp*cy,
        qr = cr*cp*cy + sr*sp*sy;

    return [qr, qi, qj, qk];
}

function quatMultiply(q1, q2) {
	if(!q1 || !q2) return;

    var a = q1[0],
        b = q1[1],
        c = q1[2],
        d = q1[3],
        e = q2[0],
        f = q2[1],
        g = q2[2],
        h = q2[3];

    return [
     a*e - b*f - c*g - d*h,
     b*e + a*f + c*h - d*g,
     a*g - b*h + c*e + d*f,
     a*h + b*g - c*f + d*e];

}

function quat2euler(t){

	if(!t) return;

	return [ Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2])) * to_degrees, 
			 Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * to_degrees, 
			 Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3])) * to_degrees
			]
}


function eulerAngles(v0, v1, o0) {

	var t = quatMultiply( euler2quat(o0), quaternion(lonlat2xyz(v0), lonlat2xyz(v1) ) );
	return quat2euler(t);	
}

var gpos0, o0;

function dragstarted(){

	gpos0 = projectionGlobe.invert(d3.mouse(this));
  o0 = projectionGlobe.rotate();
}

function dragged(){

	var gpos1 = projectionGlobe.invert(d3.mouse(this));

	o0 = projectionGlobe.rotate();

	var o1 = eulerAngles(gpos0, gpos1, o0);
	projectionGlobe.rotate(o1);

	svgGlobe.selectAll("path").attr("d", pathGlobe);

}

function zoomed() {
	projectionGlobe.scale(d3.event.transform.k);
	svgGlobe.selectAll("path").attr("d", pathGlobe);
}

var rotateMe = function (d) {
  projectionGlobe.rotate(),
    focusedCountry = d, //get the clicked country's details
    p = d3.geoCentroid(focusedCountry);
  //Globe rotating

  (function transition() {
    d3.transition()
      .duration(2500)
      .tween("rotate", function () {
        var r = d3.interpolate(projectionGlobe.rotate(), [-p[0], -p[1]]);
        return function (t) {
          projectionGlobe.rotate(r(t));
          svgGlobe.selectAll("path").attr("d", pathGlobe);
        };
      })
  })();
};

var lock1 = {},
  lock2 = {};

var rotateMe1 = function (d) {
  projectionGlobe1.rotate(),
    focusedCountry = d, //get the clicked country's details
    p = d3.geoCentroid(focusedCountry);
  //Globe rotating

  (function transition() {
    d3.select(lock1).transition()
      .duration(2500)
      .tween("rotate", function () {
        var r = d3.interpolate(projectionGlobe1.rotate(), [-p[0], -p[1]]);
        return function (t) {
          projectionGlobe1.rotate(r(t));
          svgGlobe1.selectAll("path").attr("d", pathGlobe1);
        };
      })
  })();
  console.log(p);
};

var rotateMe2 = function (d) {
  projectionGlobe2.rotate(),
    focusedCountry = d, //get the clicked country's details
    p = d3.geoCentroid(focusedCountry);
  //Globe rotating

  (function transition() {
    d3.select(lock2).transition()
      .duration(2500)
      .tween("rotate", function () {
        var r = d3.interpolate(projectionGlobe2.rotate(), [-p[0], -p[1]]);
        return function (t) {
          projectionGlobe2.rotate(r(t));
          svgGlobe2.selectAll("path").attr("d", pathGlobe2);
        };
      })
  })();
};