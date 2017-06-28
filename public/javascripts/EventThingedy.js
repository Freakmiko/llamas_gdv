var lastEvent = {};
function showEvent(event) {
    if (event !== lastEvent) {
        lastEvent = event;
        d3.select("#eventText").text(event.text);
    }
}
//# sourceMappingURL=EventThingedy.js.map