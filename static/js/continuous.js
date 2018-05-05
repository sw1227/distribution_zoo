// 連続型確率分布のグラフを描画するためのファイル

// グラフの各要素を保持するオブジェクトを作成する
var createContinuous = function() {
    // 名前空間的な
    var continuous = {};

    // 描画領域: 幅はparentに合わせる
    continuous.svg = d3.select("svg#chart")
	.attr("width", $("#chart").parent().width())
	.attr("height", 400);

    // マージンの処理
    continuous.margin = {top: 20, right: 20, bottom: 40, left: 50};
    continuous.width = +continuous.svg.attr("width")
	- continuous.margin.left - continuous.margin.right;
    continuous.height = +continuous.svg.attr("height")
	- continuous.margin.top - continuous.margin.bottom;
    continuous.g = continuous.svg
	.append("g")
	.attr("transform", "translate(" + continuous.margin.left + "," + continuous.margin.top + ")");

    // x, yのスケール
    continuous.xScale = d3.scaleLinear()
	.rangeRound([0, continuous.width]);
    continuous.yScale = d3.scaleLinear()
	.rangeRound([continuous.height, 0]);

    // PDF: 折れ線グラフ
    continuous.pdfLine = d3.line();
    // CDF: 折れ線グラフ
    continuous.cdfLine = d3.line();
    // PDF: Area
    continuous.pdfArea = d3.area();

    return continuous;
}

// データを受けてグラフを更新する関数を返す関数。部分適用する
var updateGraph = function(graph) {
    return function(data) {
	// データから平均とリストを取り出す
	var mean = data.mean;
	var data = data.values;

	// x, yのスケール
	graph.xScale.domain(d3.extent(data, function(d) { return d.x; }))
	graph.yScale.domain([0, d3.max(data, function(d) { return d3.max([d.pdf, d.cdf]); })])

	// PDF: 折れ線グラフ
	graph.pdfLine
	    .x(function(d) { return graph.xScale(d.x); })
	    .y(function(d) { return graph.yScale(d.pdf); });
	// PDF: Area
	graph.pdfArea
	    .x(function(d) { return graph.xScale(d.x); })
	    .y0(graph.yScale(0))
	    .y1(function(d) { return graph.yScale(d.pdf); });

	// CDF: 折れ線グラフ
	graph.cdfLine
	    .x(function(d) { return graph.xScale(d.x); })
	    .y(function(d) { return graph.yScale(d.cdf); });

	// x-axis
	var xAxis = d3.axisBottom(graph.xScale)
	    .tickSize( - graph.height);
	if (d3.select("g.x-axis").size() == 0) {
	    graph.g.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + graph.height + ")")
		.call(xAxis)
	      .append("text")
		.attr("x", graph.width / 2)
		.attr("y", 30)
		.attr("class", "axis-label")
		.text("x");
	} else {
	    graph.g.select("g.x-axis")
		.call(xAxis);
	}

	// y-axis
	var yAxis = d3.axisLeft(graph.yScale)
	    .tickSize( - graph.width);
	if (d3.select("g.y-axis").size() == 0) {
	    graph.g.append("g")
		.attr("class", "y-axis")
		.call(yAxis)
	      .append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("f(x), F(x)");
	} else {
	    graph.g.select("g.y-axis")
		.call(yAxis);
	}

	// PDF: Line chart
	if (d3.select("path.pdf-line").size() == 0) {
	    graph.g.append("path")
		.datum(data)
		.attr("class", "pdf-line prob-line")
		.attr("d", graph.pdfLine);
	} else {
	    graph.g.select("path.pdf-line")
		.datum(data)
		.attr("d", graph.pdfLine);
	}

	// PDF: Line chart (Area)
	if (d3.select("path.pdf-area").size() == 0) {
	    graph.g.append("path")
		.datum(data)
		.attr("class", "pdf-area")
		.attr("d", graph.pdfArea);
	} else {
	    graph.g.select("path.pdf-area")
		.datum(data)
		.attr("d", graph.pdfArea);
	}

	// CDF: Line chart
	if (d3.select("path.cdf-line").size() == 0) {
	    graph.g.append("path")
		.datum(data)
		.attr("class", "cdf-line prob-line")
		.attr("d", graph.cdfLine);
	} else {
	    graph.g.select("path.cdf-line")
		.datum(data)
		.attr("d", graph.cdfLine);
	}

	// Mean vertical line
	if (d3.select("line.mean-line").size() == 0) {
	    graph.g.append("line")
		.attr("class", "mean-line")
		.attr("x1", graph.xScale(mean))
		.attr("y1", 0)
		.attr("x2", graph.xScale(mean))
		.attr("y2", graph.height);
	} else {
	    graph.g.select("line.mean-line")
		.attr("x1", graph.xScale(mean))
		.attr("x2", graph.xScale(mean));
	}
    }
}
