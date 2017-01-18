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
                <div className="rb-line-chart" style={{width:(this.props.width+1),height:this.props.height}}>
                    <div className="rb-line-chart-layout">
                        {this.renderArea(this.props.data, this.props.lines)}
                    </div>
                    <div className="rb-line-chart-layout">
                        {this.__renderYAxis(this.props.data)}
                    </div>
                    <div className="rb-line-chart-layout">
                        {this.__renderXAxis(this.props.data)}
                    </div>
                </div>
                <div className="rb-x-axis-layout">
                    {this.__renderXAxisLayout(this.props.data)}
                </div>
                <Legend
                    width={this.props.width}
                    data={this.props.data}
                    legends={this.props.lines}/>
            </div>
        )
    }

    renderArea(data, lines) {
        let linesArr = [];
        let width = parseInt(Math.round(this.__calculateXAxisWidth() * 2) / 2);
        let height = this.props.height - 1;

        for (let i = 0; i < data.length - 1; i++) {
            let item = data[i];
            let itemArr = [];

            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    if (key === "name" || key === "fill") {
                        continue;
                    }
                    let value = item[key];

                    let properties = Arrays.getValueByKey(lines, "dataKey", key);
                    properties = properties === undefined ? {} : properties;

                    let desc = (properties.name || key) + " : " + value;

                    let next = value;
                    if (data[parseInt(i) + 1] && data[parseInt(i) + 1][key]) {
                        next = data[parseInt(i) + 1][key];
                    }

                    let x1 = 0;
                    let y1 = 0;
                    let y2 = 0;

                    if (next < value) {
                        x1 = 0;
                        y1 = 0;
                        y2 = this.__calculateBarHeight(data, Math.abs(next - value));
                    }
                    else {
                        x1 = 0;
                        y1 = this.__calculateBarHeight(data, Math.abs(next - value));
                        y2 = 0;
                    }

                    itemArr.push(
                        <svg
                            key={key}
                            className="rb-line"
                            style={{
                                height:this.__calculateBarHeight(data,next>value?next:value)}}>
                            <line x1={x1} y1={y1} x2={width} y2={y2}
                                  style={{stroke:(properties.fill || item.fill),strokeWidth:1}}/>
                        </svg>);
                }
            }
            linesArr.push(
                <div key={i}
                     style={{width:width,height:height}}>
                    {itemArr}
                </div>)
        }
        return linesArr;
    }


    __renderYAxis(data) {
        let maxYAxis = this.__calculateMaxYAxis(data);
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

    __renderXAxis(data) {
        let maxYAxis = this.__calculateXAxisWidth(data);
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

    __renderXAxisLayout(data) {
        let axisArr = [];
        for (let i in data) {
            let item = data[i];
            axisArr.push(
                <div key={i}
                     style={{width:this.__calculateXAxisWidth()}}>
                    {item.name}
                </div>)
        }
        return axisArr;
    }

    __calculateMaxYAxis(data) {
        let maxYAxis = 0;
        for (let i in data) {
            let item = data[i];
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    if (key === "name" || key === "fill") {
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

    __calculateXAxisWidth() {
        return parseInt(Math.round(((this.props.width) / (this.props.data.length - 1)) * 2) / 2);
    }

    __calculateBarHeight(data, value) {
        let maxYAxis = this.__calculateMaxYAxis(data);
        return ((this.props.height * ((value * 100) / maxYAxis)) / 100);
    }
}