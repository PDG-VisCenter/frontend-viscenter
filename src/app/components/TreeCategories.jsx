import React, { useState } from 'react';
import { Tree } from 'antd';

function TreeCategories({ treeData, onCheck }) {
  const [checkedKeys, setCheckedKeys] = useState([]);

  const handleCheck = (checkedKeys, info) => {
    const parentNodes = new Set();
    const childNodes = new Set();

    const findNodeByKey = (nodes, key) => {
      return nodes.reduce((foundNode, node) => {
        if (foundNode) return foundNode;
        if (node.key === key) return node;
        if (node.children) return findNodeByKey(node.children, key);
        return null;
      }, null);
    };

    const classifyNodes = (node) => {
      if (node.children && node.children.length > 0) {
        parentNodes.add(node.key);
      } else {
        childNodes.add(node.key);
      }

      if (node.parentKey) {
        parentNodes.add(node.parentKey);
        const parentNode = findNodeByKey(treeData, node.parentKey);
        if (parentNode) classifyNodes(parentNode);
      }
    };

    info.checkedNodes.forEach((node) => classifyNodes(node));

    const parentsArray = Array.from(parentNodes);
    const childrenArray = Array.from(childNodes);
    setCheckedKeys([...parentsArray, ...childrenArray]);
    onCheck({ parents: parentsArray, children: childrenArray });
  };

  const addParentKey = (nodes, parentKey = null) => {
    return nodes.map((node) => {
      const newNode = { ...node, parentKey };
      if (node.children) {
        newNode.children = addParentKey(node.children, node.key);
      }
      return newNode;
    });
  };

  const enhancedTreeData = addParentKey(treeData);

  return (
    <Tree
      checkable
      defaultExpandAll
      treeData={enhancedTreeData}
      onCheck={(keys, info) => handleCheck(keys, info)}
    />
  );
}

export default TreeCategories;
