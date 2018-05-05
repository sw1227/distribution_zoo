// TODO: <div>も動的に作って欲しい
var createSliders = function(sliderInfo, onSlide) {
    sliderInfo.forEach(function(s) {
	var slider = noUiSlider.create(s.element, {
	    start: s.start,
	    step: s.step,
	    connect: "lower",
	    range: {
		min: s.min,
		max: s.max
	    }
	});
	slider.on("slide", function() {
	    var values = {};
	    sliderInfo.forEach(function (i) {
		values[i.name] = i.element.noUiSlider.get();
	    });
	    d3.select(s.valueId).text(s.element.noUiSlider.get());
	    onSlide(values);
	});
    });
}

