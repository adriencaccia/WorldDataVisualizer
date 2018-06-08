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
	
	
	var country_list = g.selectAll('path').data();
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
		
	  } else {g.selectAll('path').style('fill','#cde');}

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
