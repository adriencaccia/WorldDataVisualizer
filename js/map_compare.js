var m_width = $("#map").width(),
    width = 938,
    height = 500,
	name,
	selected=0,
	country1_data,
    country1,
    country2_data,
    country2;

var projectionFlat = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

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
	.duration(1000)
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
var a=null;
function country_clicked(d) {
	
  if (country1 && data_name == 'none') {
  	document.getElementById("data_card").style.visibility='hidden';
  }

  if (d && country1 !== d && selected==0) {
	country1 = d;
	if (data_name == 'none'){
		d3.select(this).style("fill", "#fa5");
	}
	name = d.properties.name;
	for (var i = 0; i < dataset.length; i++)
	{
		if (dataset[i].country == name)
			country1_data = dataset[i];
	}
	selected = selected+1;
	//zoom(xyz);
  }

  	else if (d && selected==1 && country2!== d){
	if (a!==this){
		d3.select(a).style("fill", "#cde");
		a=this;
	}
	country2 = d;
	
	if (data_name == 'none'){

		d3.select(this).style("fill", "#fa5");
	}
	name = d.properties.name;
	for (var i = 0; i < dataset.length; i++)
	{
		if (dataset[i].country == name){
			country2_data = dataset[i];
			console.log(country1_data.country);
			console.log(country2_data.country);

		}
	}
  	update_tooltip()
  	}

	else {
   	g.selectAll('path').style("fill","#cde");
	var xyz = [width / 2, height / 1.5, 1];
	country1 = country2 = country1_data = country2_data = null;
	selected=0;
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
	if (country1 != null && country2!=null) {
		features=data_country1=data_country2=[];
		var card = document.getElementById("data_card");
		card.style.visibility='visible';
		var card_body = card.getElementsByClassName("card-body")[0];
		card_body.getElementsByClassName("country1")[0].innerHTML="";
		card_body.getElementsByClassName("country2")[0].innerHTML="";
		card_body.getElementsByClassName("features")[0].innerHTML="";
		
		switch (data_type) {
				case 'general':
					features=['Area(m²)','Population(inh)']
					data_country1=[country1_data.area_sqkm,country1_data.population]
					data_country2=[country2_data.area_sqkm,country2_data.population]
					break;
				case 'economics':
					features = ["GDP(M.USD)","Inflation(%)","External Debt(M.USD)","Imports(M.USD)","Account Balance(M.USD)","Unemployment(%)","GDP per Capita(USD/inh)",
					"GDP Growthrate(%)","Public Debt(% of GDP)","Exports(M.USD)","Investment(% of GDP)","Labor Force","Military Expenditures(M.USD)","Gold Reserves(kUSD)"]
					data_country1=[country1_data.gdp/1000000,country1_data.inflation,country1_data.debt_external/1000000,country1_data.imports/1000000,
					country1_data.account_balance/1000000,country1_data.unemployment,country1_data.gdp_percapita,country1_data.gdp_growthrate,country1_data.debt_public,
					country1_data.exports/1000000,country1_data.investment,country1_data.labor_force,country1_data.military_dollar/1000000,country1_data.gold_reserves/1000000]

					data_country2=[country2_data.gdp/1000000,country2_data.inflation,country2_data.debt_external/1000000,country2_data.imports/1000000,
					country2_data.account_balance/1000000,country2_data.unemployment,country2_data.gdp_percapita,country2_data.gdp_growthrate,country2_data.debt_public/1000000,
					country2_data.exports/1000000,country2_data.investment/1000000,country2_data.labor_force,country2_data.military_dollar/1000000,country2_data.gold_reserves/1000]
					break;
				case 'resources':
					features=["Electricity Production(GWh)","Gas Production(M.m&sup3)","Gaz Exports(M.m&sup3)","Electricity Consumption(GWh)","Gas Consumption(M.m&sup3)",
					"Gaz Imports(1000 bbl/day)","Oil Consumption(1000 bbl/day)","Oil Imports(1000 bbl/day)"]
					data_country1=[country1_data.elec_production/1000000,country1_data.gas_production/1000000,country1_data.gas_exports,
					country1_data.elec_consumption/1000000,country1_data.gas_consumption/1000000,country1_data.gas_imports/1000,country1_data.oil_consumption/1000,
					country1_data.oil_imports]
					data_country2=[country2_data.elec_production,country2_data.gas_production,country2_data.gas_exports,
					country2_data.elec_consumption,country2_data.gas_consumption,country2_data.gas_imports,country2_data.oil_consumption,
					country2_data.oil_imports/1000]
					break;
				case 'health':
					features=["Birth Rate(/1000 people)","Life Expectancy (%)","People living with HIV","HIV prevalence rate(%)","Fertility rate(%)"]
					data_country1=[country1_data.birth_rate,country1_data.life_expectancy,country1_data.hiv_living,country1_data.hiv_prevalence,country1_data.fertility_rate]
					data_country2=[country2_data.birth_rate,country2_data.life_expectancy,country2_data.hiv_living,country2_data.hiv_prevalence,country2_data.fertility_rate]
					break;
				case 'tech':
					features=["Highways(km)","Internet Hosts","Telephone Mainlines","Railways","Internet Users","Mobile Lines"]
					data_country1=[country1_data.highways,country1_data.internet_hosts,country1_data.telephone_mainlines,country1_data.railways,
					country1_data.internet_users,country1_data.telephone_mobile]
					data_country2=[country2_data.highways,country2_data.internet_hosts,country2_data.telephone_mainlines,country2_data.railways,
					country2_data.internet_users,country2_data.telephone_mobile]
					break;
			}




				var c1= document.createElement("div")
					c1.innerHTML = "<h3>" + country1_data.country.toLocaleString("en-US")+"</h3>";
					c1.setAttribute("class","row");
				var c2= document.createElement("div")
					c2.innerHTML = "<h3>"+country2_data.country.toLocaleString("en-US")+"</h3>";
					c2.setAttribute("class","row");
				var f = document.createElement("div")
					f.innerHTML = "<h3><br></h3>";
					f.setAttribute("class","row");
					
					var c1_html = card_body.getElementsByClassName("country1")[0];
					var c2_html = card_body.getElementsByClassName("country2")[0];
					var f_html= card_body.getElementsByClassName("features")[0];



					c1_html.appendChild(c1);
					c2_html.appendChild(c2);
					f_html.appendChild(f);


			for(var i=0 ; i<features.length;i++){


				c1= document.createElement("div")
					c1.innerHTML = data_country1[i].toLocaleString("en-US");
					c1.setAttribute("class","row");
				c2= document.createElement("div")
					c2.innerHTML = data_country2[i].toLocaleString("en-US");
					c2.setAttribute("class","row");
				f = document.createElement("div")
					f.innerHTML = "<b>"+features[i].toLocaleString("en-US")+"<b>";
					f.setAttribute("class","row");
					


					c1_html.appendChild(c1);
					c2_html.appendChild(c2);
					f_html.appendChild(f);
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
