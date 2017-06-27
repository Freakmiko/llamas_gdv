function loadKoreanData(language: string) {
    let data = [];
    d3.json(`/data/korea/${language}/election_2017.json`, (error, d: any) => {
        if (!error)
            data = d3.merge([data, d.items]);
        d3.json(`/data/korea/${language}/ahn_cheol-soo.json`, (error, d: any) => {
            if (!error)
                data = d3.merge([data, d.items]);
            d3.json(`/data/korea/${language}/hong_jun-pyo.json`, (error, d: any) => {
                if (!error)
                    data = d3.merge([data, d.items]);
                d3.json(`/data/korea/${language}/moon_jae-in.json`, (error, d: any) => {
                    if (!error)
                        data = d3.merge([data, d.items]);
                    d3.json(`/data/korea/${language}/sim_sang-jung.json`, (error, d: any) => {
                        if (!error)
                            data = d3.merge([data, d.items]);
                        d3.json(`/data/korea/${language}/yoo_seung-min.json`, (error, d: any) => {
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

function loadKoreanCandidatePercentagesData(language: string) {
    loadCandidatePercentagesData(language, "korea");
}

function loadUsaData(language: string) {
    let data = [];
    d3.json(`/data/usa/${language}/election_2016.json`, (error, d: any) => {
        if (!error)
            data = d3.merge([data, d.items]);
        d3.json(`/data/usa/${language}/bernie_sanders.json`, (error, d: any) => {
            if (!error)
                data = d3.merge([data, d.items]);
            d3.json(`/data/usa/${language}/donald_trump.json`, (error, d: any) => {
                if (!error)
                    data = d3.merge([data, d.items]);
                d3.json(`/data/usa/${language}/hillary_clinton.json`, (error, d: any) => {
                    if (!error)
                        data = d3.merge([data, d.items]);
                    d3.json(`/data/usa/${language}/john_kasich.json`, (error, d: any) => {
                        if (!error)
                            data = d3.merge([data, d.items]);
                        d3.json(`/data/usa/${language}/ted_cruz.json`, (error, d: any) => {
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

function loadUsaCandidatePercentagesData(language: string) {
    loadCandidatePercentagesData(language, "usa");
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
        let charts = [];
        for (let i = 0; i < d.length; i++) {
            charts.push(new Barchart(`barchart`, i));
        }
        let currentDay = 0;

        let groupedData: any = _.toArray(_.groupBy(d, "candidate"));
        let maximum = parseInt(d3.max<number>(groupedData[0], (datum: any) => datum.length));
        // console.log(groupedData);
        // console.log(maximum);

        d3.interval(function () {
            charts.forEach(function (element, index) {
                if (currentDay >= d[index].length)
                    element.renderGraph(d[index][currentDay - 1]);
                else
                    element.renderGraph(d[index][currentDay])
            });
            // console.log(`bar: ${currentDay}`)
            if (currentDay < maximum - 1)
                currentDay++;
        }, 3000/maximum)
    });
}

