import React from "react";
import {ShallowComponent, Generator, Class, Arrays, Maps} from "robe-react-commons";
import "./BarChart.css"
import Legend from "./Legend";

export default class BarChart extends ShallowComponent {

    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        data: React.PropTypes.array,
        bars: React.PropTypes.array
    };

    static defaultProps = {
        width: 500,
        height: 300,
        data: [],
        bars: []
    };

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="bar" style={{marginLeft:40}}>
                <div className="rb-bar-chart"
                     style={{width:this.props.width,height:this.props.height}}>
                    <div className="rb-bar-chart-layout">
                        {this.renderBars(this.props.data, this.props.bars)}
                    </div>
                    <div className="rb-bar-chart-layout">
                        {this.__renderYAxis()}
                    </div>
                    <div className="rb-bar-chart-layout">
                        {this.__renderXAxis()}
                    </div>
                </div>
                <div className="rb-x-axis-layout">
                    {this.__renderXAxisLayout()}
                </div>
                <Legend
                    width={this.props.width}
                    data={this.props.data}
                    legends={this.props.bars}/>
            </div>
        )
    }

    renderBars(data, bars) {
        let barsArr = [];
        let width = this.__xAxisWidth();

        for (let i in data) {
            let item = data[i];
            let itemArr = [];
            let tooltip = item.name + "\n";
            let color = item.fill || "black";
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    if (key === "name" || key === "fill" || key === "unit") {
                        continue;
                    }
                    let value = item[key];
                    let properties = Arrays.getValueByKey(bars, "dataKey", key);
                    properties = properties === undefined ? {} : properties;

                    tooltip += (properties.name || key) + " : " + value + " " + (item.unit || "") + "\n";
                    let fill = properties.fill || item.fill;

                    let height = this.__barHeight(value);
                    let minWidth = this.__barWidth(item);

                    itemArr.push(
                        <div
                            key={key}
                            className="rb-bar center-block"
                            style={{width:minWidth}}>
                            <svg
                                className="bar"
                                style={{width:minWidth,height:height}}>
                                <rect width={minWidth} height={height} fill={fill}/>
                            </svg>
                        </div>);

                }
            }
            barsArr.push(
                <div key={i}
                     data={tooltip}
                     style={{width:width,height:this.props.height,color:color}}>
                    {itemArr}
                </div>)
        }
        return barsArr;
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
        for (let i = 0; i < data.length; i++) {
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

    __xAxisWidth() {
        return (this.props.width - 1) / this.props.data.length;
    }

    __barHeight(value) {
        let maxYAxis = this.__maxYAxis();
        return ((this.props.height * ((value * 100) / maxYAxis)) / 100);
    }

    __barWidth(data) {
        let count = 0;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === "name" || key === "fill" || key === "unit") {
                    continue;
                }
                count++;
            }
        }
        let minWidth = this.__xAxisWidth() / count;
        return minWidth < 30 ? minWidth : 30;
    }
}