/*
    绘制NWPC的数值预报系统运行时间线
 */


var svg_size = {
    'width': 1400,
    'height': 800
};

var chart_start_point = {
    'x': 200,
    'y': 30
};

var svg = d3.select("#time-line-container")
    .append("svg")
    .attr('width', svg_size.width)
    .attr('height', svg_size.height);

var current_time = new Date();

var start_hour = d3.timeDay(current_time);
console.log(start_hour);

var next_date = d3.timeDay.offset(start_hour, 1);

var end_hour = d3.timeHour.offset(next_date, 12);

var x_scale = d3.scaleTime()
    .domain([start_hour, end_hour])
    .range([0, svg_size.width - 2*chart_start_point.x]);


var x_axis = d3.axisTop(x_scale)
    .ticks(d3.timeHour.every(1))
    .tickFormat(d3.timeFormat("%H"));

var axis_group = svg.append("g")
    .attr('transform', 'translate('+ chart_start_point.x +','+ chart_start_point.y + ')')
    .call(x_axis);

var time_bar_group = svg.append("g")
    .attr('transform', 'translate('+ chart_start_point.x +','+ chart_start_point.y + ')');

var time_bar_data = time_bar_group.selectAll('.system-entry')
    .data(system_run_time_data);

var time_bar_data_enter = time_bar_data
    .enter()
    .append('g')
    .attr('transform', function(d, i){
        return 'translate(0, '+ (30*i+5) +')'
    })
    .classed('system-entry', true);

var system_name_label = time_bar_data_enter
    .append('text')
    .attr('x', function(d,i){
        return -10
    })
    .attr('y', function(d,i){
        return 10;
    })
    .text(function(d,i){
        return d.name;
    })
    .attr('text-anchor', 'end')
    .attr("dominant-baseline", "central");

var run_time_data = time_bar_data_enter
    .selectAll('.run-time-item');

var run_time_data_enter = run_time_data
    .data(function(d){ return d.run_times})
    .enter();

run_time_data_enter
    .append('rect')
    .attr('x', function(d, i){
        var local_start_time = d.start_time;
        var hour = parseInt(local_start_time.substr(0, 2));
        var minute = parseInt(local_start_time.substr(3, 2));
        var current_start_time = d3.timeMinute.offset(d3.timeHour.offset(start_hour, hour), minute);

        return x_scale(current_start_time);
    })
    .attr('y', function(d, i){
        return 0;
    })
    .attr('width', function(d,i){
        var local_start_time = d.start_time;
        var hour = parseInt(local_start_time.substr(0, 2));
        var minute = parseInt(local_start_time.substr(3, 2));
        var current_start_time = d3.timeMinute.offset(d3.timeHour.offset(start_hour, hour), minute);

        var local_end_time = d.end_time;
        var end_hour = local_end_time.substr(0, 2);
        var end_minute = local_end_time.substr(3, 2);
        var current_end_time;
        if(end_hour < hour)
        {
            current_end_time = d3.timeMinute.offset(d3.timeHour.offset(next_date, end_hour), end_minute);
        }
        else{
            current_end_time = d3.timeMinute.offset(d3.timeHour.offset(start_hour, end_hour), end_minute);
        }

        var bar_width = x_scale(current_end_time) - x_scale(current_start_time);

        return bar_width>=1?bar_width:1;
    })
    .attr('height', 20)
    .style('stroke-width', '2px')
    .style('fill', 'transparent')
    .style('stroke', 'black')
    .classed('run-time-item', true);

run_time_data_enter.append('text')
    .attr('x', function(d, i){
        var local_start_time = d.start_time;
        var hour = parseInt(local_start_time.substr(0, 2));
        var minute = parseInt(local_start_time.substr(3, 2));
        var current_start_time = d3.timeMinute.offset(d3.timeHour.offset(start_hour, hour), minute);

        return x_scale(current_start_time) - 2;
    })
    .attr('y', function(d, i){
        return 10;
    })
    .text(function(d, i){
        return d.name;
    })
    .attr("dominant-baseline", "central")
    .attr("text-anchor", "end");