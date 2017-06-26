function loadKoreanData(language) {
    var data = [];
    d3.json("/data/korea/" + language + "/election_2017.json", function (error, d) {
        data = d3.merge([data, d.items]);
        d3.json("/data/korea/" + language + "/ahn_cheol-soo.json", function (error, d) {
            data = d3.merge([data, d.items]);
            d3.json("/data/korea/" + language + "/hong_jun-pyo.json", function (error, d) {
                data = d3.merge([data, d.items]);
                d3.json("/data/korea/" + language + "/moon_jae-in.json", function (error, d) {
                    data = d3.merge([data, d.items]);
                    d3.json("/data/korea/" + language + "/sim_sang-jung.json", function (error, d) {
                        data = d3.merge([data, d.items]);
                        d3.json("/data/korea/" + language + "/yoo_seung-min.json", function (error, d) {
                            data = d3.merge([data, d.items]);
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
function loadCandidatePercentagesData(language, country) {
    d3.json("/data/" + country + "/" + language + "/candidate_percentages.json", function (error, d) {
        var charts = [];
        for (var i = 0; i < d.length; i++) {
            charts.push(new Barchart("barchart", i));
        }
        var currentDay = 0;
        d3.interval(function () {
            charts.forEach(function (element, index) {
                if (currentDay >= d[index].length)
                    element.renderGraph(d[index][currentDay - 1]);
                else
                    element.renderGraph(d[index][currentDay]);
            });
            currentDay++;
        }, 150);
    });
}
//# sourceMappingURL=languageDataLoader.js.map