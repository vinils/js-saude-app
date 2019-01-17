function toListRecursively(treeNode, childsVariableName) {
    let ret = []

    treeNode[childsVariableName].forEach(child => {
        ret.push(child)
        ret.push(...toListRecursively(child, childsVariableName))
    })

    return ret
}
  
function toList(treeNode, childsVariableName) {
    let ret = toListRecursively(treeNode, childsVariableName)

    ret.push(treeNode)

    return ret
}

function parentReduce(treeNode, parentVariableName, reduceItem, aggregatorCallBack) {
    let ret = aggregatorCallBack(null, reduceItem(treeNode))
    let parent = treeNode[parentVariableName] 

    while(parent) {
        ret = aggregatorCallBack(ret, reduceItem(parent))
        parent = parent[parentVariableName];
    }

    return ret;
}

// const castArrayToTreeRecursively = (list, nodesToBeMapped, nodesToBeMappedParent = null, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) => {
//     nodesToBeMapped.forEach(parent => {
//       parent[parentVariableName] = nodesToBeMappedParent;
//       parent.parentReducer = (reduceItem, aggregatorCallBack) => parentReduce(parent, parentVariableName, reduceItem, aggregatorCallBack)
//       parent.toList = () => toList(parent, childsVariableName)
//       parent.findChild = (finderVariableName, keys) => findChild(parent, childsVariableName, finderVariableName, keys)
//       parent.getFull = (elementVariableName) => getFull(parent, elementVariableName)
//       parent.forEachTree = (callBackFuncion) => forEachTree(parent, childsVariableName, callBackFuncion)
  
//       if(!parent[childsVariableName]) {
//         parent[childsVariableName] = [];
//       }
  
//       let childs = list.filter((child) => child[parentIdVariableName] == parent[nodeIdVariableName]);
  
//       if(!childs || childs.length <= 0) {
//         return;
//       }
  
//       castArrayToTreeRecursively(list, childs, parent, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName)
  
//       childs.forEach(e => {
//         parent[childsVariableName].push(e)
//       });
//     })
// }

function loadTreeFunctions(rootNode, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName, parentNode = null) {
    if(!rootNode) {
        return;
    }

    rootNode[parentVariableName] = parentNode;
    rootNode.parentReducer = (reduceItem, aggregatorCallBack) => parentReduce(rootNode, parentVariableName, reduceItem, aggregatorCallBack);
    rootNode.toList = () => toList(rootNode, childsVariableName);
    rootNode.findChild = (finderVariableName, keys) => findChild(rootNode, childsVariableName, finderVariableName, keys)
    rootNode.getFull = (elementVariableName) => getFull(rootNode, elementVariableName)
    rootNode.forEachTree = (callBackFuncion) => forEachTree(rootNode, childsVariableName, callBackFuncion)

    if(parentNode && rootNode[parentIdVariableName] != parentNode[nodeIdVariableName]) {
        console.log('node and parent node dont match. rootChildId: ' +  rootNode[nodeIdVariableName])
    }

    rootNode[childsVariableName].forEach(element => {
        loadTreeFunctions(element, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName, rootNode)
    });
}

function treeExtensions(prototype) {
    prototype.parentReducer = (reduceItem, callBack)  => parentReduce(this, 'Parent', reduceItem, callBack)
    prototype.toList = () => toList(this, 'Childs')
}

// export const castArrayToTree = (array, rootNodeToBeMapped, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) => {
//     castArrayToTreeRecursively(array, [rootNodeToBeMapped], null, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName);
//     return rootNodeToBeMapped;
// }

// export const castArrayToArrayOfTree = (array, nodesToBeMapped, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) => {
//     castArrayToTreeRecursively(array, nodesToBeMapped, null, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName);
//     nodesToBeMapped.toList = () => arrayOfTreeToList(nodesToBeMapped)

//     return nodesToBeMapped;
// }

// const arrayOfTreeToList = (array) => {
//   let ret = []
//   array.forEach(item => {
//     ret.push(...item.toList())
//   });
//   return ret;
// }

function findChild(node, childsVariableName, finderVariableName, keys, keyIndex = 0) {
    let nextchild = node[childsVariableName].find(child => child[finderVariableName] == keys[keyIndex]);

    if(keyIndex + 1 == keys.length) {
        return nextchild;
    } else {
        return findChild(nextchild, childsVariableName, finderVariableName, keys, keyIndex+1)
    }
}

function getFull(node, elementVariableName, separator = '\\') {
    let reduceItemFn = element => element[elementVariableName];
    let accumulatorFn = (accumulator, currentValue) => accumulator ? currentValue + separator + accumulator : currentValue;
    return node.parentReducer(reduceItemFn, accumulatorFn);
}

function forEachTree(node, childsVariableName, callBackFuncion) {
    let callBackFunctionRecursively = (element) => { callBackFuncion(element); forEachTree(element, childsVariableName, callBackFuncion); } 
    node[childsVariableName].forEach(callBackFunctionRecursively)
}