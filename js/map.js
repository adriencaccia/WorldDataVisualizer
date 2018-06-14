var m_width = $("#map").width(),
    width = 938,
    height = 500,
	name,
	country_data,
    country;

var projectionFlat = d3.geoMercator()
    .scale(150)
	.translate([width / 2, height / 1.5]);
	//.rotate([-10,0]);

var pathFlat = d3.geoPath()
	.projection(projectionFlat);

var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width)
	.append("g");


svg.append("rect")
	.attr("class", "background")
	.attr("width", width)
	.attr("height", height)
	.on("click", country_clicked);

var g = svg.append("g");

d3.json("data/countries_pretty.topo.json", function(error, us) {
  g.append("g")
	.attr("id", "countries")
	.selectAll("path")
	.data(topojson.feature(us, us.objects.countries).features)
	.enter()
	.append("path")
	.attr("id", function(d) { return d.id; })
	.attr("d", pathFlat)
	.on("click", country_clicked);
});

var tooltip = d3.select("body")
	.append("div")
	.attr("id","tooltip");

function zoom(xyz) {
  g.transition()
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
	g.selectAll('path').style("fill","#cde");
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
	update_tooltip()
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

function update_tooltip() {
	if (country != null) {
		tooltip.selectAll("div").remove();
		if (data_name == 'none') {
			switch (data_type) {
				case 'general':
					tooltip.append("div")
						.html(	"Country: "+country_data.country+
								"<br/>Area: "+country_data.area_sqkm.toLocaleString("en-US")+" km²"+
								"<br/>Population : "+country_data.population.toLocaleString("en-US")+" inh.");
					break;
				case 'economics':
					tooltip.append("div")
						.attr("position","relative")
						.html("Country: "+country_data.country);
					tooltip.append("div")
						.attr("class","left-column")
						.attr("id","left")
						.html(	"GDP: "+country_data.gdp.toLocaleString("en-US")+" USD"+
								"<br/>Inflation: "+country_data.inflation.toLocaleString("en-US")+" %"+
								"<br/>External debt: "+country_data.debt_external.toLocaleString("en-US")+" USD"+
								"<br/>Imports: "+country_data.imports.toLocaleString("en-US")+" USD"+
								"<br/>Account balance: "+country_data.account_balance.toLocaleString("en-US")+" USD"+
								"<br/>Unemployment rate: "+country_data.unemployment.toLocaleString("en-US")+" %");
					tooltip.append("div")
						.attr("class","right-column")
						.attr("id","right")
						.html(	"GDP per capita: "+country_data.gdp_percapita.toLocaleString("en-US")+" USD/inh."+
								"<br/>GDP growth rate: "+country_data.gdp_growthrate.toLocaleString("en-US")+" %"+
								"<br/>Public debt: "+country_data.debt_public.toLocaleString("en-US")+" % of GDP"+
								"<br/>Exports: "+country_data.exports.toLocaleString("en-US")+" USD"+
								"<br/>Investment: "+country_data.investment.toLocaleString("en-US")+" % of GDP"+
								"<br/>Labor force: "+country_data.labor_force.toLocaleString("en-US")+" people");
					tooltip.append("div")
						.attr("position","relative")
						.html(	"Military expenditures: "+country_data.military_dollar.toLocaleString("en-US")+" USD / "+country_data.military_gdp.toLocaleString("en-US")+" % of GDP"+
								"<br/>Foreign exchange & gold reserves: "+country_data.gold_reserves.toLocaleString("en-US")+" USD");
					break;
				case 'resources':
					tooltip.append("div")
						.attr("position","relative")
						.html("Country: "+country_data.country);
					tooltip.append("div")
						.attr("class","left-column")
						.attr("id","left")
						.html(	"Electricity production: "+country_data.elec_production.toLocaleString("en-US")+" kWh"+
								"<br/>Gas production: "+country_data.gas_production.toLocaleString("en-US")+" m&sup3"+
								"<br/>Gas exports: "+country_data.gas_exports.toLocaleString("en-US")+" m&sup3"+
								"<br/>Oil production: "+country_data.oil_production.toLocaleString("en-US")+" bbl/day"+
								"<br/>Oil exports: "+country_data.oil_exports.toLocaleString("en-US")+" bbl/day");
					tooltip.append("div")
						.attr("class","left-column")
						.attr("id","left")
						.html(	"Electricity consumption: "+country_data.elec_consumption.toLocaleString("en-US")+" kWh"+
								"<br/>Gas consumption: "+country_data.gas_consumption.toLocaleString("en-US")+" m&sup3"+
								"<br/>Gas imports: "+country_data.gas_imports.toLocaleString("en-US")+" m&sup3"+
								"<br/>Oil consumption: "+country_data.oil_consumption.toLocaleString("en-US")+" bbl/day"+
								"<br/>Oil imports: "+country_data.oil_imports.toLocaleString("en-US")+" bbl/day");
					break;
				case 'health':
					tooltip.append("div")
						.attr("position","relative")
						.html("Country: "+country_data.country);
					tooltip.append("div")
						.attr("class","left-column")
						.attr("id","left")
						.html(	"Birth rate: "+country_data.birth_rate.toLocaleString("en-US")+" births/1000 people"+
								"<br/>Life expectancy at birth: "+country_data.life_expectancy.toLocaleString("en-US")+" years"+
								"<br/>People living with HIV: "+country_data.hiv_living.toLocaleString("en-US"));
					tooltip.append("div")
						.attr("class","right-column")
						.attr("id","right")
						.html(	"Death rate: "+country_data.death_rate.toLocaleString("en-US")+" deaths/1000 people"+
								"<br/>Infant mortality: "+country_data.infant_mortality.toLocaleString("en-US")+" deaths/1000 live births"+
								"<br/>People dead because of HIV: "+country_data.hiv_deaths.toLocaleString("en-US"));
					tooltip.append("div")
						.html(	"HIV prevalence rate: "+country_data.hiv_prevalence.toLocaleString("en-US")+" %"+
								"<br/>Fertility rate: "+country_data.fertility_rate.toLocaleString("en-US")+" children born/woman");
					break;
				case 'tech':
					tooltip.append("div")
						.attr("position","relative")
						.html("Country: "+country_data.country);
					tooltip.append("div")
						.attr("class","left-column")
						.attr("id","left")
						.html(	"Highways: "+country_data.highways.toLocaleString("en-US")+" km"+
								"<br/>Internet hosts: "+country_data.internet_hosts.toLocaleString("en-US")+
								"<br/>Telephone main lines: "+country_data.telephone_mainlines.toLocaleString("en-US"));
					tooltip.append("div")
						.attr("class","right-column")
						.attr("id","right")
						.html(	"Railways: "+country_data.railways.toLocaleString("en-US")+" km"+
								"<br/>Internet users: "+country_data.internet_users.toLocaleString("en-US")+
								"<br/>Telephone mobile lines: "+country_data.telephone_mobile.toLocaleString("en-US"));
					break;
			}
		} else {
			tooltip.append("div")
				.attr("position","relative")
				.html(	"Country: "+country_data.country+
						"<br/>"+data_name_pretty+": "+country_data[data_name].toLocaleString("en-US")+data_unit);
		}
	}
}
