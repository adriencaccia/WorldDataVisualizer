d3.csv("data/factbook.csv")
  .row(function(d){
    return{
		country: d["Country"],
		area_sqkm: +d["Area(sq km)"],
		birth_rate: +d["Birth rate(births/1000 population)"],
		account_balance: +d["Current account balance"],
		death_rate: +d["Death rate(deaths/1000 population)"],
		debt_external: +d["Debt - external"],
		debt_public: +d["Public debt(% of GDP)"],
		elec_consumption: +d["Electricity - consumption(kWh)"],
		elec_production :+d["Electricity - production(kWh)"],
		exports: +d["Exports"],
		gdp: +d["GDP"],
		gdp_percapita: +d["GDP - per capita"],
		gdp_growthrate: +d["GDP - real growth rate(%)"],
		hiv_prevalence: +d["HIV/AIDS - adult prevalence rate(%)"],
		hiv_deaths: +d["HIV/AIDS - deaths"],
		hiv_living: +d["HIV/AIDS - people living with HIV/AIDS"],
		highways: +d["Highways(km)"],
		imports: +d["Imports"],
		industry: +d["Industrial production growth rate(%)"],
		infant_mortality: +d["Infant mortality rate(deaths/1000 live births)"],
		inflation: +d["Inflation rate (consumer prices)(%)"],
		internet_hosts: +d["Internet hosts"],
		internet_users: +d["Internet users"],
		investment: +d["Investment (gross fixed)(% of GDP)"],
		labor_force: +d["Labor force"],
		life_expectancy: +d["Life expectancy at birth(years)"],
		military_dollar: +d["Military expenditures - dollar figure"],
		military_gdp: +d["Military expenditures - percent of GDP(%)"],
		gas_consumption: +d["Natural gas - consumption(cu m)"],
		gas_exports: +d["Natural gas - exports(cu m)"],
		gas_imports: +d["Natural gas - imports(cu m)"],
		gas_production: +d["Natural gas - production(cu m)"],
		gas_reserves: +d["Natural gas - proved reserves(cu m)"],
		oil_consumption: +d["Oil - consumption(bbl/day)"],
		oil_exports: +d["Oil - exports(bbl/day)"],
		oil_imports: +d["Oil - imports(bbl/day)"],
		oil_production: +d["Oil - production(bbl/day)"],
		oil_reserves: +d["Oil - proved reserves(bbl)"],
		population: +d["Population"],
		railways: +d["Railways(km)"],
		gold_reserves: +d["Reserves of foreign exchange & gold"],
		telephone_mainlines: +d["Telephones - main lines in use"],
		telephone_mobile: +d["Telephones - mobile cellular"],
		fertility_rate: +d["Total fertility rate(children born/woman)"],
		unemployment: +d["Unemployment rate(%)"]	
    };
  })
  .get(function(error, rows){
    /*console.log("Loaded " + rows.length + " rows");
    if (rows.length > 0){
      console.log("First row: ", rows[0])
      console.log("Last row: ", rows[rows.length-1])
    }*/
    dataset = rows;
  });


var data_type = 'general';
var data_name = 'none';
var data_name_pretty ='none';
var data_unit = '';
var dataset_names = [];
var legendsvg;

var tooltip = d3.select("body")
	.append("div")
	.attr("id","tooltip");

function setDataType(type){
	data_type = type;
	update_tooltip();
}

