/// <reference path="../node_modules/@types/d3/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/lodash/index.d.ts" />

class Barchart {
    data: any;
    groupedData: any;
    line: any;
    margin: any;
    maximumCircle: any;
    parseDate = d3.timeParse("%Y%m%d00");
    size: any;
    divId: string;
    svgIndex: number;
    xAxis: any;
    xBrush: any;
    xScale: any;
    yAxis: any;
    yScale: any;
    zoomHistory: Date[][];
    colorScale: any;

    /**
     * Creates the line graph in the given svg-element
     * @param svgId The svg-element that the line graph will be created in
     * @constructor
     */
    constructor(divId: string, svgIndex: number) {
        this.divId = divId;
        this.svgIndex = svgIndex;
        this.margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 50
        };
        this.size = {
            width: $(`#${this.divId}`).parent().outerWidth() - this.margin.left - this.margin.right,
            // height: $(`#${this.divId}`).parent().outerHeight() / 4 - this.margin.top - this.margin.bottom
            height: 60
        };

        // this.xScale = d3.scaleTime().range([0, this.size.width]);
        this.xScale = d3.scaleLinear().range([0, this.size.width]).domain([0, 100]);

        this.yScale = d3.scaleLinear().range([this.size.height, 0]);
        this.yAxis = d3.axisLeft(this.yScale).tickSize(0);
        this.xAxis = d3.axisBottom(this.xScale);
        this.data = [];
        this.zoomHistory = [];
        this.xBrush = d3.brushX();

        this.colorScale = d3.scaleOrdinal(d3.schemeCategory20).range(["#ed1c24", "#c1272d" , "#0071bc" , "#29abe2" , "#5cd5ff"]);

        this.line = d3.line()
            .x((d: any) => this.xScale(this.parseDate(d.timestamp)))
            .y((d: any) => this.yScale(d.views))
            .curve(d3.curveLinear);

        this.initialize();
    }

    /**
     * Initializes the graph by adding the neccesarry
     * SVG-elements (clip, axis container, line graph container)
     */
    initialize() {
        let svg = d3.select(`#${this.divId}`).append("svg").attr("id", `barchart${this.svgIndex}`);

        svg.attr("width", this.size.width + this.margin.left + this.margin.right)
            .attr("height", this.size.height + this.margin.top + this.margin.bottom);
    }

    /**
     * Renders the line graph with the given data
     * @param data The {any} that is used for the graph
     */
    renderGraph(data: any) {
        this.data = {"items": [data]};
        //console.log(this.data);
        this.updateScales(data);

        let g = d3.select(`#barchart${this.svgIndex}`);
        var bar = g.selectAll("g").data(this.data.items, (d: any) => d.viewPercentage)
        var barEnter = bar.enter().append("g")
            .attr("transform", (d, i) => `translate(0,${ 20})`);

        barEnter.append("rect")
            .attr("width", (d: any) => this.xScale(d.viewPercentage))
            .attr("height", 20);

        bar.exit().remove();
        //this.updatePageViews(d3.easeCircleOut, 200);
    }

    calculatePercentages(data: any)  {
        let sum = 0;
        _.forEach(data, (t: any) => sum += t.views);
        this.groupedData = _.toArray(_.groupBy(data, "article"))
        let candidateData = [];
        _.forEach(this.groupedData, (t: any) => {
            let currentSum = 0;
            candidateData.push([]);
            _.forEach(t, (candidate: any) => {
                currentSum += candidate.views;
                candidateData[candidateData.length - 1].push({
                    candidate: candidate.article,
                    viewPercentage: currentSum / sum * 100
                })
            });
        });
        console.log(JSON.stringify(candidateData));
    }

    /**
     * Updates the pageViews linegraphs
     * by animating them using the given easing function
     * for the given duration
     * @param easingFn A easing function like d3.easeCircleOut
     * @param duration The duration of the transition animation
     */
    updatePageViews(easingFn: (normalizedTime: number) => number, duration: number) {
        // let g = d3.select(`#${this.divId} > g.lineGraph`);
        // let groupSelection = g.selectAll(".pageviews").data(this.groupedData);
        // let pageviewsSelection = groupSelection.enter().append("g").attr("class", "pageviews");
        // let transitionLine = d3.line()
        //     .x((d: any) => this.xScale(this.parseDate(d.timestamp)))
        //     .y((d: any) => this.yScale(0))
        //     .curve(d3.curveLinear);
        //
        //
        // pageviewsSelection.append("path").attr("d", (d: any[]) => transitionLine(d))
        //     .merge(g.selectAll(".pageviews > path") as any)
        //     .transition().duration(duration).ease(easingFn)
        //     .attr("fill", "none")
        //     .attr("stroke", (d: any) => this.colorScale(d[0].article))
        //     .attr("stroke-width", "2")
        //     .attr("d", (d: any[]) => this.line(d))
    }

    /**
     * Updates the y- and x-scales to
     * the domains of the new data
     * @param data The new data whose domains will be used
     */
    updateScales(data: any[]) {
        // this.xScale.domain(
        //     d3.extent(
        //         data,
        //         (d: any) => this.parseDate(d.timestamp.toString())
        //     ) as [Date, Date]
        // );
        //this.xScale.domain(0, 100);

        // let yMaximumValue = d3.max(data, (d: any) => d.views);
        // yMaximumValue += d3.quantile(data, 0.5, (datum: any) => datum.views);
        // this.yScale.domain([0, yMaximumValue]);
    }

    /**
     * Updates the y- and the x-axis
     * by animating them to the updated ranges
     */
    updateAxis() {
        this.yAxis = d3.axisLeft(this.yScale).tickSize(0)
            .tickFormat((d: number) => { return `${d}`});
        d3.select(`#${this.divId}`).select("g.leftAxis")
            .transition().duration(500)
            .call(this.yAxis as any)
            .select(".domain")
            .attr("stroke", "none");

        this.xAxis = d3.axisBottom(this.xScale);
        d3.select(`#${this.divId}`).select("g.bottomAxis")
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
        let gridGroup = d3.select(`#${this.divId}`).select("g.gridLines").selectAll("line")
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
