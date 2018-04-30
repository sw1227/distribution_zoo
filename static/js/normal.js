// 細かく区切られたx, yの配列をもとにグラフをプロットする
// TODO: plotDistribution()は任意のデータ・範囲に適用できるようにして外部ファイルに抽出
// これを外部にしたらnormal.jsは不要になりutil的なやつとinlineだけでよくなる？
var plotDistribution = function(data) {
    // 描画領域: 幅はparentに合わせる
    var svg = d3.select("svg#chart")
	.attr("width", $("#chart").parent().width())
	.attr("height", 500);

    // マージンの処理
    var margin = {top: 20, right: 20, bottom: 40, left: 50};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, yのスケール
    var xScale = d3.scaleLinear()
	.domain(d3.extent(data, function(d) { return d.x; }))
	.rangeRound([0, width]);
    var yScale = d3.scaleLinear()
	.domain(d3.extent(data, function(d) { return d.y; }))
	.rangeRound([height, 0]);

    // 折れ線グラフ
    var line = d3.line()
	.x(function(d) { return xScale(d.x); })
	.y(function(d) { return yScale(d.y); });

    // x-axis
    g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(xScale))
      .append("text")
	.attr("x", width / 2)
	.attr("y", 30)
        .attr("fill", "#000")
	.attr("font-size", "1rem")
	.text("x");

    // y-axis
    g.append("g")
	.call(d3.axisLeft(yScale))
      .append("text")
	.attr("fill", "#000")
    	.attr("font-size", "1rem")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
	.text("f(x), F(x)");

    // Line chart
    g.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "steelblue")
	.attr("stroke-linejoin", "round")
	.attr("stroke-linecap", "round")
	.attr("stroke-width", 1.5)
	.attr("d", line);
}


// APIからJSONを取得して描画する
// TODO: interactiveにパラメータを指定
// plotDistributionもelementのupdateに対応させる必要
getData("norm", { "loc": 0.0, "scale": 1.0}, plotDistribution);
