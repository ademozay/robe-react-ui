import React from "react";
import TextInput from "inputs/TextInput";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Renderer from "./Renderer";
import CheckInput from "inputs/CheckInput";
import RadioInput from "inputs/RadioInput";

const components = [
    {
        header: "Text Input ",
        component: [
            {
                header: "Text Input ",
                component: <TextInput type="text" />
            },
            {
                header: "Default Value",
                component: <TextInput type="text" value="Default Value" />
            }
        ]
    },
    {
        header: "Check Input ",
        component: <CheckInput label="Check Input"/>
    },{
        header: "Radio Input ",
        component: <RadioInput label="Radio Input" data={["1","2","3"]}/>
    }
];

export default class Showcase extends ShallowComponent {

    render() {
        let componentArray = [];
        for (let i = 0; i < components.length; i++) {
            let component = components[i];
            componentArray.push(<Renderer
                header={component.header}
                component={component.component}
                />);
        }
        return (
            <div>
                {componentArray}
            </div>
        );
    }
}