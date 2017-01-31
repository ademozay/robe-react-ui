import React from "react";
import {ShallowComponent, Generator, Class, Arrays, Maps} from "robe-react-commons";
import "./AreaChart.css"
import Legend from "./Legend";

export default class AreaChart extends ShallowComponent {

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

    legends = [];

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{marginLeft:40}}>
                <div className="rb-area-chart" style={{width:this.props.width,height:this.props.height}}>
                    <svg className="rb-area-chart-svg">
                        {this.renderAreas(this.props.data, this.props.areas)}
                    </svg>
                    <div className="tooltip" id="tooltip">Tooltip</div>
                    <div className="rb-area-chart-axis">
                        {this.__renderYAxis()}
                    </div>
                    <div className="rb-area-chart-axis">
                        {this.__renderXAxis()}
                    </div>
                </div>
                <div className="rb-area-chart-axis">
                    {this.__renderXAxisLayout()}
                </div>
                <Legend data={this.legends} width={this.props.width}/>
            </div>
        )
    }

    renderAreas(data, areas) {
        let areasArr = [];
        let xAxisWidth = this.__xAxisWidth();
        let sumXAxisWidth = 0;

        for (let i = 0; i < data.length - 1; i++) {
            let item = data[i];
            let itemArr = [];
            let nexItem;

            if (data[i + 1]) {
                nexItem = data[i + 1];
            }

            let fields = this.__getFields(item);

            for (let j in fields) {

                let key = fields[j].key,
                    value = fields[j].value,
                    nextValue = value;

                if (nexItem) {
                    nextValue = nexItem[key];
                }

                let properties = Arrays.getValueByKey(areas, "dataKey", key);
                properties = properties === undefined ? {} : properties;
                let fill = properties.fill || this.__randColor(j);
                this.legends[properties.name || key] = {fill: fill, label: properties.name || key};

                let tooltip = item.name + "\n" + (properties.name || key) + " : " + value + " " + (properties.unit || "") + "\n",
                    tooltipNext = nexItem.name + "\n" + (properties.name || key) + " : " + nextValue + " " + (properties.unit || "") + "\n";

                let pointY = this.__pointY(value),
                    nextPointY = this.__pointY(nextValue);

                let points = sumXAxisWidth + " " + "0," + (sumXAxisWidth + xAxisWidth) + " " + "0," + (sumXAxisWidth + xAxisWidth) + " " + nextPointY + "," + sumXAxisWidth + " " + pointY,
                    startPoints = sumXAxisWidth + " " + "0," + sumXAxisWidth + " " + "0," + sumXAxisWidth + " " + pointY + "," + sumXAxisWidth + " " + pointY;

                itemArr.push(
                    <polygon
                        key={key}
                        fill={fill}
                        points={startPoints}
                        data={tooltip+tooltipNext}
                        onMouseOver={this.__showTooltip}
                        onMouseOut={this.__hideTooltip}
                        onMouseMove={this.__moveTooltip}>
                        <animate
                            attributeName="points"
                            to={points}
                            dur={(1 / (data.length - 1)) + "s"}
                            begin={ (i / (data.length - 1)) + "s"}
                            fill="freeze"/>
                    </polygon>
                );
            }

            sumXAxisWidth += xAxisWidth;

            areasArr.push(
                <g key={i}>
                    {itemArr}
                </g>)
        }
        return areasArr;
    }


    __renderYAxis() {
        let maxYAxis = this.__maxYAxis();
        let height = this.props.height / 4;
        let axisArr = [];
        for (let i = 0; i < 4; i++) {
            axisArr.push(
                <div key={i}
                     id={parseInt((maxYAxis/4)*(4-i))}
                     className="rb-area-y-axis"
                     style={{height:height}}>
                </div>);
        }
        return axisArr;
    }

    __renderXAxis() {
        let data = this.props.data;
        let width = this.__xAxisWidth();
        let axisArr = [];
        for (let i = 0; i < data.length - 1; i++) {
            axisArr.push(
                <div key={i}
                     className="rb-area-x-axis"
                     style={{width : width}}>
                </div>);
        }
        return axisArr;
    }

    __renderXAxisLayout() {
        let data = this.props.data;
        let axisArr = [];
        let width = this.__xAxisWidth();
        for (let i in data) {
            let item = data[i];
            axisArr.push(
                <div key={i}
                     style={{width:width}}>
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

    __showTooltip(evt) {
        if (this.tooltip === undefined) {
            this.tooltip = document.getElementById("tooltip");
        }
        this.tooltip.style.visibility = "visible";
        let tooltipText = evt.target.getAttribute("data");

        let fill = evt.target.getAttribute("fill");
        this.tooltip.innerHTML = tooltipText;
        this.tooltip.style.backgroundColor = fill;
    }

    __hideTooltip(evt) {
        if (this.tooltip === undefined)
            this.tooltip = document.getElementById("tooltip");
        this.tooltip.style.visibility = "hidden";
    }

    __moveTooltip(evt) {
        if (this.tooltip === undefined)
            this.tooltip = document.getElementById("tooltip");

        this.tooltip.style.left = (evt.clientX + 10) + "px";
        this.tooltip.style.top = (evt.clientY + 10) + "px";
    }

    __randColor(index) {
        let colors = ["#F44336", "#673AB7", "#2196F3", "#FF5722", "#9C27B0", "#FFC107", "#FF9800", "#4CAF50", "#00796B", "#009688", "#3F51B5"];
        if (index !== undefined) {
            return colors[index % colors.length];
        }
        return colors[Math.floor(Math.random() * (colors.length - 1))];
    }

}