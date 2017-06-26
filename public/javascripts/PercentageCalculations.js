function calculatePercentages(data) {
    var sum = 0;
    _.forEach(data, function (t) { return sum += t.views; });
    this.groupedData = _.toArray(_.groupBy(data, "article"));
    var candidateData = [];
    _.forEach(this.groupedData, function (t) {
        var currentSum = 0;
        candidateData.push([]);
        _.forEach(t, function (candidate) {
            currentSum += candidate.views;
            candidateData[candidateData.length - 1].push({
                candidate: candidate.article,
                viewPercentage: currentSum / sum * 100
            });
        });
    });
    console.log(JSON.stringify(candidateData));
}
//# sourceMappingURL=PercentageCalculations.js.map