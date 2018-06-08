d3.csv("data/factbook.csv", function(error, data) {
	
	if (error) throw error;

	
	var sortAscending = true;
	var table = d3.select('#table').append('table');
	var titles = d3.keys(data[0]);
	var headers = table.append('thead').append('tr')
				   .selectAll('th')
				   .data(titles).enter()
				   .append('th')
				   .html(function (d) {
						return d;
					})
				   .on('click', function (d) {
					   headers.attr('class', 'header');
					   
					   if (sortAscending) {
						 rows.sort(function(a, b) { 
							if (isNaN(a[d])){ return d3.ascending(a[d], b[d]); }
							else { return b[d] - a[d];}});
						 sortAscending = false;
						 this.className = 'aes';
					   } else {
						 rows.sort(function(a, b) {
							if (isNaN(a[d])){ return d3.descending(a[d],b[d]); }
							else { return a[d] - b[d]; }});
						 sortAscending = true;
						 this.className = 'des';
					   }					   
				   });
	var rows = table.append('tbody').selectAll('tr')
			   .data(data).enter()
			   .append('tr');
	rows.selectAll('td')
	.data(function (d) {
		return titles.map(function (k) {
			return { 'value': numberWithCommas(d[k]), 'name': k};
		});
	}).enter()
	.append('td')
	.attr('data-th', function (d) {
		return d.name;
	})
	.text(function (d) {
		return d.value;
	});
});

function render_table(){
	if(document.getElementById("table").style.display == 'none'){
        document.getElementById("table").style.display = 'block';
        document.getElementById("map").style.display = 'none';
    } 
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}