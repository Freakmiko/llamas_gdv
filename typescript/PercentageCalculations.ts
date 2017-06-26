function calculatePercentages(data: any) {
    let sum = 0;
    _.forEach(data, (t: any) => sum += t.views);
    this.groupedData = _.toArray(_.groupBy(data, "article"));
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
