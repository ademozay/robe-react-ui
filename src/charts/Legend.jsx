import React from "react";
import ReactDOM from "react-dom";
import {ShallowComponent, Generator, Class, Arrays, Maps} from "robe-react-commons";
import "./Legend.css"
import ThumbnailGroup from "../layouts/ThumbnailGroup";
import ThumbnailItem from "../layouts/ThumbnailItem";

export default class Legend extends ShallowComponent {

    static propTypes = {
        className: React.PropTypes.string,
        width: React.PropTypes.number,
        data: React.PropTypes.array,
        legends: React.PropTypes.array,
        chart: React.PropTypes.string,
    };

    static defaultProps = {
        width: 500,
        data: [],
        legends: [],
        chart: "bar"
    };

    constructor(props) {
        super(props)
    }

    render() {
        let legend;
        switch (this.props.chart) {
            case "scatter":
                legend = this.__renderScatter(this.props.data, this.props.legends);
                break;
            default:
                legend = this.__renderLenged(this.props.data, this.props.legends);
                break;
        }
        return (
            <div className={this.props.className} style={{width:this.props.width}}>
                <ThumbnailGroup>
                    {legend}
                </ThumbnailGroup>
            </div>
        )
    }


    __renderLenged(data, legends) {
        let legendArr = [];
        let uniqueList = [];
        for (let i in data) {
            let item = data[i];
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    if (key === "name" || key === "fill" || key === "unit") {
                        continue;
                    }
                    if (Arrays.indexOf(uniqueList, key) !== -1) {
                        continue;
                    }

                    let properties = Arrays.getValueByKey(legends, "dataKey", key);
                    properties = properties === undefined ? {} : properties;

                    uniqueList.push(key);
                    let color = (properties.fill || item.fill) || "#00b0e8";
                    legendArr.push(
                        <ThumbnailItem key={key} className="legend-item">
                            &nbsp; {properties.name || key }
                            <div style={{background:color,width:18,height:18,float:"left",opacity:0.6}}></div>
                        </ThumbnailItem>)
                }
            }
        }
        return legendArr;
    }

    __renderScatter(data, legends) {
        let legendArr = [];
        for (let i in data) {
            let item = data[i];

            let color = item.fill || "#00b0e8";
            legendArr.push(
                <ThumbnailItem key={i} className="legend-item">
                    &nbsp; {item.name }
                    <div style={{background:color,width:18,height:18,float:"left",opacity:0.6}}></div>
                </ThumbnailItem>)
        }
        return legendArr;
    }

}