function setDataName(name,pretty){
	data_name = name;
	data_name_pretty = pretty;
	
	switch (data_name) {
				case 'area_sqkm':
					data_unit = " km²";
					break;
				case 'population':
					data_unit = " inh.";
					break;
				case 'gdp': case 'debt_external': case 'imports': case 'account_balance': case 'exports': case 'military_dollar': case 'gold_reserves':
					data_unit = " USD";
					break;
				case 'inflation': case 'unemployment': case 'gdp_growthrate': case 'hiv_prevalence':
					data_unit = " %";
					break;
				case 'gdp_percapita':
					data_unit = " USD/inh.";
					break;
				case 'debt_public': case 'investment': case 'military_gdp':
					data_unit = " % of GDP";
					break;
				case 'labor_force':
					data_unit = " people";
					break;
				case 'elec_consumption': case 'elec_production':
					data_unit = " kWh";
					break;
				case 'gas_consumption': case 'gas_exports': case 'gas_imports': case 'gas_production':
					data_unit = " m&sup3";
					break;
				case 'oil_consumption': case 'oil_exports': case 'oil_imports': case 'oil_production':
					data_unit = " bbl/day";
					break;
				case 'birth_rate':
					data_unit = " births/1000 people";
					break;
				case 'life_expectancy':
					data_unit = " years";
					break;
				case 'death_rate':
					data_unit = " deaths/1000 people";
					break;
				case 'infant_mortality':
					data_unit = " deaths/1000 live births";
					break;
				case 'fertility_rate':
					data_unit = " children/woman";
					break;
				case 'highways': case 'railways':
					data_unit = " km";
					break;
				default:
					data_unit = "";
			}
	update_tooltip();
	
	
	var country_list = svg.selectAll('path').data();
	var name_list = [];
	
	for (var i = 0; i < country_list.length; i++)
	{
		name_list.push(country_list[i].properties.name);
	}
	
	if (data_name != 'none') {
		var data_name_array = [];
		
		for (var i = 0; i < name_list.length; i++) {
			for (var j = 0; j < dataset.length; j++) {
				if (name_list[i] == dataset[j].country){
					data_name_array.push(dataset[j][data_name]);
				}
			}
		}
		var max = d3.max(data_name_array);
		var min = d3.min(data_name_array);
		
		var range = max - min;
		for (var i = 0; i < data_name_array.length; i++)
		{
			data_name_array[i] /= range;
		}
		
		if (document.getElementById("map").style.display != 'none'){
			svg.selectAll('path')	
				.style('fill',function(d,i) { return d3.interpolateReds(data_name_array[i]) });
		}
		
		else if (document.getElementById("globe").style.display != 'none') {
			svgGlobe.selectAll('path')
				.style('fill',function(d,i) { return d3.interpolateReds(data_name_array[i]) });
		}
		
		} else {
			svg.selectAll('path').style('fill','#cde');
			svgGlobe.selectAll('path').style('fill','#cde');
		}

	  update_tooltip();
	  
	  var defs = d3.select('#legend').append("defs");
	  var linearGradient = defs.append("linearGradient")
		.attr("id", "linear-gradient");
		
	  linearGradient
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "0%");
		
	  linearGradient.selectAll("stop") 
		.data([                             
			{offset: "0%", color: d3.interpolateReds(0)}, 
			{offset: "12.5%", color: d3.interpolateReds(0.125)},  
			{offset: "25%", color: d3.interpolateReds(0.25)}, 
			{offset: "37.5%", color: d3.interpolateReds(0.375)}, 
			{offset: "50%", color: d3.interpolateReds(0.5)}, 
			{offset: "62.5%", color: d3.interpolateReds(0.625)}, 
			{offset: "75%", color: d3.interpolateReds(0.75)},      
			{offset: "87.5%", color: d3.interpolateReds(0.875)},        
			{offset: "100%", color: d3.interpolateReds(1)}    
		  ])                  
			.enter().append("stop")
			.attr("offset", function(d) { return d.offset; })   
			.attr("stop-color", function(d) { return d.color; });
		
		var legendWidth = 400;
		
		legendsvg = d3.select('#legend').append("g")
			.attr("class", "legendWrapper")
			.attr("transform", "translate(" + (width/2) + ",0)");
		
		var xScale = d3.scaleLinear()
			.range([-legendWidth/2, legendWidth/2])
			.domain([ min, max] );
				
		var xAxis = d3.axisBottom()
			  .ticks(5)
			  .scale(xScale);
			  
		/*legendsvg.append("rect")
			.attr("width", 400)
			.attr("height", 20)
			.style("fill", "url(#linear-gradient)");
			
		legendsvg.append("text")
			.attr("class", "legendTitle")
			.attr("x", -50)
			.attr("y", 20)
			.style("text-anchor", "middle")
			.html(data_name_pretty + " ("+data_unit+" )");	
			
		legendsvg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(200,25)")
			.transition()
			.call(xAxis);*/
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
