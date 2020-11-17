//==============================答题部分 start==============================

/********************第 1 题**********************/
// 实现一个函数，可以对 url 中的 query 部分做拆解，返回一个 key - value 形式的 object
// 入参格式参考：
const url = "http://sample.com/?a=1&b=2&c=xx&d#hash";
// 出参格式参考：
const result = { a: "1", b: "2", c: "xx", d: "" };

export function querySearch(url) {
  const toParse = url.split(/[\?#]/)[1]; // 分割字符串，只保留?和#中间的部分
  return toParse.split("&").reduce((o, kv) => {
    // & 分割每个query部分
    const [key, value] = kv.split("=");
    if (!value) {
      return { ...o, [key]: "" }; // 如果没有value赋值''
    }
    deepSet(
      o,
      key.split(/[\[\]]/g).filter((x) => x), // 考虑a[x]=1&a[y]=2
      value
    );
    return o;
  }, {});
}

function deepSet(o, path, value) {
  let i = 0;
  for (; i < path.length - 1; i++) {
    if (o[path[i]] === undefined) {
      // 如果result里没有当前的key，根据value来设置初始值{}或[]
      if (path[i + 1].match(/^\d+$/)) {
        // 考虑a[0]=1&a[1]=2
        o[path[i]] = [];
      } else {
        o[path[i]] = {};
      }
    }
    o = o[path[i]];
  }
  o[path[i]] = decodeURIComponent(value); // 考虑有URL编码问题
}

/********************第 2 题**********************/
// 实现一个 arrange 函数，可以进行时间和工作调度
// [ > … ] 表示调用函数后的打印内容

// arrange('William').execute();
// > William is notified

// arrange('William').do('commit').execute();
// > William is notified
// > Start to commit

// arrange('William').wait(5).do('commit').execute();
// > William is notified
// 等待 5 秒
// > Start to commit

// arrange('William').waitFirst(5).do('push').execute();
// 等待 5 秒
// > William is notified
// > Start to push

/**
 * sleep函数
 * @param {} num
 */
const sleep = (num) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, num * 1000);
  });
};

export function arrange(name) {
  const taskQueue = [];
  let isFirstListen = false;
  function execute() {
    Promise.resolve().then(async () => {
      if (isFirstListen) {
        // 如果firstWait要先执行等待
        const waitPromise = taskQueue.shift();
        await waitPromise();
      }
      console.log(`${name} is notified`);
      if (taskQueue.length > 0) {
        // notify之后依次执行队列中的任务，不使用forEach达到串行
        for (let i = 0; i < taskQueue.length; i++) {
          await taskQueue[i]();
        }
      }
    });
  }

  function doTask(taskName) {
    taskQueue.push(async () => {
      console.log(`Start to ${taskName}`);
    });
    return { execute };
  }

  function wait(num) {
    taskQueue.push(async () => {
      await sleep(num);
    });
    return { execute, do: doTask };
  }

  function waitFirst(num) {
    taskQueue.unshift(async () => {
      await sleep(num);
    });
    isFirstListen = true;
    return { execute, do: doTask };
  }

  return {
    execute,
    do: doTask,
    wait,
    waitFirst
  };
}

/********************第 3 题**********************/
// 实现一个函数，可以将数组转化为树状数据结构
// 入参格式参考：
const arr = [
  { id: 1, name: "i1" },
  { id: 2, name: "i2", parentId: 1 },
  { id: 4, name: "i4", parentId: 3 },
  { id: 3, name: "i3", parentId: 2 },
  { id: 8, name: "i8", parentId: 7 }
];
// 出参格式可自行设计

function buildTree(arr) {
  const childrenMap = {}; // 先建立一个父子的映射关系
  let root = null;
  arr.forEach((item) => {
    if (!item.parentId) {
      root = item; // parentId为空的是root节点
      return;
    }
    if (!childrenMap[item.parentId]) {
      childrenMap[item.parentId] = [];
    }
    childrenMap[item.parentId].push(item);
  });

  function loopTree(item) {
    return {
      id: item.id,
      name: item.name,
      children: (childrenMap[item.id] || []).map((child) => loopTree(child)) // 每个子节点递归得去找到自己的子，递归结束条件就是childrenMap找不到当前的id
    };
  }
  return root ? loopTree(root) : root;
}

/********************第 4 题**********************/
// 实现findFibonacci函数，在一堆正整数中，找到最长的一组斐波那契数列段
// 斐波那契数列：一个递增的正整数数列，从第三位起，每个数字都是前两位数字之和，不一定要从 1 开始
// 入参格式参考：
const inputArr = [13, 9, 3, 8, 5, 25, 31, 11, 21];

// 出参格式参考：
const sequence = [3, 5, 8, 13, 21];

/**
 * 根据长度生成一个斐波那契数组
 * @param {} num
 */
function generateFibonacci(num) {
  const result = [];
  let [a, b] = [0, 1];
  for (let i = 0; i < num; i++) {
    [a, b] = [b, a + b];
    result.push(b);
  }
  return result;
}

function sortArray(arr) {
  // 冒泡排序
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function findFibonacci(arr) {
  const fibonacciArray = generateFibonacci(arr.length); // 创造一个能容纳inputArray就是完整斐波那契的长度的斐波那契数组
  const sortedArray = sortArray(arr);
  const result = [];
  for (let n of sortedArray) {
    if (fibonacciArray.includes(n)) {
      result.push(n);
    }
  }
  return result;
}

//==============================答题部分 end================================

//==============================说明部分 start==============================

import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <div>
        <h1>题目列表</h1>
        <p>
          1. 实现一个函数，可以对 url 中的 query 部分做拆解，返回一个 key -
          value 形式的 object
        </p>
        <p>
          2. 实现一个<em>arrange</em>函数，可以进行时间和工作调度
        </p>
        <p>3. 实现一个函数，可以将数组转化为树状数据结构</p>
        <p>
          4. 实现<em>findFibonacci</em>
          函数，在一堆正整数中，找到最长的一组斐波那契数列段
        </p>
      </div>
      <div>
        <h1>答题说明</h1>
        <p>1. 请 fork 到自己的账号下完成题目</p>
        <p>2. 所有题目需要用原生 JS 实现，不能借助第三方类库</p>
        <p>3. 答题部分在上方，包含了每道题的补充说明和入参出参格式 demo</p>
        <p>
          4. 第 1、2 题需要在<em>index.tes.js</em>文件中写对应的单元测试
        </p>
        <p>5. 注意写好必要的注释</p>
        <p>
          <font color="red">
            *6. 尽可能完成所有题目, 有疑问联系对应的面试官
          </font>
        </p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
//==============================说明部分 end================================
