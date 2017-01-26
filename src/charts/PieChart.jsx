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
        data: [],

    };

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="pie" style={{margin:40}}>
                <div className="rb-pie-chart" style={{width:this.props.size,height:this.props.size}}>
                    <svg className="rb-pie-chart-layout">
                        {this.renderScatters(this.props.data)}
                    </svg>
                </div>
                <br/>
                <Legend
                    width={this.props.size}
                    data={this.props.data}
                    chart="pie"
                    legends={this.props.data}/>
            </div>
        )
    }

    renderScatters(data) {
        let piesArr = [];
        let sectors = this.calculateSectors(data);

        sectors.map(function (sector) {
            piesArr.push(
                <path
                    className="rb-pie"
                    transform={'rotate(' + sector.R + ', ' + sector.O + ', ' + sector.O + ')'}
                    d={'M ' + sector.O + ' ' + sector.O + ' L ' + sector.Lx +' '+ sector.Ly + ' A ' + sector.L + ' ' + sector.L + ' 1 0 1 ' + sector.X + '  ' + sector.Y + ' z'}
                    stroke={sector.color}
                    fill={sector.color}/>
            );
        });

        return piesArr;
    }


    __maxAxis(data, valueKey) {
        let max = 0;
        data.map(function (item, key) {
            let value = item[valueKey];
            max += value;
        });
        return max;
    }

    calculateSectors(pies) {
        let sectors = [];

        let aRad = 0; // Angle in Rad

        let z = 0; // Size z
        let x = 0; // Side x
        let y = 0; // Side y

        let X = 0; // SVG X coordinate
        let Y = 0; // SVG Y coordinate

        let radius = 100;
        let origin = this.props.size / 2;

        let rotation = 0;
        let max = this.__maxAxis(pies, "value");

        pies.map(function (item, key) {
            let value = item.value;
            let percentage = (360 * value) / max;
            let aCalc = ( percentage > 180 ) ? 360 - percentage : percentage;

            aRad = aCalc * Math.PI / 180;

            z = Math.sqrt(2 * radius * radius - ( 2 * radius * radius * Math.cos(aRad) ));

            if (aCalc <= 90) {
                x = radius * Math.sin(aRad);
            }
            else {
                x = radius * Math.sin((180 - aCalc) * Math.PI / 180);
            }

            y = Math.sqrt(z * z - x * x);
            Y = (origin - radius) + y;

            if (percentage <= 180) {
                X = origin + x;
            }
            else {
                X = origin - x;
            }
            sectors.push({
                label: item.label,
                color: item.fill,
                L: radius,
                O: origin,
                X: X,
                Y: Y,
                Lx: origin,
                Ly: origin - radius,
                R: rotation
            });

            rotation = rotation + percentage;
        });


        return sectors
    }
}