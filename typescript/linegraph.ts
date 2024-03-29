/// <reference path="../node_modules/@types/d3/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/lodash/index.d.ts" />

class LineGraph {
    data: any;
    groupedData: any;
    line: any;
    margin: any;
    maximumCircle: any;
    parseDate = d3.timeParse("%Y%m%d00");
    parseEventDate = d3.timeParse("%Y%m%d");
    size: any;
    svgId: string;
    xAxis: any;
    xBrush: any;
    xScale: any;
    yAxis: any;
    yScale: any;
    zoomHistory: Date[][];
    colorScale: any;
    currentWidth: number;
    events: any;

    /**
     * Creates the line graph in the given svg-element
     * @param svgId The svg-element that the line graph will be created in
     * @constructor
     */
    constructor(svgId: string) {
        let locale = {
            "dateTime": "%A, der %e. %B %Y, %X",
            "date": "%d.%m.%Y",
            "time": "%H:%M:%S",
            "periods": ["", ""],
            "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
            "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
        };

        d3.timeFormatDefaultLocale(locale as any);

        this.svgId = svgId;
        this.margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 50
        };
        this.size = {
            width: $(`#${this.svgId}`).parent().outerWidth() - this.margin.left - this.margin.right,
            height: $(`#${this.svgId}`).parent().outerHeight() - this.margin.top - this.margin.bottom
        };
        this.xScale = d3.scaleTime().range([0, this.size.width]);
        this.yScale = d3.scaleLinear().range([this.size.height, 0]);
        this.yAxis = d3.axisLeft(this.yScale).tickSize(0);
        this.xAxis = d3.axisBottom(this.xScale);
        this.data = [];
        this.zoomHistory = [];
        this.xBrush = d3.brushX();
        this.currentWidth = 0;

        this.colorScale = d3.scaleOrdinal(d3.schemeCategory20).range(["#f204ea"]);

        this.line = d3.line()
            .x((d: any) => this.xScale(this.parseDate(d.timestamp)))
            .y((d: any) => this.yScale(d.views))
            .curve(d3.curveLinear);

