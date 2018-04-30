// 描画領域: 幅はparentに合わせる
var svg = d3.select("svg#chart")
    .attr("width", $("#chart").parent().width())
    .attr("height", 400);

// マージンの処理
var margin = {top: 20, right: 20, bottom: 40, left: 50};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x, yのスケール
var xScale = d3.scaleLinear()
    .rangeRound([0, width]);
var yScale = d3.scaleLinear()
    .rangeRound([height, 0]);

// PDF: 折れ線グラフ
var pdfLine = d3.line();
var cdfLine = d3.line();
// PDF: Area
var pdfArea = d3.area();


// ----- slider -----
var sliderMean = document.getElementById("sliderMean");
noUiSlider.create(sliderMean, {
    start: 0,
    step: 0.5,
    connect: "lower",
    range: {
	min: -5,
	max: 5
    }
});
sliderMean.noUiSlider.on("slide", function() {
    var meanValue = sliderMean.noUiSlider.get();
    var varValue = sliderVar.noUiSlider.get();
    getData("norm", { "loc": meanValue, "scale": varValue}, updateDistribution);
    d3.select("#mean-value").text(meanValue);
});

var sliderVar = document.getElementById("sliderVar");
noUiSlider.create(sliderVar, {
    start: 1,
    step: 0.1,
    connect: "lower",
    range: {
	min: 0.1,
	max: 3
    }
});
sliderVar.noUiSlider.on("slide", function() {
    var meanValue = sliderMean.noUiSlider.get();
    var varValue = sliderVar.noUiSlider.get();
    getData("norm", { "loc": meanValue, "scale": varValue}, updateDistribution);
    d3.select("#var-value").text(varValue);
});


// 細かく区切られたx, yの配列をもとにグラフをプロットする
// TODO: plotDistribution()は任意のデータ・範囲に適用できるようにして外部ファイルに抽出
// これを外部にしたらnormal.jsは不要になりutil的なやつとinlineだけでよくなる？
var plotDistribution = function(data) {
    // データから平均とリストを取り出す
    var mean = data.mean;
    var data = data.values;

    // x, yのスケール
    xScale.domain(d3.extent(data, function(d) { return d.x; }))
    yScale.domain([0, d3.max(data, function(d) { return d3.max([d.pdf, d.cdf]); })])

    // PDF: 折れ線グラフ
    pdfLine
	.x(function(d) { return xScale(d.x); })
	.y(function(d) { return yScale(d.pdf); });
    // PDF: Area
    pdfArea
	.x(function(d) { return xScale(d.x); })
	.y0(yScale(0))
	.y1(function(d) { return yScale(d.pdf); });

    // CDF: 折れ線グラフ
    cdfLine
	.x(function(d) { return xScale(d.x); })
	.y(function(d) { return yScale(d.cdf); });

    // x-axis
    var xAxis = d3.axisBottom(xScale)
	.tickSize(-height);
    g.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
      .append("text")
	.attr("x", width / 2)
	.attr("y", 30)
        .attr("fill", "#000")
	.attr("font-size", "1rem")
	.text("x");

    // y-axis
    var yAxis = d3.axisLeft(yScale)
	.tickSize(-width);
    g.append("g")
	.attr("class", "y-axis")
	.call(yAxis)
      .append("text")
	.attr("fill", "#000")
    	.attr("font-size", "1rem")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
	.text("f(x), F(x)");

    // PDF: Line chart
    g.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("class", "pdf-line")
	.attr("stroke", "rgb(44, 168, 255)")
	.attr("stroke-opacity", 0.6)
	.attr("stroke-linejoin", "round")
	.attr("stroke-linecap", "round")
	.attr("stroke-width", 2)
	.attr("d", pdfLine);

    // PDF: Line chart (Area)
    g.append("path")
	.datum(data)
	.attr("class", "pdf-area")
	.attr("fill", "rgb(44, 168, 255)")
	.attr("fill-opacity", 0.2)
	.attr("stroke", "none")
	.attr("d", pdfLine);

    // CDF: Line chart
    g.append("path")
	.datum(data)
	.attr("class", "cdf-line")
	.attr("fill", "none")
	.attr("stroke", "rgb(24, 206, 15)")
	.attr("stroke-opacity", 0.6)
	.attr("stroke-linejoin", "round")
	.attr("stroke-linecap", "round")
	.attr("stroke-width", 2)
	.attr("d", cdfLine);

    // Mean vertical line
    g.append("line")
	.attr("class", "mean-line")
	.attr("stroke", "rgb(255, 54, 54)")
	.attr("stroke-opacity", 0.6)
	.attr("stroke-width", 2)
	.attr("x1", xScale(mean))
	.attr("y1", 0)
	.attr("x2", xScale(mean))
	.attr("y2", height);
}

var updateDistribution = function(data) {
    // データから平均とリストを取り出す
    var mean = data.mean;
    var data = data.values;

    // x, yのスケール
    xScale.domain(d3.extent(data, function(d) { return d.x; }));
    yScale.domain([0, d3.max(data, function(d) { return d3.max([d.pdf, d.cdf]); })])

    // PDF: 折れ線グラフ
    pdfLine
	.x(function(d) { return xScale(d.x); })
	.y(function(d) { return yScale(d.pdf); });
    // PDF: Area
    pdfArea
	.x(function(d) { return xScale(d.x); })
	.y0(yScale(0))
	.y1(function(d) { return yScale(d.pdf); });

    // CDF: 折れ線グラフ
    cdfLine
	.x(function(d) { return xScale(d.x); })
	.y(function(d) { return yScale(d.cdf); });

    // x-axis
    var xAxis = d3.axisBottom(xScale)
	.tickSize(-height);
    g.select("g.x-axis")
	.call(xAxis)

    // y-axis
    var yAxis = d3.axisLeft(yScale)
	.tickSize(-width);
    g.select("g.y-axis")
	.call(yAxis)

    // PDF: Line chart
    g.select("path.pdf-line")
	.datum(data)
	.attr("d", pdfLine);

    // PDF: Line chart (Area)
    g.select("path.pdf-area")
	.datum(data)
	.attr("d", pdfArea);

    // CDF: Line chart
    g.select("path.cdf-line")
	.datum(data)
	.attr("d", cdfLine);

    // Mean vertical line
    g.select("line.mean-line")
	.attr("x1", xScale(mean))
	.attr("x2", xScale(mean));
}


// まずはAPIからJSONを取得して描画する
getData("norm", { "loc": 0.0, "scale": 1.0}, plotDistribution);
