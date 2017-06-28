let lastEvent = {};
function showEvent(event: any) {
    if (event !== lastEvent) {
        console.log(event);
        lastEvent = event;
        d3.select("#eventText").text(event.text);
    }
}