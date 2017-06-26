/// <reference path="../node_modules/@types/d3/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/lodash/index.d.ts" />
var LineGraph = (function () {
    /**
     * Creates the line graph in the given svg-element
     * @param svgId The svg-element that the line graph will be created in
     * @constructor
     */
    function LineGraph(svgId) {
        var _this = this;
        this.parseDate = d3.timeParse("%Y%m%d00");
        var locale = {
            "dateTime": "%A, der %e. %B %Y, %X",
            "date": "%d.%m.%Y",
            "time": "%H:%M:%S",
            "periods": ["", ""],
            "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
            "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
        };
        d3.timeFormatDefaultLocale(locale);
        this.svgId = svgId;
        this.margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 50
        };
        this.size = {
            width: $("#" + this.svgId).parent().outerWidth() - this.margin.left - this.margin.right,
            height: $("#" + this.svgId).parent().outerHeight() - this.margin.top - this.margin.bottom
        };
        this.xScale = d3.scaleTime().range([0, this.size.width]);
        this.yScale = d3.scaleLinear().range([this.size.height, 0]);
        this.yAxis = d3.axisLeft(this.yScale).tickSize(0);
        this.xAxis = d3.axisBottom(this.xScale);
        this.data = [];
        this.zoomHistory = [];
        this.xBrush = d3.brushX();
        this.currentWidth = 0;
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory20).range(["#ed1c24", "#c1272d", "#0071bc", "#29abe2", "#5cd5ff"]);
        this.line = d3.line()
            .x(function (d) { return _this.xScale(_this.parseDate(d.timestamp)); })
            .y(function (d) { return _this.yScale(d.views); })
            .curve(d3.curveLinear);
        this.initialize();
        this.addListeners();
    }
    /**
     * Initializes the graph by adding the neccesarry
     * SVG-elements (clip, axis container, line graph container)
     */
    LineGraph.prototype.initialize = function () {
        var svg = d3.select("#" + this.svgId);
        svg.attr("width", this.size.width + this.margin.left + this.margin.right)
            .attr("height", this.size.height + this.margin.top + this.margin.bottom);
        // svg.append("g")
        //     .attr("class", "gridLines");
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.currentWidth)
            .attr("height", this.size.height + this.margin.top);
        svg.append("g")
            .attr("class", "lineGraph")
            .attr("clip-path", "url(#clip)")
            .attr("transform", "translate(" + this.margin.left + ", 0)")
            .append("path");
        // svg.append("g").attr("class", "brush").call(this.xBrush)
        //     .attr("transform", `translate(${this.margin.left},0)`);
        // svg.append("g")
        //     .attr("class", "leftAxis")
        //     .attr("transform", `translate(${this.margin.left}, 0)`)
        //     .call(this.yAxis)
        //     .select(".domain")
        //     .attr("stroke", "none");
        svg.append("g")
            .attr("class", "bottomAxis")
            .attr("transform", "translate(" + this.margin.left + ", " + this.size.height + ")")
            .call(this.xAxis);
        svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + this.margin.left + ", " + (this.size.height + this.margin.top + 5) + ")");
    };
    /**
     * Adds event listeners to its elements
     * to react to brush selection and so on
     */
    LineGraph.prototype.addListeners = function () {
        // this.xBrush.on("end", (datum: any, index: number, groups: SVGGElement[]) => {
        //     this.zoomHistory.push(this.xScale.domain())
        //     let domain = [this.xScale.invert(d3.brushSelection(groups[index])[0] as number),
        //                   this.xScale.invert(d3.brushSelection(groups[index])[1] as number)]
        //     this.xScale.domain(domain)
        //     d3.select(".brush").selectAll("*:not(.overlay)").style("display", "none")
        //     this.zoomHistory.push(domain)
        //     this.updatePageViews(d3.easeCircleInOut, 550)
        //     this.updateAxis()
        // })
    };
    /**
     * Renders the line graph with the given data
     * @param data The {any} that is used for the graph
     */
    LineGraph.prototype.renderGraph = function (data) {
        var _this = this;
        //console.log(data);
        //this.data = data;
        this.addData(data);
        this.updateScales(data);
        this.updateAxis();
        this.updateGrid();
        d3.select("#" + this.svgId).select(".maximumLine")
            .transition().duration(350).ease(d3.easeCircleOut)
            .attr("y1", this.yScale(d3.max(data, function (datum) { return datum.views; })))
            .attr("y2", this.yScale(d3.max(data, function (datum) { return datum.views; })));
        this.updatePageViews(d3.easeCircleOut, 200);
        d3.interval(function (elapsed) {
            var maximum = parseInt(d3.max(_this.groupedData, function (datum) { return datum.length; }));
            var stepsize = _this.size.width / maximum;
            _this.currentWidth += stepsize;
            d3.select("clipPath > rect").transition().duration(150).attr("width", _this.currentWidth);
        }, 150);
    };
    LineGraph.prototype.addData = function (data) {
        this.data = d3.merge([this.data, data]);
        this.groupedData = _.toArray(_.groupBy(this.data, "article"));
    };
    /**
     * Updates the pageViews linegraphs
     * by animating them using the given easing function
     * for the given duration
     * @param easingFn A easing function like d3.easeCircleOut
     * @param duration The duration of the transition animation
     */
    LineGraph.prototype.updatePageViews = function (easingFn, duration) {
        var _this = this;
        var g = d3.select("#" + this.svgId + " > g.lineGraph");
        var groupSelection = g.selectAll(".pageviews").data(this.groupedData);
        var pageviewsSelection = groupSelection.enter().append("g").attr("class", "pageviews");
        var transitionLine = d3.line()
            .x(function (d) { return _this.xScale(_this.parseDate(d.timestamp)); })
            .y(function (d) { return _this.yScale(0); })
            .curve(d3.curveLinear);
        pageviewsSelection.append("path").attr("d", function (d) { return transitionLine(d); })
            .merge(g.selectAll(".pageviews > path"))
            .transition().duration(duration).ease(easingFn)
            .attr("fill", "none")
            .attr("stroke", function (d) { return _this.colorScale(d[0].article); })
            .attr("stroke-width", "2")
            .attr("class", function (d) { return d[0].article; })
            .attr("d", function (d) { return _this.line(d); });
        // g.datum(this.data).attr("d", transitionLine(this.data))
        // //.merge(g.selectAll(".pageViews > path") as any)
        //     .transition().duration(duration).ease(easingFn)
        //     .attr("d", this.line)
        //     .attr("fill", "none")
        //     .attr("stroke", "#2a6093")
        //     .attr("stroke-width", "4");
        //let groupSelection = g.selectAll(".pageViews").datum(this.data)
        //let pageViewsSelection = groupSelection.enter()
        //    .append("g").attr("class", "pageViews")
        //pageViewsSelection.append("path")
        //    //.attr("d", (d: any) => transitionLine(d))
        //    //.merge(g.selectAll(".pageViews > path") as any)
        //    //.transition().duration(duration).ease(easingFn)
        //    .attr("fill", "black")
        //    .attr("stroke-width", "2")
        //    .attr("d", (d: any) => this.line(this.data))
        //    //.attr("clip-path", "url(#clip)")
        //    //.attr("stroke", (datum: any) => ColorScheme.getColor(datum[0]))
    };
    /**
     * Updates the y- and x-scales to
     * the domains of the new data
     * @param data The new data whose domains will be used
     */
    LineGraph.prototype.updateScales = function (data) {
        var _this = this;
        this.xScale.domain(d3.extent(data, function (d) { return _this.parseDate(d.timestamp.toString()); }));
        var yMaximumValue = d3.max(data, function (d) { return d.views; });
        yMaximumValue += d3.quantile(data, 0.5, function (datum) { return datum.views; });
        this.yScale.domain([0, yMaximumValue]);
    };
    /**
     * Updates the y- and the x-axis
     * by animating them to the updated ranges
     */
    LineGraph.prototype.updateAxis = function () {
        this.yAxis = d3.axisLeft(this.yScale).tickSize(0)
            .tickFormat(function (d) { return "" + d; });
        d3.select("#" + this.svgId).select("g.leftAxis")
            .transition().duration(500)
            .call(this.yAxis)
            .select(".domain")
            .attr("stroke", "none");
        this.xAxis = d3.axisBottom(this.xScale);
        d3.select("#" + this.svgId).select("g.bottomAxis")
            .transition().duration(500)
            .call(this.xAxis)
            .select(".domain")
            .attr("stroke", "#AAA");
    };
    /**
     * Updates the grid on the graph by animating
     * the existing lines to their respective positions
     * and adding new lines or removing lines that don't exist anymore
     */
    LineGraph.prototype.updateGrid = function () {
        var _this = this;
        var gridGroup = d3.select("#" + this.svgId).select("g.gridLines").selectAll("line")
            .data(this.yScale.ticks(), function (d) { return d; });
        gridGroup.exit().remove();
        gridGroup.enter().append("line")
            .attr("x1", this.margin.left)
            .attr("x2", this.margin.right + this.size.width)
            .merge(gridGroup)
            .transition().duration(500)
            .attr("y1", function (d) { return _this.yScale(d); })
            .attr("y2", function (d) { return _this.yScale(d); })
            .attr("stroke", "black")
            .attr("opacity", 0.2)
            .attr("stroke-width", 0.5 + "px");
    };
    return LineGraph;
}());
var lineGraph = new LineGraph("linegraph");
// d3.select("#korean-button").on("click", () => {
//     d3.json("/data/election_2017.json", (error, d: any) => {
//         var data = d.items;
//         lineGraph.renderGraph(data);
//     });
// });
// d3.select("#english-button").on("click", () => {
//     d3.json("/data/election_2017.json", (error, d: any) => {
//         var data = d.items;
//         lineGraph.renderGraph(data);
//     });
// });
// d3.select("#german-button").on("click", () => {
//     d3.json("/data/election_2017.json", (error, d: any) => {
//         var data = d.items;
//         lineGraph.renderGraph(data);
//     });
// });
//# sourceMappingURL=linegraph.js.map