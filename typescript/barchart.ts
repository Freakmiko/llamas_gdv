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

    nameMap = {
        "Moon_Jae-In": "images/Moon.jpg",
        "Hong_Jun-Pyo": "images/Hong.jpg",
        "Ahn_Cheol-Soo": "images/Ahn.jpg",
        "Yoo_Seung-Min": "images/Yoo.jpg",
        "Sim_Sang-Jung": "images/Sim.jpg",

        "Alexander_Van_der_Bellen": "images/Bellen.jpg",
        "Andreas_Khol": "images/Khol.jpg",
        "Irmgard_Griss": "images/Griss.jpg",
        "Norbert_Hofer": "images/Hofer.jpg",
        "Rudolf_Hundstorfer": "images/Hundstorfer.JPG",

        "Bernie_Sanders": "images/Sanders.jpg",
        "Donald_Trump": "images/Trump.jpg",
        "Hillary_Clinton": "images/Clinton.jpg",
        "John_Kasich": "images/Kasich.jpg",
        "Ted_Cruz": "images/Cruz.jpg",

        "François_Fillon": "images/Fillon.jpg",
        "Benoît_Hamon": "images/Hamon.jpg",
        "Marine_Le_Pen": "images/LePen.jpg",
        "Emmanuel_Macron": "images/Macron.jpg",
        "Jean-Luc_Mélenchon": "images/Melenchon.jpg"
    };

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
            right: 120,
            bottom: 40,
            left: 90
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
        svg.append("image").attr("width", 80).attr("height", 80);

        let firstBar = svg.append("g").attr("id", "bar");
        firstBar.append("rect").attr("width", 300);
        firstBar.append("text");

        let secondBar = svg.append("g").attr("id", "finalBar");
        secondBar.append("rect").attr("width", 300);
        secondBar.append("text");
    }

    /**
     * Renders the line graph with the given data
     * @param data The {any} that is used for the graph
     */
    renderGraph(data: any, percentages: any) {
        this.data = {"items": [data]};

        let svg = d3.select(`#barchart${this.svgIndex}`);

        if (this.data.items[0]) {
            svg.select("image").attr("href", this.nameMap[this.data.items[0].candidate]);

            let bar = svg.select("#bar").data(this.data.items);
            let barEnter = bar
                .attr("transform", (d, i) => `translate(${this.margin.left},${20})`);

            barEnter.select("rect")
                .transition().duration(10)
                .attr("width", (d: any) => this.xScale(d.viewPercentage))
                .attr("height", 20)
                .attr("class", (d: any) => d.candidate);

            svg.select("#bar text").data(this.data.items)
                .attr("transform", (datum: any) => `translate(${this.xScale(datum.viewPercentage) + 8}, 14)`)
                .text((datum: any) => datum.viewPercentage);

            let candidate = _.find(percentages, (element: any) => this.data.items[0].candidate === element.candidate);
            let finalPercentages =  {"items": [candidate]};
            if (candidate) {
                svg.select("#finalBar").data(finalPercentages.items)
                    .attr("transform", `translate(${this.margin.left}, ${45})`)
                    .select("rect")
                    .attr("width", (d: any) => this.xScale(d.viewPercentage))
                    .attr("height", 20)
                    .attr("class", (d: any) => d.candidate);

                svg.select("#finalBar text").data(finalPercentages.items)
                    .attr("transform", (datum: any) => `translate(${this.xScale(datum.viewPercentage) + 8}, 14)`)
                    .text((datum: any) => datum.viewPercentage);
            }

        } else {
            svg.select("rect").classed("not_available", true);
            svg.select("#finalBar rect").classed("not_available", true);
        }
    }
}
