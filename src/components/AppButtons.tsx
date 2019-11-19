import React from 'react';
import { DiagramState, NodeModel } from '../reducers/diagramReducer';
import { connect } from 'react-redux';
import { init, updateNodeColor, addNode } from '../actions/diagram';
import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';

export interface AppButtonsDispatchProps {
    initHandler: () => void;
    updateNodeColorHandler: () => void;
    addNodeHandler: () => void;
}

const mapStateToProps = (state: DiagramState) => {
    return {
        ...state
    };
};

const mapDispatchToProps = (
    dispatch: Dispatch<
        Action<{ nodeDataArray: Array<NodeModel>; linkDataArray: Array<go.ObjectData> }> | Action<void> | Action<string>
    >
): AppButtonsDispatchProps => {
    let nodeId = 0;
    return {
        initHandler: () =>
            dispatch(
                init({
                    nodeDataArray: [
                        { key: 'Alpha', label: 'Alpha', color: 'lightblue' },
                        { key: 'Beta', label: 'Beta', color: 'orange' },
                        { key: 'Gamma', label: 'Gamma', color: 'lightgreen' },
                        { key: 'Delta', label: 'Delta', color: 'pink' },
                        { key: 'Omega', label: 'Omega', color: 'grey' }
                    ],
                    linkDataArray: [
                        { key: -1, from: 'Alpha', to: 'Beta' },
                        { key: -2, from: 'Alpha', to: 'Gamma' },
                        { key: -3, from: 'Beta', to: 'Delta' },
                        { key: -4, from: 'Gamma', to: 'Omega' }
                    ]
                })
            ),
        updateNodeColorHandler: () => dispatch(updateNodeColor()),
        addNodeHandler: () => {
            dispatch(addNode('node' + nodeId));
            nodeId += 1;
        }
    };
};

const AppButtons = ({ initHandler, updateNodeColorHandler, addNodeHandler }: AppButtonsDispatchProps) => {
    return (
        <div className="centered-container">
            <div className="inline-element">
                <button type="button" onClick={() => initHandler()}>
                    Init diagram
                </button>
            </div>
            <div className="inline-element">
                <button type="button" onClick={() => updateNodeColorHandler()}>
                    Update node color
                </button>
            </div>
            <div className="inline-element">
                <button type="button" onClick={() => addNodeHandler()}>
                    Add node with selected node(s) as parent(s)
                </button>
            </div>
        </div>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppButtons);
