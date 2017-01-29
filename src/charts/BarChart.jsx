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
                    <svg className="rb-bar-chart-svg">
                        {this.renderBars(this.props.data, this.props.bars)}
                    </svg>
                    <div className="rb-bar-chart-axis">
                        {this.__renderYAxis()}
                    </div>
                    <div className="rb-bar-chart-axis">
                        {this.__renderXAxis()}
                    </div>
                </div>
                <div className="rb-bar-chart-axis">
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
        let xAxisWidth = this.__xAxisWidth();
        let sumXAxisWidth = 0;

        for (let i in data) {
            let item = data[i];
            let itemArr = [];
            let tooltip = item.name + "\n";

            let barWidth = this.__barWidth(item);
            let fields = this.__getFields(item);
            let pointX = sumXAxisWidth + ((xAxisWidth - (barWidth * fields.length)) / 2);
            sumXAxisWidth += xAxisWidth;

            for (let j in fields) {
                let key = fields[j].key;
                let value = fields[j].value;

                let properties = Arrays.getValueByKey(bars, "dataKey", key);
                properties = properties === undefined ? {} : properties;

                tooltip += (properties.name || key) + " : " + value + " " + (properties.unit || "") + "\n";
                let fill = properties.fill || item.fill;

                let barHeight = this.__barHeight(value);

                itemArr.push(
                    <rect
                        key={key}
                        x={pointX}
                        y={0}
                        width={barWidth}
                        height={barHeight}
                        fill={fill}/>);

                pointX += barWidth;
            }
            barsArr.push(
                <g key={i}>
                    {itemArr}
                </g>)
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
                     className="rb-bar-y-axis"
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
                     className="rb-bar-x-axis"
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
            let fields = this.__getFields(data[i]);
            for (let j in fields) {
                if (fields[j].value > maxYAxis)
                    maxYAxis = fields[j].value;
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
        let fields = this.__getFields(data);
        let minWidth = this.__xAxisWidth() / fields.length;
        return minWidth < 30 ? minWidth : 30;
    }

    __getFields(data) {
        let arr = [];
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === "name" || key === "fill" || key === "unit") {
                    continue;
                }
                arr.push({
                    value: data[key],
                    key: key
                });
            }
        }
        return arr;
    }
}