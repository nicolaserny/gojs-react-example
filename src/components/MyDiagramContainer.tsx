import React from 'react';
import MyDiagram from './MyDiagram';
import { DiagramState, NodeModel } from '../reducers/diagramReducer';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    nodeSelected,
    nodeDeselected,
    removeNode,
    removeLink,
    UpdateNodeTextEvent,
    UpdateNodeText
} from '../actions/diagram';
import { Action } from 'typescript-fsa';

interface MyDiagramContainerStateProps {
    nodeDataArray: Array<NodeModel>;
    linkDataArray: Array<go.ObjectData>;
}

interface MyDiagramContainerDispatchProps {
    onNodeSelection: (key: string, isSelected: boolean) => void;
    onModelChange: (event: go.IncrementalData) => void;
    onTextChange: (event: UpdateNodeTextEvent) => void;
}

const mapStateToProps = (state: DiagramState) => {
    return {
        nodeDataArray: state.nodeDataArray,
        linkDataArray: state.linkDataArray
    };
};

const mapDispatchToProps = (
    dispatch: Dispatch<Action<string> | Action<go.Key> | Action<UpdateNodeTextEvent>>
): MyDiagramContainerDispatchProps => {
    return {
        onNodeSelection: (key: string, isSelected: boolean) => {
            if (isSelected) {
                dispatch(nodeSelected(key));
            } else {
                dispatch(nodeDeselected(key));
            }
        },
        onModelChange: (event: go.IncrementalData) => {
            const removedNodeKeys = event.removedNodeKeys;
            if (removedNodeKeys) {
                removedNodeKeys.forEach(key => {
                    dispatch(removeNode(key));
                });
            }
            const removeLinkKeys = event.removedLinkKeys;
            if (removeLinkKeys) {
                removeLinkKeys.forEach(key => dispatch(removeLink(key)));
            }
        },
        onTextChange: (event: UpdateNodeTextEvent) => {
            dispatch(UpdateNodeText(event));
        }
    };
};

const MyDiagramContainer = ({
    nodeDataArray,
    linkDataArray,
    onNodeSelection,
    onModelChange,
    onTextChange
}: MyDiagramContainerStateProps & MyDiagramContainerDispatchProps) => {
    return (
        <MyDiagram
            nodeDataArray={nodeDataArray}
            linkDataArray={linkDataArray}
            onNodeSelection={onNodeSelection}
            onModelChange={onModelChange}
            onTextChange={onTextChange}
        />
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyDiagramContainer);
