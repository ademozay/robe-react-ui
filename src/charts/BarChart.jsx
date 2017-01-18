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
                <div className="rb-bar-chart" style={{width:(this.props.width+2),height:this.props.height}}>
                    <div className="rb-bar-chart-layout">
                        {this.renderBars(this.props.data, this.props.bars)}
                    </div>
                    <div className="rb-bar-chart-layout">
                        {this.__renderYAxis(this.props.data)}
                    </div>
                    <div className="rb-bar-chart-layout">
                        {this.__renderXAxis(this.props.data)}
                    </div>
                </div>
                <div className="rb-x-axis-layout">
                    {this.__renderXAxisLayout(this.props.data)}
                </div>
                <Legend width={this.props.width} data={this.props.data} legends={this.props.bars}/>
            </div>
        )
    }

    renderBars(data, bars) {
        let barsArr = [];
        let height = this.props.height - 1;

        for (let i in data) {
            let item = data[i];
            let itemArr = [];
            let count = 0;
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    if (key === "name" || key === "fill") {
                        continue;
                    }
                    count++;
                    let value = item[key];
                    let properties = Arrays.getValueByKey(bars, "dataKey", key);
                    properties = properties === undefined ? {} : properties;

                    let desc = (properties.name || key) + " : " + value;
                    itemArr.push(
                        <div
                            key={key}
                            className="rb-bar center-block"
                            style={{minWidth:this.__calculateBarWidth(item),color:properties.fill || item.fill}}>
                            <div className="bar"
                                 data={desc}
                                 style={{height:this.__calculateBarHeight(data,value)}}>
                                <div style={{background:properties.fill || item.fill}}></div>
                            </div>
                        </div>);
                }
            }
            barsArr.push(
                <div key={i}
                     style={{width:this.__calculateXAxisWidth(),height:height}}>
                    {itemArr}
                </div>)
        }
        return barsArr;
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
        for (let i = 0; i < data.length; i++) {
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
        return parseInt(Math.round(((this.props.width) / this.props.data.length) * 2) / 2);
    }

    __calculateBarHeight(data, value) {
        let maxYAxis = this.__calculateMaxYAxis(data);
        return ((this.props.height * ((value * 100) / maxYAxis)) / 100 - 3);
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