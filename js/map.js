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

function zoomFlat(xyz) {
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
  	document.getElementById("data_card").style.visibility='hidden';
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
	zoomFlat(xyz);
	update_tooltip();
  } else {
	var xyz = [width / 2, height / 1.5, 1];
	country = null;
	zoomFlat(xyz);
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
		var card = document.getElementById("data_card");
		setTimeout(function(){
		card.style.visibility='visible';
		}, 1000);


		tooltip.selectAll("div").remove();
		var card_body = card.getElementsByClassName("card-body")[0];
		card_body.getElementsByClassName("card-title")[0].innerHTML = "<h2> "+country_data.country+"</h2>";
		if (data_name == 'none') {
			switch (data_type) {
				case 'general':
					card_body.getElementsByClassName("card-text")[0].innerHTML = ("<br/><b>Area</b>: "+country_data.area_sqkm.toLocaleString("en-US")+" km²"+
								"<br/><b>Population</b> : "+country_data.population.toLocaleString("en-US")+" inh.");
					break;
				case 'economics':
					card_body.getElementsByClassName("card-text")[0].innerHTML = "<b>GDP</b>: "+country_data.gdp.toLocaleString("en-US")+" USD"+
								"<br/><b>Inflation</b>: "+country_data.inflation.toLocaleString("en-US")+" %"+
								"<br/><b>External debt</b>: "+country_data.debt_external.toLocaleString("en-US")+" USD"+
								"<br/><b>Imports</b>: "+country_data.imports.toLocaleString("en-US")+" USD"+
								"<br/><b>Account balance</b>: "+country_data.account_balance.toLocaleString("en-US")+" USD"+
								"<br/><b>Unemployment rate</b>: "+country_data.unemployment.toLocaleString("en-US")+" %" + '<br>' +
								"<b>GDP per capita</b>: "+country_data.gdp_percapita.toLocaleString("en-US")+" USD/inh."+
								"<br/><b>GDP growth rate</b>: "+country_data.gdp_growthrate.toLocaleString("en-US")+" %"+
								"<br/><b>Public debt</b>: "+country_data.debt_public.toLocaleString("en-US")+" % of GDP"+
								"<br/><b>Exports</b>: "+country_data.exports.toLocaleString("en-US")+" USD"+
								"<br/><b>Investment</b>: "+country_data.investment.toLocaleString("en-US")+" % of GDP"+
								"<br/><b>Labor force</b>: "+country_data.labor_force.toLocaleString("en-US")+" people" + '<br>' +
								"<b>Military expenditures</b>: "+country_data.military_dollar.toLocaleString("en-US")+" USD / "+country_data.military_gdp.toLocaleString("en-US")+" % of GDP"+
								"<br/><b>Foreign exchange & gold reserves</b>: "+country_data.gold_reserves.toLocaleString("en-US")+" USD";

					break;
				case 'resources':
						card_body.getElementsByClassName("card-text")[0].innerHTML = "<b>Electricity production</b>: "+country_data.elec_production.toLocaleString("en-US")+" kWh"+
								"<br/><b>Gas production</b>: "+country_data.gas_production.toLocaleString("en-US")+" m&sup3"+
								"<br/><b>Gas exports</b>: "+country_data.gas_exports.toLocaleString("en-US")+" m&sup3"+
								"<br/><b>Oil production</b>: "+country_data.oil_production.toLocaleString("en-US")+" bbl/day"+
								"<br/><b>Oil exports</b>: "+country_data.oil_exports.toLocaleString("en-US")+" bbl/day" +
								"<br/><b>Electricity consumption</b>: "+country_data.elec_consumption.toLocaleString("en-US")+" kWh"+
								"<br/><b>Gas consumption</b>: "+country_data.gas_consumption.toLocaleString("en-US")+" m&sup3"+
								"<br/><b>Gas imports</b>: "+country_data.gas_imports.toLocaleString("en-US")+" m&sup3"+
								"<br/><b>Oil consumption</b>: "+country_data.oil_consumption.toLocaleString("en-US")+" bbl/day"+
								"<br/><b>Oil imports</b>: "+country_data.oil_imports.toLocaleString("en-US")+" bbl/day";
					break;
				case 'health':
					card_body.getElementsByClassName("card-text")[0].innerHTML = "<b>Birth rate</b>: "+country_data.birth_rate.toLocaleString("en-US")+" births/1000 people"+
								"<br/><b>Life expectancy at birth</b>: "+country_data.life_expectancy.toLocaleString("en-US")+" years"+
								"<br/><b>People living with HIV</b>: "+country_data.hiv_living.toLocaleString("en-US")+
								"<br/><b>HIV prevalence rate</b>: "+country_data.hiv_prevalence.toLocaleString("en-US")+" %"+
								"<br/><b>Fertility rate</b>: "+country_data.fertility_rate.toLocaleString("en-US")+" children born/woman"
					break;
				case 'tech':
					card_body.getElementsByClassName("card-text")[0].innerHTML = "<b>Highways</b>: "+country_data.highways.toLocaleString("en-US")+" km"+
								"<br/><b>Internet hosts</b>: "+country_data.internet_hosts.toLocaleString("en-US")+
								"<br/><b>Telephone main lines</b>: "+country_data.telephone_mainlines.toLocaleString("en-US") + 
								"<br/><b>Railways</b>: "+country_data.railways.toLocaleString("en-US")+" km"+
								"<br/><b>Internet users</b>: "+country_data.internet_users.toLocaleString("en-US")+
								"<br/><b>Telephone mobile lines</b>: "+country_data.telephone_mobile.toLocaleString("en-US")
					break;
			}
		}
	}
}

function change(str){
	card_header = document.getElementById('data_card').getElementsByClassName('card-header')[0].getElementsByTagName("ul")[0];
	lis = card_header.getElementsByTagName("li")
	for(i = 0;i < lis.length; i++){
		var a=lis[i].getElementsByClassName('nav-link')[0];
		if(lis[i].id==str && !(a.classList.contains('active'))){
				a.classList.add('active');
		}
		else if(lis[i].id!=str){
			a.classList.remove('active')
		}
	}
	data_type = str;
	update_tooltip();
}
