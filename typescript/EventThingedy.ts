let lastEvent = {};
function showEvent(event: any) {
    if (event !== lastEvent) {
        lastEvent = event;
        d3.select("#eventText").text(event.text);
    }
}