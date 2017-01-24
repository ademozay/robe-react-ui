import React from "react";
import {ShallowComponent, Generator, Class, Arrays, Maps} from "robe-react-commons";
import "./LineChart.css"
import Legend from "./Legend";

export default class AreaChart extends ShallowComponent {

    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        data: React.PropTypes.array,
        lines: React.PropTypes.array
    };

    static defaultProps = {
        width: 500,
        height: 300,
        data: [],
        lines: []
    };

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="line" style={{marginLeft:40}}>
                <div className="rb-line-chart" style={{width:this.props.width,height:this.props.height}}>
                    <div className="rb-line-chart-layout">
                        {this.renderLines(this.props.data, this.props.lines)}
                    </div>
                    <div className="rb-line-chart-layout">
                        {this.__renderYAxis()}
                    </div>
                    <div className="rb-line-chart-layout">
                        {this.__renderXAxis()}
                    </div>
                </div>
                <div className="rb-x-axis-layout">
                    {this.__renderXAxisLayout()}
                </div>
                <Legend
                    width={this.props.width}
                    data={this.props.data}
                    legends={this.props.lines}/>
            </div>
        )
    }

    renderLines(data, lines) {
        let linesArr = [];
        let width = this.__xAxisWidth();

        for (let i = 0; i < data.length - 1; i++) {
            let item = data[i];
            let itemArr = [];
            let nexItem;
            let tooltipNext;
            let tooltip = item.name + "\n";
            let color = item.fill || "black";
            if (data[i + 1]) {
                nexItem = data[i + 1];
                tooltipNext = nexItem.name + "\n"
            }
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    if (key === "name" || key === "fill" || key === "unit") {
                        continue;
                    }
                    let value = item[key];

                    let properties = Arrays.getValueByKey(lines, "dataKey", key);
                    properties = properties === undefined ? {} : properties;

                    let nexValue = value;
                    if (nexItem) {
                        nexValue = nexItem[key];
                    }
                    tooltip += (properties.name || key) + " : " + value + " " + (item.unit || "") + "\n";
                    tooltipNext += (properties.name || key) + " : " + nexValue + " " + (nexItem.unit || "") + "\n";

                    value = this.__lineHeight(value);
                    nexValue = this.__lineHeight(nexValue);
                    let height = Math.max(nexValue, value);

                    let y1 = nexValue > value ? Math.abs(nexValue - value) : 0;
                    let y2 = nexValue > value ? 0 : Math.abs(nexValue - value);

                    itemArr.push(
                        <svg
                            key={key}
                            className="rb-line"
                            style={{width:width,height:height}}>
                            <line x1={0} y1={y1} x2={width} y2={y2}
                                  style={{stroke:(properties.fill || item.fill),strokeWidth:1}}/>
                        </svg>);
                }
            }
            let style = {
                animationDelay: (i / (data.length - 1)) + "s",
                animationDuration: (1 / (data.length - 1)) + "s",
                width: width,
                height: this.props.height,
                color: color
            };
            linesArr.push(
                <div key={i}
                     data-before={tooltipNext}
                     data-after={tooltip}
                     style={style}>
                    {itemArr}
                </div>)
        }
        return linesArr;
    }


    __renderYAxis() {
        let maxYAxis = this.__maxYAxis();
        let axisArr = [];
        for (let i = 0; i < 4; i++) {
            axisArr.push(
                <div key={i}
                     id={parseInt((maxYAxis/4)*(4-i))}
                     className="rb-y-axis"
                     style={{height:(this.props.height/4)}}>
                </div>);
        }
        return axisArr;
    }

    __renderXAxis() {
        let data = this.props.data;
        let maxYAxis = this.__xAxisWidth();
        let axisArr = [];
        for (let i = 0; i < data.length - 1; i++) {
            axisArr.push(
                <div key={i}
                     className="rb-x-axis"
                     style={{width : maxYAxis}}>
                </div>);
        }
        return axisArr;
    }

    __renderXAxisLayout() {
        let data = this.props.data;
        let axisArr = [];
        for (let i in data) {
            let item = data[i];
            axisArr.push(
                <div key={i}
                     style={{width:this.__xAxisWidth()}}>
                    {item.name}
                </div>)
        }
        return axisArr;
    }

    __maxYAxis() {
        let data = this.props.data;
        let maxYAxis = 0;
        for (let i in data) {
            let item = data[i];
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    if (key === "name" || key === "fill" || key === "unit") {
                        continue;
                    }
                    if (item[key] > maxYAxis)
                        maxYAxis = item[key];
                }
            }
        }
        let a = maxYAxis > 1000 ? 1000 : maxYAxis > 100 ? 100 : maxYAxis > 50 ? 50 : maxYAxis > 10 ? 10 : 1;

        return (~~((maxYAxis + a - 1) / a) * a);
    }

    __xAxisWidth() {
        return (this.props.width - 1) / (this.props.data.length - 1);
    }

    __lineHeight(value) {
        let maxYAxis = this.__maxYAxis();
        return ((this.props.height * ((value * 100) / maxYAxis)) / 100);
    }
}