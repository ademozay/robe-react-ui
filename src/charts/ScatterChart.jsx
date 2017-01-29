import React from "react";
import {ShallowComponent, Generator, Class, Arrays, Maps} from "robe-react-commons";
import "./ScatterChart.css"
import Legend from "./Legend";

export default class ScatterChart extends ShallowComponent {

    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        data: React.PropTypes.array,
        scatters: React.PropTypes.array
    };

    static defaultProps = {
        width: 500,
        height: 300,
        data: [],
        scatters: []
    };

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="scatter" style={{marginLeft:40}}>
                <div className="rb-scatter-chart" style={{width:this.props.width,height:this.props.height}}>
                    <svg className="rb-scatter-chart-svg">
                        {this.renderScatters(this.props.data, this.props.scatters)}
                    </svg>
                    <div className="rb-scatter-chart-axis">
                        {this.__renderYAxis()}
                    </div>
                    <div className="rb-scatter-chart-axis">
                        {this.__renderXAxis()}
                    </div>
                </div>

                <br/>
                <Legend
                    width={this.props.width}
                    data={this.props.data}
                    chart="scatter"
                    legends={this.props.scatters}/>
            </div>
        )
    }

    renderScatters(data, scatters) {
        let itemArr = [];
        for (let i in data) {
            let item = data[i];
            for (let j in item.data) {
                let child = item.data[j];
                let cx = this.__pointX(child.x);
                let cy = this.__pointY(child.y);
                let fill = item.fill;
                let tooltip = item.name + "\n";

                let fields = this.__getFields(item.data[j]);

                for (let f in fields) {
                    let key = fields[f].key;
                    let value = fields[f].value;
                    let properties = Arrays.getValueByKey(scatters, "dataKey", key);
                    properties = properties === undefined ? {} : properties;
                    tooltip += (properties.name || key) + " : " + child[key] + " " + (properties.unit || "") + "\n";
                }

                itemArr.push(
                    <circle
                        key={i+" "+j}
                        cx={cx}
                        cy={cy}
                        r="0"
                        fill={fill}>
                        <animate
                            attributeName="r"
                            to={8}
                            dur={(1 / (data.length - 1)) + "s"}
                            begin={ (i / (data.length - 1)) + "s"}
                            fill="freeze"/>
                    </circle>);

            }
        }
        return itemArr;
    }


    __renderYAxis() {
        let max = this.__maxAxis();
        let axisArr = [];
        for (let i = 0; i < 4; i++) {
            axisArr.push(
                <div key={i}
                     id={parseInt((max.y/4)*(4-i))}
                     className="rb-scatter-y-axis"
                     style={{height:(this.props.height/4)}}>
                </div>);
        }
        return axisArr;
    }

    __renderXAxis() {
        let data = this.props.data;
        let max = this.__maxAxis();
        let axisArr = [];
        for (let i = 0; i < 5; i++) {
            axisArr.push(
                <div key={i}
                     id={parseInt((max.x/5)*(i+1))}
                     className="rb-scatter-x-axis"
                     style={{width : (this.props.width-1)/5}}>
                </div>);
        }
        return axisArr;
    }


    __maxAxis() {
        let data = this.props.data;
        let maxYAxis = 0;
        let maxXAxis = 0;
        for (let i in data) {
            let item = data[i];
            for (let j in item.data) {
                let fields = this.__getFields(item.data[j]);
                for (let f in fields) {
                    if (fields[f].key === "x" && fields[f].value > maxXAxis)
                        maxXAxis = fields[f].value;
                    if (fields[f].key === "y" && fields[f].value > maxYAxis)
                        maxYAxis = fields[f].value;
                }
            }
        }
        let x = maxXAxis > 1000 ? 1000 : maxXAxis > 100 ? 100 : maxXAxis > 40 ? 40 : maxXAxis > 10 ? 10 : 1;
        let y = maxYAxis > 1000 ? 1000 : maxYAxis > 100 ? 100 : maxYAxis > 50 ? 50 : maxYAxis > 10 ? 10 : 1;

        let max = {
            x: (~~((maxXAxis + x - 1) / x) * x),
            y: (~~((maxYAxis + y - 1) / y) * y)
        };

        return max;
    }

    __pointY(value) {
        let max = this.__maxAxis();
        return this.props.height - ((this.props.height * ((value * 100) / max.y)) / 100);
    }

    __pointX(value) {
        let max = this.__maxAxis();
        return ((this.props.width * ((value * 100) / max.x)) / 100);
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