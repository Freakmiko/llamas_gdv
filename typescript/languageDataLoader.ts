
function loadKoreanData(language: string) {
    var data = [];
    d3.json(`/data/korea/${language}/election_2017.json`, (error, d: any) => {
        data = d3.merge([data, d.items]);
        d3.json(`/data/korea/${language}/ahn_cheol-soo.json`, (error, d: any) => {
            data = d3.merge([data, d.items]);
            d3.json(`/data/korea/${language}/hong_jun-pyo.json`, (error, d: any) => {
                data = d3.merge([data, d.items]);
                d3.json(`/data/korea/${language}/moon_jae-in.json`, (error, d: any) => {
                    data = d3.merge([data, d.items]);
                    d3.json(`/data/korea/${language}/sim_sang-jung.json`, (error, d: any) => {
                        data = d3.merge([data, d.items]);
                        d3.json(`/data/korea/${language}/yoo_seung-min.json`, (error, d: any) => {
                            data = d3.merge([data, d.items]);
                            lineGraph.renderGraph(data)
                        })
                    })
                })
            })
        })
    })
}

function loadKoreanCandidatePercentagesData(language: string) {
    loadCandidatePercentagesData(language, "korea");
}

function loadAustrianData(language: string) {
    let data = [];
    d3.json(`/data/austria/${language}/election_2016.json`, (error, d: any) => {
        if (!error)
            data = d3.merge([data, d.items]);
        d3.json(`/data/austria/${language}/alexander_van_der_bellen.json`, (error, d: any) => {
            if (!error)
                data = d3.merge([data, d.items]);
            d3.json(`/data/austria/${language}/andreas_khol.json`, (error, d: any) => {
                if (!error)
                    data = d3.merge([data, d.items]);
                d3.json(`/data/austria/${language}/irmgard_griss.json`, (error, d: any) => {
                    if (!error)
                        data = d3.merge([data, d.items]);
                    d3.json(`/data/austria/${language}/norbert_hofer.json`, (error, d: any) => {
                        if (!error)
                            data = d3.merge([data, d.items]);
                        d3.json(`/data/austria/${language}/rudolf_hundstorfer.json`, (error, d: any) => {
                            if (!error)
                                data = d3.merge([data, d.items]);
                            lineGraph.renderGraph(data)
                        })
                    })
                })
            })
        })
    })
}

function loadAustrianCandidatePercentagesData(language: string) {
    loadCandidatePercentagesData(language, "austria");
}

function loadCandidatePercentagesData(language: string, country: string) {
    d3.json(`/data/${country}/${language}/candidate_percentages.json`, (error, d: any) => {
        var charts = [];
        for (var i = 0; i < d.length; i++) {
            charts.push(new Barchart(`barchart`, i));
        }
        var currentDay = 0;
        d3.interval(function() {
            charts.forEach(function(element, index) {
                if (currentDay >= d[index].length)
                    element.renderGraph(d[index][currentDay - 1])
                else
                    element.renderGraph(d[index][currentDay])
            })
            currentDay++;
        }, 150)
    });
}

