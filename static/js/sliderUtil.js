var createSliders = function(sliderInfo, onSlide) {
    // 各Slider要素を収める<div>
    var paramDiv = d3.select("#parameter-container");

    // それぞれのSliderを作成
    sliderInfo.forEach(function(s) {
	// Parameterの値とSliderの要素を作成
	var div = paramDiv.append("div")
	paramDiv.append("br");
	div.text(s.text);
	var valueElem = div.append("span")
	    .attr("id", s.valueId)
	    .text(s.start);
	div.append("div")
	    .attr("id", s.id)
	    .attr("class", "slider slider-primary");

	// noUiSliderを作成
	var slider = noUiSlider.create(document.getElementById(s.id), {
	    start: s.start,
	    step: s.step,
	    connect: "lower",
	    range: {
		min: s.min,
		max: s.max
	    }
	});

	// sliderにコールバックを登録
	slider.on("slide", function() {
	    var values = {};
	    sliderInfo.forEach(function (i) {
		values[i.name] = document.getElementById(i.id).noUiSlider.get();
	    });
	    valueElem.text(document.getElementById(s.id).noUiSlider.get());
	    onSlide(values);
	});
    });
}

