import React from "react";
import {ShallowComponent, Generator, Class, Arrays, Maps} from "robe-react-commons";
import "./PieChart.css"
import Legend from "./Legend";

export default class PieChart extends ShallowComponent {

    static propTypes = {
        data: React.PropTypes.array,
        pies: React.PropTypes.array,
        size: React.PropTypes.number
    };

    static defaultProps = {
        size: 400,
        data: []
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data})
    }

    render() {
        let data = this.state.data;
        let childCountTree = this.__childCountTree(data);

        return (
            <div id="pie">
                <div className="rb-pie-chart"
                     viewBox={"0 0 "+this.props.size+" "+this.props.size}
                     style={{width:this.props.size,height:this.props.size}}>
                    <svg className="rb-pie-chart-svg">
                        {this.__renderPies(data, 360, 0, childCountTree, childCountTree - 1)}
                    </svg>
                    <div className="tooltip" id="tooltip">Tooltip</div>
                </div>
            </div>
        )
    }

    __renderPies(data, percentage, rotation, childCountTree, index) {
        let piesArr = [];
        let sumValues = this.__sumValues(data);
        let mRotation = rotation;

        let c = 2 * childCountTree + 1;
        let d = c - index;
        let mRadius = (((this.props.size - 1) / 2) / c) * d;

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let mPercentage = (percentage * item.value) / sumValues;
            if (item.children) {
                let childPiesArr = this.__renderPies(item.children, mPercentage, mRotation, childCountTree, index - 1);
                piesArr.push.apply(piesArr, childPiesArr);
            }
            mRotation += mPercentage;
        }
        piesArr.push.apply(piesArr, this.__createPath(data, mRadius, percentage, rotation));

        return piesArr;
    }

    __createPath(data, radius, percentage, rotaion) {
        let sectors = [];

        let mRadius = radius;
        let origin = this.props.size / 2;
        let mRotation = rotaion;

        let max = this.__sumValues(data);
        if (data.length <= 1) {
            max += 0.1;
        }

        data.map(function (item, key) {
            let value = item.value;
            let mPercentage = (percentage * value) / max;

            let aCalc = ( mPercentage > 180 ) ? 360 - mPercentage : mPercentage;
            let aRad = aCalc * Math.PI / 180;

            let z = Math.sqrt(2 * mRadius * mRadius - ( 2 * mRadius * mRadius * Math.cos(aRad) ));
            let x = aCalc <= 90 ? mRadius * Math.sin(aRad) : mRadius * Math.sin((180 - aCalc) * Math.PI / 180);
            let y = Math.sqrt(z * z - x * x);

            let Y = (origin - mRadius) + y;
            let X = mPercentage <= 180 ? origin + x : origin - x;
            let arcSweep = mPercentage <= 180 ? 0 : 1;
            let V = origin - mRadius;

            let tooltip = item.label + "  " + value + " " + (item.unit || "") + "\n";

            sectors.push(
                <path
                    key={key+item.label+X}
                    id={key+item.label+X}
                    transform={'rotate(' + mRotation + ', ' + origin + ', ' + origin + ')'}
                    d={'M ' + origin + ' ' + origin + ' V ' + V + ' A ' + mRadius + ' ' + mRadius + ' 1 ' + arcSweep + ' 1 ' + X + '  ' + Y + " z" }
                    fill={item.fill}
                    data={tooltip}
                    strokeLinecap="round"
                    onMouseOver={this.__showTooltip}
                    onMouseOut={this.__hideTooltip}
                    onMouseMove={this.__moveTooltip}
                    onClick={this.__onClick.bind(undefined,item)}>
                </path>);
            mRotation = mRotation + mPercentage;
        }.bind(this));

        return sectors
    }

    __onClick(data) {
        let arr = [];
        arr.push(data);
        this.setState({data: arr})
    }

    __childCountTree(data) {
        let count = 1;
        let a = 0;
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.children) {
                let b = this.__childCountTree(item.children);
                a = Math.max(a, b);
            }
        }
        return count + a;
    }

    __sumValues(data) {
        let max = 0;
        data.map(function (item, key) {
            let value = item.value;
            max += value;
        });
        return max;
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
}