import React from "react";
import ReactDOM from "react-dom";
import {ShallowComponent, Generator, Class, Arrays, Maps} from "robe-react-commons";
import "./AreaChart.css"
import Legend from "./Legend";

export default class BarChart extends ShallowComponent {

    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        data: React.PropTypes.array,
        areas: React.PropTypes.array
    };

    static defaultProps = {
        width: 500,
        height: 300,
        data: [],
        areas: []
    };

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="area" style={{marginLeft:40}}>
                <div className="rb-area-chart" style={{width:this.props.width,height:this.props.height}}>
                    <div className="rb-area-chart-layout">
                        {this.renderArea(this.props.data, this.props.areas)}
                    </div>
                    <div className="rb-area-chart-layout">
                        {this.__renderYAxis(this.props.data)}
                    </div>
                    <div className="rb-area-chart-layout">
                        {this.__renderXAxis(this.props.data)}
                    </div>
                </div>
                <div className="rb-x-axis-layout">
                    {this.__renderXAxisLayout(this.props.data)}
                </div>
                <Legend
                    width={this.props.width}
                    data={this.props.data}
                    bars={this.props.areas}/>
            </div>
        )
    }

    renderArea(data, areas) {
        let areasArr = [];
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

                    let properties = Arrays.getValueByKey(areas, "dataKey", key);
                    properties = properties === undefined ? {} : properties;

                    let desc = (properties.name || key) + " : " + value;

                    let next = value;
                    if (data[parseInt(i) + 1] && data[parseInt(i) + 1][key]) {
                        next = data[parseInt(i) + 1][key];
                    }

                    let borderLeft = "none";
                    let borderRight = "none";
                    if (next < value) {
                        borderLeft = width + "px solid " + (properties.fill || item.fill);
                    }
                    else {
                        borderRight = width + "px solid " + (properties.fill || item.fill);
                    }

                    let borderTop = this.__calculateBarHeight(data, Math.abs(next - value)) + "px solid transparent";

                    itemArr.push(
                        <div
                            key={key}
                            className="rb-area"
                            style={{borderLeft:borderLeft,borderRight:borderRight,borderTop:borderTop,height:this.__calculateBarHeight(data,next>value?next:value)}}>
                        </div>);
                }
            }
            areasArr.push(
                <div key={i}
                     style={{width:width,height:height}}>
                    {itemArr}
                </div>)
        }
        return areasArr;
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
        return (this.props.width - 1) / (this.props.data.length - 1);
    }

    __calculateBarHeight(data, value) {
        let maxYAxis = this.__calculateMaxYAxis(data);
        return ((this.props.height * ((value * 100) / maxYAxis)) / 100);
    }

    __calculateBarWidth(data) {
        let count = 0;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === "name" || key === "fill") {
                    continue;
                }
                count++;
            }
        }
        let minWidth = (this.__calculateXAxisWidth() - 1) / count;
        return minWidth < 40 ? minWidth : 40;
    }
}