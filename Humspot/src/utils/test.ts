class ListNode {
  val: number
  next: ListNode | null
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
  }
}
// l1 = [3, 1]
// l2 = [9]
// sum = [2, 2]

// l1 = [3, 1, 1, 1]
// l2 = [9, 3, 1]
// sum = [2, 4, 1, 1]

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  let summedList: ListNode | null = new ListNode();
  let currSummedList: ListNode | null = summedList, curr1: ListNode | null = l1, curr2: ListNode | null = l2;
  let remainder: boolean = false;
  while (curr1 && curr2) {
    let currVal1: number = curr1.val;
    let currVal2: number = curr2.val;
    let tempSum = currVal1 + currVal2;
    if (remainder) {
      tempSum++;
    }
    remainder = false;
    if (tempSum >= 10) {
      remainder = true;
      tempSum = tempSum - 10;
    }
    curr1 = curr1.next;
    curr2 = curr2.next;
    currSummedList.val = tempSum;
    currSummedList.next = new ListNode();
    currSummedList = currSummedList.next;
  }

  while(curr1) {
    currSummedList.val = curr1.val;
    if(remainder) {
      currSummedList.val++;
    }
    currSummedList.next = new ListNode();
    currSummedList = currSummedList.next;
    curr1 = curr1.next;
  }

  while(curr2) {
    currSummedList.val = curr2.val;
    if(remainder) {
      currSummedList.val++;
    }
    currSummedList.next = new ListNode();
    currSummedList = currSummedList.next;
    curr1 = curr2.next;
  }

  return summedList;
};

let l1: ListNode | null = new ListNode();
let curr1: ListNode | null = l1;
curr1.val = 3;
curr1.next = new ListNode();
curr1 = curr1.next;
curr1.val = 1;

let l2: ListNode | null = new ListNode();
let curr2: ListNode | null = l2;
curr2.val = 9;

console.log({l1});
console.log({l2});
const node: ListNode | null = addTwoNumbers(l1, l2);
console.log({node});