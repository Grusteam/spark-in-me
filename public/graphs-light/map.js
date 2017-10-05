$(function() {
    var width = $(window).width() - 400;
    var height = $(window).height() - 140;

    var force = d3.layout.force()
        .charge(-1000)
        .theta(0.9)
        .gravity(0.5)
        .linkDistance(function(d) {
            return d.value;
        })
        .size([width, height])
        .nodes(r1.nodes)
        .links(r1.links)
        .start();

    var svg = d3.select("#chart").append("svg")
        .call(d3.behavior.zoom().on("zoom", redraw))
        .attr("width", width)
        .attr("height", height)
        .append('svg:g');

    function redraw() {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    };

    var link = svg.selectAll("line.link")
        .data(r1.links)
        .enter().append("svg:line")
        .attr("class", "link")
        .style("stroke-width", 1);

    var node = svg.selectAll("g.node")
        .data(r1.nodes)
        .enter().append("svg:g")
        .attr("class", "node")
        .call(force.drag);

    node.append("svg:circle")
        .attr("class", "node")
        .attr("r", function(d) {
            return d.group;
        })
        .style("fill", "#9C9EDE")
        .call(force.drag)
        .on("mouseover", fade(true)).on("mouseout", fade(false));

    node.append("svg:text")
        .attr("class", "nodetext")
        .attr("dx", 16)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name
        });

    force.on("tick", function() {
        link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });

    function fade(opacity) {
        return function(d) {
            svg.selectAll("circle").style("fill", function(o) {

                if (!opacity)
                    return "#9C9EDE";

                if (neighboring(d, o))
                    return "#A7C0DC";
                else
                    return "#9C9EDE";
            });
        };
    };

    var linkedByIndex = {};
    r1.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
        linkedByIndex[d.target.index + "," + d.source.index] = 1;
        linkedByIndex[d.source.index + "," + d.source.index] = 1;
        linkedByIndex[d.target.index + "," + d.target.index] = 1;
    });

    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    };

    $("#progress").height(height);
    $("#progress").width(width);
    $("#chart").delay(1500).slideUp(300, function() {
		$("div.share42init").offset({ top: ($("#progress").offset().top + 9) });
        $("#progress").hide();
        $("div.share42init").show();
    }).fadeIn(500);
});