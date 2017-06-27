function loadKoreanData(language) {
    var data = [];
    d3.json("/data/korea/" + language + "/election_2017.json", function (error, d) {
        if (!error)
            data = d3.merge([data, d.items]);
        d3.json("/data/korea/" + language + "/ahn_cheol-soo.json", function (error, d) {
            if (!error)
                data = d3.merge([data, d.items]);
            d3.json("/data/korea/" + language + "/hong_jun-pyo.json", function (error, d) {
                if (!error)
                    data = d3.merge([data, d.items]);
                d3.json("/data/korea/" + language + "/moon_jae-in.json", function (error, d) {
                    if (!error)
                        data = d3.merge([data, d.items]);
                    d3.json("/data/korea/" + language + "/sim_sang-jung.json", function (error, d) {
                        if (!error)
                            data = d3.merge([data, d.items]);
                        d3.json("/data/korea/" + language + "/yoo_seung-min.json", function (error, d) {
                            if (!error)
                                data = d3.merge([data, d.items]);
                            lineGraph.clearData();
                            lineGraph.renderGraph(data);
                        });
                    });
                });
            });
        });
    });
}
function loadKoreanCandidatePercentagesData(language) {
    loadCandidatePercentagesData(language, "korea");
}
function loadUsaData(language) {
    var data = [];
    d3.json("/data/usa/" + language + "/election_2016.json", function (error, d) {
        if (!error)
            data = d3.merge([data, d.items]);
        d3.json("/data/usa/" + language + "/bernie_sanders.json", function (error, d) {
            if (!error)
                data = d3.merge([data, d.items]);
            d3.json("/data/usa/" + language + "/donald_trump.json", function (error, d) {
                if (!error)
                    data = d3.merge([data, d.items]);
                d3.json("/data/usa/" + language + "/hillary_clinton.json", function (error, d) {
                    if (!error)
                        data = d3.merge([data, d.items]);
                    d3.json("/data/usa/" + language + "/john_kasich.json", function (error, d) {
                        if (!error)
                            data = d3.merge([data, d.items]);
                        d3.json("/data/usa/" + language + "/ted_cruz.json", function (error, d) {
                            if (!error)
                                data = d3.merge([data, d.items]);
                            lineGraph.clearData();
                            lineGraph.renderGraph(data);
                        });
                    });
                });
            });
        });
    });
}
function loadUsaCandidatePercentagesData(language) {
    loadCandidatePercentagesData(language, "usa");
}
function loadAustrianData(language) {
    var data = [];
    d3.json("/data/austria/" + language + "/election_2016.json", function (error, d) {
        if (!error)
            data = d3.merge([data, d.items]);
        d3.json("/data/austria/" + language + "/alexander_van_der_bellen.json", function (error, d) {
            if (!error)
                data = d3.merge([data, d.items]);
            d3.json("/data/austria/" + language + "/andreas_khol.json", function (error, d) {
                if (!error)
                    data = d3.merge([data, d.items]);
                d3.json("/data/austria/" + language + "/irmgard_griss.json", function (error, d) {
                    if (!error)
                        data = d3.merge([data, d.items]);
                    d3.json("/data/austria/" + language + "/norbert_hofer.json", function (error, d) {
                        if (!error)
                            data = d3.merge([data, d.items]);
                        d3.json("/data/austria/" + language + "/rudolf_hundstorfer.json", function (error, d) {
                            if (!error)
                                data = d3.merge([data, d.items]);
                            lineGraph.clearData();
                            lineGraph.renderGraph(data);
                        });
                    });
                });
            });
        });
    });
}
function loadAustrianCandidatePercentagesData(language) {
    loadCandidatePercentagesData(language, "austria");
}
function loadFrenchData(language) {
    var data = [];
    d3.json("/data/france/" + language + "/election_2017.json", function (error, d) {
        if (!error)
            data = d3.merge([data, d.items]);
        d3.json("/data/france/" + language + "/benoit_hamon.json", function (error, d) {
            if (!error)
                data = d3.merge([data, d.items]);
            d3.json("/data/france/" + language + "/emmanuel_macron.json", function (error, d) {
                if (!error)
                    data = d3.merge([data, d.items]);
                d3.json("/data/france/" + language + "/francois_fillon.json", function (error, d) {
                    if (!error)
                        data = d3.merge([data, d.items]);
                    d3.json("/data/france/" + language + "/jean_luc_melenchon.json", function (error, d) {
                        if (!error)
                            data = d3.merge([data, d.items]);
                        d3.json("/data/france/" + language + "/marine_le_pen.json", function (error, d) {
                            if (!error)
                                data = d3.merge([data, d.items]);
                            lineGraph.clearData();
                            lineGraph.renderGraph(data);
                        });
                    });
                });
            });
        });
    });
}
function loadFrenchCandidatePercentagesData(language) {
    loadCandidatePercentagesData(language, "france");
}
var currentDay = 0;
function loadCandidatePercentagesData(language, country) {
    d3.json("/data/" + country + "/" + language + "/candidate_final_percentages.json", function (error, finalPercentages) {
        d3.json("/data/" + country + "/" + language + "/candidate_percentages.json", function (error, d) {
            var charts = [];
            for (var i = 0; i < d.length; i++) {
                charts.push(new Barchart("barchart", i));
            }
            var groupedData = _.toArray(_.groupBy(d, "candidate"));
            var maximum = parseInt(d3.max(groupedData[0], function (datum) { return datum.length; }));
            // console.log(groupedData);
            // console.log(maximum);
            d3.interval(function () {
                charts.forEach(function (element, index) {
                    if (currentDay >= d[index].length)
                        element.renderGraph(d[index][currentDay - 1], finalPercentages);
                    else
                        element.renderGraph(d[index][currentDay], finalPercentages);
                });
                // console.log(`bar: ${currentDay}`)
                if (currentDay < maximum - 1)
                    currentDay++;
            }, 3000 / maximum);
        });
    });
}
//# sourceMappingURL=languageDataLoader.js.map