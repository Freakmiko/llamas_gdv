/// <reference path="../node_modules/@types/d3/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
class LineGraph {
    data: any;
    line: any;
    margin: any;
    maximumCircle: any;
    parseDate = d3.timeParse("%Y%m%d00");
    size: any;
    svgId: string;
    xAxis: any;
    xBrush: any;
    xScale: any;
    yAxis: any;
    yScale: any;
    zoomHistory: Date[][];

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
            height: 720
        };
        this.xScale = d3.scaleTime().range([0, this.size.width]);
        this.yScale = d3.scaleLinear().range([this.size.height, 0]);
        this.yAxis = d3.axisLeft(this.yScale).tickSize(0);
        this.xAxis = d3.axisBottom(this.xScale);
        this.data = [];
        this.zoomHistory = [];
        this.xBrush = d3.brushX();

        this.line = d3.line()
            .x((d: any) => this.xScale(this.parseDate(d.timestamp)))
            .y((d: any) => {console.log(d); return this.yScale(d.views)})
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

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.size.width)
            .attr("height", this.size.height + this.margin.top);

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
            .attr("class", "bottomAxis")
            .attr("transform", `translate(${this.margin.left}, ${this.size.height})`)
            .call(this.xAxis);

        // svg.append("g")
        //     .attr("class", "legend")
        //     .attr("transform", `translate(${this.margin.left}, ${this.size.height + this.margin.top + 5})`);
    }

    /**
     * Adds event listeners to its elements
     * to react to brush selection and so on
     */
    addListeners() {
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
    }

    /**
     * Renders the line graph with the given data
     * @param data The {any} that is used for the graph
     */
    renderGraph(data: any) {
        //console.log(data);
        this.data = data;
        this.updateScales(data);
        this.updateAxis();
        this.updateGrid();

        d3.select(`#${this.svgId}`).select(".maximumLine")
            .transition().duration(350).ease(d3.easeCircleOut)
            .attr("y1", this.yScale(d3.max(data, (datum: any) => datum.views)))
            .attr("y2", this.yScale(d3.max(data, (datum: any) => datum.views)));

        this.updatePageViews(d3.easeCircleOut, 300);
    }

    /**
     * Updates the pageViews linegraphs
     * by animating them using the given easing function
     * for the given duration
     * @param easingFn A easing function like d3.easeCircleOut
     * @param duration The duration of the transition animation
     */
    updatePageViews(easingFn: (normalizedTime: number) => number, duration: number) {
        let g = d3.select(`#${this.svgId} > g.lineGraph > path`);

        let transitionLine = d3.line()
            .x((d: any) => this.xScale(this.parseDate(d.timestamp)))
            .y((d: any) => this.yScale(0))
            .curve(d3.curveLinear);

        g.datum(this.data).attr("d", transitionLine(this.data))
        //.merge(g.selectAll(".pageViews > path") as any)
            .transition().duration(duration).ease(easingFn)
            .attr("d", this.line)
            .attr("fill", "none")
            .attr("stroke", "#0071B9")
            .attr("stroke-width", "6");
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
            .attr("stroke", "#DFDFDF");
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

d3.select("#korean-button").on("click", () => {
    d3.json("/data/korean_election_2017_ko.json", (error, d: any) => {
        var data = d.items;
        lineGraph.renderGraph(data);
    });
});
d3.select("#english-button").on("click", () => {
    d3.json("/data/korean_election_2017_en.json", (error, d: any) => {
        var data = d.items;
        lineGraph.renderGraph(data);
    });
});
d3.select("#german-button").on("click", () => {
    d3.json("/data/korean_election_2017_de.json", (error, d: any) => {
        var data = d.items;
        lineGraph.renderGraph(data);
    });
});