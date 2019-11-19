import React from 'react';
import go from 'gojs';
import { Diagram, ToolManager } from 'gojs';
import { NodeModel } from '../reducers/diagramReducer';
import { UpdateNodeTextEvent } from '../actions/diagram';
import { ReactDiagram } from 'gojs-react';
import './MyDiagram.css';

interface MyDiagramProps {
    nodeDataArray: Array<NodeModel>;
    linkDataArray: Array<go.ObjectData>;
    onNodeSelection: (key: string, isSelected: boolean) => void;
    onModelChange: (event: go.IncrementalData) => void;
    onTextChange: (event: UpdateNodeTextEvent) => void;
}

class MyDiagram extends React.PureComponent<MyDiagramProps> {
    private diagramRef: React.RefObject<ReactDiagram>;

    constructor(props: MyDiagramProps) {
        super(props);
        this.diagramRef = React.createRef();
        this.initDiagram = this.initDiagram.bind(this);
        this.onTextEdited = this.onTextEdited.bind(this);
    }

    render() {
        return (
            <ReactDiagram
                ref={this.diagramRef}
                divClassName="myDiagram"
                initDiagram={this.initDiagram}
                nodeDataArray={this.props.nodeDataArray}
                linkDataArray={this.props.linkDataArray}
                onModelChange={this.props.onModelChange}
                skipsDiagramUpdate={false}
            />
        );
    }
    private initDiagram(): Diagram {
        const $ = go.GraphObject.make;

        const myDiagram: Diagram = $(go.Diagram, {
            initialContentAlignment: go.Spot.LeftCenter,
            'undoManager.isEnabled': true,
            'animationManager.isInitial': false,
            layout: $(go.TreeLayout, {
                angle: 0,
                arrangement: go.TreeLayout.ArrangementVertical,
                treeStyle: go.TreeLayout.StyleLayered
            }),
            isReadOnly: false,
            allowHorizontalScroll: true,
            allowVerticalScroll: true,
            allowZoom: false,
            allowSelect: true,
            autoScale: Diagram.Uniform,
            contentAlignment: go.Spot.LeftCenter,
            TextEdited: this.onTextEdited,
            model: $(go.GraphLinksModel, {
                linkKeyProperty: 'key',
                makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data) => {
                    let k = data.key || -1;
                    while (m.findLinkDataForKey(k)) {
                        k--;
                    }
                    data.key = k;
                    return k;
                }
            })
        });

        myDiagram.toolManager.panningTool.isEnabled = false;
        myDiagram.toolManager.mouseWheelBehavior = ToolManager.WheelScroll;

        myDiagram.nodeTemplate = $(
            go.Node,
            'Auto',
            {
                selectionChanged: node => this.props.onNodeSelection(node.key as string, node.isSelected)
            },
            $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 }, new go.Binding('fill', 'color')),
            $(go.TextBlock, { margin: 8, editable: true }, new go.Binding('text', 'label'))
        );

        myDiagram.linkTemplate = $(
            go.Link,
            new go.Binding('relinkableFrom', 'canRelink').ofModel(),
            new go.Binding('relinkableTo', 'canRelink').ofModel(),
            $(go.Shape),
            $(go.Shape, { toArrow: 'Standard' })
        );

        return myDiagram;
    }

    private onTextEdited(e: go.DiagramEvent) {
        const tb = e.subject;
        if (tb === null) {
            return;
        }
        const node = tb.part;
        if (node instanceof go.Node && this.props.onTextChange) {
            this.props.onTextChange({ key: node.key as string, text: tb.text });
        }
    }
}

export default MyDiagram;