        this.initialize();
        this.addListeners();
    }

    /**
     * Initializes the graph by adding the neccesarry
     * SVG-elements (clip, axis container, line graph container)
     */
    initialize() {
        let svg = d3.select(`#${this.svgId}`);

        svg.attr("width", this.size.width + this.margin.left + this.margin.right)
            .attr("height", this.size.height + this.margin.top + this.margin.bottom);

        // svg.append("g")
        //     .attr("class", "gridLines");
        svg.append("g")
            .attr("class", "bottomAxis")
            .attr("transform", `translate(${this.margin.left}, ${this.size.height})`)
            .call(this.xAxis);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.currentWidth)
            .attr("height", this.size.height + this.margin.top + this.margin.bottom);

        svg.append("g")
            .attr("class", "lineGraph")
            .attr("clip-path", "url(#clip)")
            .attr("transform", `translate(${this.margin.left}, 0)`)
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
            .attr("class", "legend")
            .attr("transform", `translate(${this.margin.left}, ${this.size.height + this.margin.top + 5})`);

        svg.append("line")
            .attr("class", "selectionLine")
            .attr("x1", this.margin.left)
            .attr("x2", this.margin.left)
            .attr("y1", 0)
            .attr("y2", this.size.height)
            .attr("stroke-dasharray", "0, 4")
            .attr("stroke-width", "1.75")
            .attr("stroke-linecap", "round")
            .style("stroke", "#2ECC71")
            .style("pointer-events", "none")

    }

    /**
     * Adds event listeners to its elements
     * to react to brush selection and so on
     */
    addListeners() {
        d3.select(`#${this.svgId}`)
            .on("contextmenu", () => {
                d3.event.preventDefault();
            })
            .on("mousemove", () => {
                let mouseDate = this.xScale.invert(d3.mouse(d3.event.currentTarget)[0] - this.margin.left);
                let mappedValues = _.map(this.events, (value: any) => {
                    return [value.date, Math.abs(this.parseEventDate(value.date).valueOf() - mouseDate.valueOf())]
                });

                let closestDate = _.reduce(mappedValues,
                    (memo: any[], value: any[]) => {
                        return memo[1] < value[1] ? memo : value;
                    })[0];

                showEvent(_.find(this.events, (event: any) => event.date == closestDate));

                d3.selectAll("circle").attr("fill", "#333333");
                d3.select(`#${this.svgId} #e${closestDate}`).attr("fill", "#4fbc64");

                d3.select(`#${this.svgId}`).select(".selectionLine")
                    .attr("x1", this.xScale(this.parseEventDate(closestDate)) + this.margin.left)
                    .attr("x2", this.xScale(this.parseEventDate(closestDate)) + this.margin.left)
            })
    }

    /**
     * Renders the line graph with the given data
     * @param data The {any} that is used for the graph
     */
    renderGraph(data: any) {
        this.addData(data);

        this.updateScales(data);
        this.updateAxis();

        this.updatePageViews(d3.easeCircleOut, 10);

        let maximum = parseInt(d3.max<number>(this.groupedData, (datum: any) => datum.length));
        let stepsize = (this.size.width - this.margin.left - this.margin.right) / maximum;

        let g = d3.select(`#${this.svgId} > g.lineGraph`)
        g.selectAll("circle.eventLine").data(this.events)
            .enter().append("circle").attr("class", "eventLine")
            .attr("cx", (datum: any) => this.xScale(this.parseEventDate(datum.date)))
            .attr("cy", this.size.height + this.margin.bottom - 10)
            .attr("r", 10)
            .attr("id", (datum: any) => `e${datum.date}`)
            .attr("fill", "#333333");
            // .attr("stroke-width", "1")
            // .style("stroke", "#000000")
            // .style("pointer-events", "none");

        d3.interval((elapsed: number) => {
                this.currentWidth += stepsize;
                d3.select("clipPath > rect").transition().duration(3000/maximum).attr("width", this.currentWidth)
        }, 3000/maximum);
    }

    addData(data: any) {
        this.data = d3.merge([this.data, data]);
        this.groupedData = _.toArray(_.groupBy(this.data, "article"))
    }

    addEvents(events: any) {
        this.events = events;
        console.log(events);
    }

    clearData() {
        this.data = [];
        this.currentWidth = 0;
        d3.select("clipPath > rect").attr("width", this.currentWidth);
    }

    /**
     * Updates the pageViews linegraphs
     * by animating them using the given easing function
     * for the given duration
     * @param easingFn A easing function like d3.easeCircleOut
     * @param duration The duration of the transition animation
     */
    updatePageViews(easingFn: (normalizedTime: number) => number, duration: number) {
        let g = d3.select(`#${this.svgId} > g.lineGraph`);
        let groupSelection = g.selectAll(".pageviews").data(this.groupedData);
        let pageviewsSelection = groupSelection.enter().append("g").attr("class", "pageviews");
        let transitionLine = d3.line()
            .x((d: any) => this.xScale(this.parseDate(d.timestamp)))
            .y((d: any) => this.yScale(0))
            .curve(d3.curveLinear);

        pageviewsSelection.append("path").attr("d", (d: any[]) => transitionLine(d))
            .merge(g.selectAll(".pageviews > path") as any)
            .transition().duration(duration).ease(easingFn)
            .attr("fill", "none")
            .attr("stroke-width", "4")
            .attr("class", (d: any[]) => d[0].article.replace(",", ""))
            .attr("d", (d: any[]) => this.line(d))
    }

    /**
     * Updates the y- and x-scales to
     * the domains of the new data
     * @param data The new data whose domains will be used
     */
    updateScales(data: any[]) {
        this.xScale.domain(
            d3.extent(
                data,
                (d: any) => this.parseDate(d.timestamp.toString())
            ) as [Date, Date]
        );
        let yMaximumValue = d3.max(data, (d: any) => d.views);
        yMaximumValue += d3.quantile(data, 0.5, (datum: any) => datum.views);
        this.yScale.domain([0, yMaximumValue]);
    }

    /**
     * Updates the y- and the x-axis
     * by animating them to the updated ranges
     */
    updateAxis() {
        this.yAxis = d3.axisLeft(this.yScale).tickSize(0)
            .tickFormat((d: number) => { return `${d}`});
        d3.select(`#${this.svgId}`).select("g.leftAxis")
            .transition().duration(500)
            .call(this.yAxis as any)
            .select(".domain")
            .attr("stroke", "none");

        this.xAxis = d3.axisBottom(this.xScale);
        d3.select(`#${this.svgId}`).select("g.bottomAxis")
            .transition().duration(500)
            .call(this.xAxis as any)
            .select(".domain")
            .attr("stroke", "#AAA");
    }

    /**
     * Updates the grid on the graph by animating
     * the existing lines to their respective positions
     * and adding new lines or removing lines that don't exist anymore
     */
    updateGrid() {
        let gridGroup = d3.select(`#${this.svgId}`).select("g.gridLines").selectAll("line")
            .data(this.yScale.ticks(), (d: any) => d);

        gridGroup.exit().remove();

        gridGroup.enter().append("line")
            .attr("x1", this.margin.left)
            .attr("x2", this.margin.right + this.size.width)
            .merge(gridGroup)
            .transition().duration(500)
            .attr("y1", (d: any) => this.yScale(d))
            .attr("y2", (d: any) => this.yScale(d))
            .attr("stroke", "black")
            .attr("opacity", 0.2)
            .attr("stroke-width", `${0.5}px`);
    }
}

let lineGraph = new LineGraph("linegraph");

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
