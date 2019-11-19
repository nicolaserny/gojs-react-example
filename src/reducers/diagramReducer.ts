import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Reducer } from 'redux';
import * as go from 'gojs';
import {
    init,
    updateNodeColor,
    addNode,
    nodeSelected,
    nodeDeselected,
    removeNode,
    removeLink,
    UpdateNodeText,
    UpdateNodeTextEvent
} from '../actions/diagram';

export interface DiagramState {
    nodeDataArray: Array<NodeModel>;
    linkDataArray: Array<go.ObjectData>;
    selectedNodeKeys: string[];
}

export interface NodeModel extends go.ObjectData {
    label: string;
    color: string;
}

const initHandler = (
    state: DiagramState,
    payload: { nodeDataArray: Array<NodeModel>; linkDataArray: Array<go.ObjectData> }
): DiagramState => {
    return {
        ...state,
        nodeDataArray: payload.nodeDataArray,
        linkDataArray: payload.linkDataArray
    };
};

const colors = ['lightblue', 'orange', 'lightgreen', 'pink', 'yellow', 'red', 'grey', 'magenta', 'cyan'];

const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

const updateNodeColorHandler = (state: DiagramState): DiagramState => {
    const updatedNodes = state.nodeDataArray.map(node => {
        return {
            ...node,
            color: getRandomColor()
        };
    });

    return {
        ...state,
        nodeDataArray: updatedNodes
    };
};

const updateNodeTextHandler = (state: DiagramState, payload: UpdateNodeTextEvent): DiagramState => {
    const nodeIndex = state.nodeDataArray.findIndex(node => node.key === payload.key);

    return {
        ...state,
        nodeDataArray: [
            ...state.nodeDataArray.slice(0, nodeIndex),
            {
                ...state.nodeDataArray[nodeIndex],
                label: payload.text
            },
            ...state.nodeDataArray.slice(nodeIndex + 1)
        ]
    };
};

const addNodeHandler = (state: DiagramState, payload: string): DiagramState => {
    const linksToAdd: go.ObjectData[] = state.selectedNodeKeys.map(parent => {
        return { from: parent, to: payload };
    });
    return {
        ...state,
        nodeDataArray: [...state.nodeDataArray, { key: payload, label: payload, color: getRandomColor() }],
        linkDataArray: linksToAdd.length > 0 ? [...state.linkDataArray].concat(linksToAdd) : [...state.linkDataArray]
    };
};

const removeNodeHandler = (state: DiagramState, payload: go.Key): DiagramState => {
    const nodeToRemoveIndex = state.nodeDataArray.findIndex(node => node.key === payload);
    if (nodeToRemoveIndex === -1) {
        return state;
    }
    return {
        ...state,
        nodeDataArray: [
            ...state.nodeDataArray.slice(0, nodeToRemoveIndex),
            ...state.nodeDataArray.slice(nodeToRemoveIndex + 1)
        ]
    };
};

const removeLinkHandler = (state: DiagramState, payload: go.Key): DiagramState => {
    const linkToRemoveIndex = state.linkDataArray.findIndex(link => link.Key === payload);
    if (linkToRemoveIndex === -1) {
        return state;
    }
    return {
        ...state,
        linkDataArray: [
            ...state.linkDataArray.slice(0, linkToRemoveIndex),
            ...state.linkDataArray.slice(linkToRemoveIndex + 1)
        ]
    };
};

const nodeSelectedHandler = (state: DiagramState, payload: string): DiagramState => {
    return {
        ...state,
        selectedNodeKeys: [...state.selectedNodeKeys, payload]
    };
};

const nodeDeselectedHandler = (state: DiagramState, payload: string): DiagramState => {
    const nodeIndexToRemove = state.selectedNodeKeys.findIndex(key => key === payload);
    if (nodeIndexToRemove === -1) {
        return state;
    }
    return {
        ...state,
        selectedNodeKeys: [
            ...state.selectedNodeKeys.slice(0, nodeIndexToRemove),
            ...state.selectedNodeKeys.slice(nodeIndexToRemove + 1)
        ]
    };
};

export const diagramReducer: Reducer<DiagramState> = reducerWithInitialState<DiagramState>({
    nodeDataArray: [{ key: 'Root', color: 'lightblue', label: 'Root' }],
    linkDataArray: [],
    selectedNodeKeys: []
})
    .case(init, initHandler)
    .case(updateNodeColor, updateNodeColorHandler)
    .case(UpdateNodeText, updateNodeTextHandler)
    .case(addNode, addNodeHandler)
    .case(removeNode, removeNodeHandler)
    .case(removeLink, removeLinkHandler)
    .case(nodeSelected, nodeSelectedHandler)
    .case(nodeDeselected, nodeDeselectedHandler)
    .build();

export const nodeSelectionSelector = (state: DiagramState) => state.selectedNodeKeys;
