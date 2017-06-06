/// <reference path="../node_modules/@types/d3/index.d.ts" />

d3.json("/data/korean_election_2017_de.json", (error, d: any) => {
    var data = d.items;
    var svg = d3.select("#donut"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        radius = Math.min(width, height) / 2,
        g =  svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var pie = d3.pie().sort(null).value((data: any) => data.views);
    var path: any = d3.arc().outerRadius(radius - 10).innerRadius(radius - 30).padAngle(0.01);

    var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path").attr("d", path)
        .attr("fill", (data: any) => color(data.views));
});
