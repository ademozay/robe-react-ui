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
                    <svg className="rb-line-chart-svg">
                        {this.renderLines(this.props.data, this.props.lines)}
                    </svg>
                    <div className="rb-line-chart-axis">
                        {this.__renderYAxis()}
                    </div>
                    <div className="rb-line-chart-axis">
                        {this.__renderXAxis()}
                    </div>
                </div>
                <div className="rb-line-chart-axis">
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
        let xAxisWidth = this.__xAxisWidth();
        let sumXAxisWidth = 0;

        for (let i = 0; i < data.length - 1; i++) {
            let item = data[i];
            let itemArr = [];
            let nexItem;
            let tooltipNext;
            let tooltip = item.name + "\n";

            if (data[i + 1]) {
                nexItem = data[i + 1];
                tooltipNext = nexItem.name + "\n"
            }

            let fields = this.__getFields(item);

            for (let j in fields) {

                let key = fields[j].key;
                let value = fields[j].value;

                let properties = Arrays.getValueByKey(lines, "dataKey", key);
                properties = properties === undefined ? {} : properties;

                let nexValue = value;
                if (nexItem) {
                    nexValue = nexItem[key];
                }
                tooltip += (properties.name || key) + " : " + value + " " + (properties.unit || "") + "\n";
                tooltipNext += (properties.name || key) + " : " + nexValue + " " + (properties.unit || "") + "\n";

                let pointY = this.__pointY(value);
                let nextPointY = this.__pointY(nexValue);

                let x1 = sumXAxisWidth;
                let y1 = pointY;

                let x2 = sumXAxisWidth + xAxisWidth;
                let y2 = nextPointY;

                itemArr.push(
                    <line
                        key={key}
                        x1={x1}
                        y1={y1}
                        x2={x1}
                        y2={y1}
                        style={{stroke:(properties.fill || item.fill),strokeWidth:1}}>
                        <animate
                            attributeName="x2"
                            to={x2}
                            dur={(1 / (data.length - 1)) + "s"}
                            begin={ (i / (data.length - 1)) + "s"}
                            fill="freeze"/>
                        <animate
                            attributeName="y2"
                            to={y2}
                            dur={(1 / (data.length - 1)) + "s"}
                            begin={ (i / (data.length - 1)) + "s"}
                            fill="freeze"/>
                    </line>
                );
            }

            sumXAxisWidth += xAxisWidth;

            linesArr.push(
                <g key={i}>
                    {itemArr}
                </g>)
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
                     className="rb-line-y-axis"
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
                     className="rb-line-x-axis"
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
        return (this.props.width - 1) / (this.props.data.length - 1);
    }

    __pointY(value) {
        let maxYAxis = this.__maxYAxis();
        return ((this.props.height * ((value * 100) / maxYAxis)) / 100);
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