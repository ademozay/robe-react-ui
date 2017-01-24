import React from "react";
import {ShallowComponent, Generator, Class, Arrays, Maps} from "robe-react-commons";
import "./PieChart.css"
import Legend from "./Legend";

export default class PieChart extends ShallowComponent {

    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        data: React.PropTypes.array,
        pies: React.PropTypes.array
    };

    static defaultProps = {
        width: 500,
        height: 300,
        data: [],
        pies: []
    };

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="pie" style={{margin:40}}>
                <div className="rb-pie-chart" style={{width:this.props.width,height:this.props.height}}>
                    <svg className="rb-pie-chart-layout" viewPort="0 0 100 100">
                        {this.renderScatters(this.props.data, this.props.pies)}
                    </svg>
                </div>
                <br/>
                <Legend
                    width={this.props.width}
                    data={this.props.data}
                    chart="pie"
                    legends={this.props.pies}/>
            </div>
        )
    }

    renderScatters(data, pies) {
        let itemArr = [];
        for (let i in data) {
            let item = data[i];
            let cx = item.cx;
            let cy = item.cy;
            let outerRadius = item.outerRadius;
            let innerRadius = item.innerRadius;
            let fill = item.fill;

            for (let j in item.data) {
                let child = item.data[j];
                for (let key in child) {
                    if (child.hasOwnProperty(key)) {
                        if (key === "name" || key === "fill" || key === "unit") {
                            continue;
                        }
                        itemArr.push(
                            <circle
                                cx={cx}
                                cy={cy}
                                r="190"
                                className="rb-pie"
                                style={{
                                strokeDasharray:565.48,
                                strokeDashoffset:0,
                                stroke:"#FF9F1E",
                                strokeWidth:3
                                }}
                                fill={"transparent"}/>);
                    }
                }

            }
        }
        return itemArr;
    }


    __maxAxis() {
        let data = this.props.data;
        let maxValue = 0;
        for (let i in data) {
            let item = data[i];
            for (let j in item.data) {
                let child = item.data[j];
                for (let key in child) {
                    if (child.hasOwnProperty(key)) {
                        if (key === "name" || key === "fill" || key === "unit") {
                            continue;
                        }
                        if (child[key] > maxValue)
                            maxValue = child[key];
                    }
                }
            }
        }
        let max = maxValue > 1000 ? 1000 : maxValue > 100 ? 100 : maxValue > 40 ? 40 : maxValue > 10 ? 10 : 1;

        return (~~((maxValue + max - 1) / max) * max);
    }

    __pieHeight(value) {
        let max = this.__maxAxis();
        return this.props.height - ((this.props.height * ((value * 100) / max)) / 100);
    }

    __pieWidth(value) {
        let max = this.__maxAxis();
        return ((this.props.width * ((value * 100) / max)) / 100);
    }
}