var ListNode = /** @class */ (function () {
    function ListNode(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
    return ListNode;
}());
// l1 = [3, 1]
// l2 = [9]
// sum = [2, 2]
// l1 = [3, 1, 1, 1]
// l2 = [9, 3, 1]
// sum = [2, 4, 1, 1]
function addTwoNumbers(l1, l2) {
    var summedList = new ListNode();
    var currSummedList = summedList, curr1 = l1, curr2 = l2;
    var remainder = false;
    while (curr1 && curr2) {
        var currVal1 = curr1.val;
        var currVal2 = curr2.val;
        var tempSum = currVal1 + currVal2;
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
    while (curr1) {
        currSummedList.val = curr1.val;
        if (remainder) {
            currSummedList.val++;
        }
        currSummedList.next = new ListNode();
        currSummedList = currSummedList.next;
        curr1 = curr1.next;
    }
    while (curr2) {
        currSummedList.val = curr2.val;
        if (remainder) {
            currSummedList.val++;
        }
        currSummedList.next = new ListNode();
        currSummedList = currSummedList.next;
        curr1 = curr2.next;
    }
    return summedList;
}
;
var l1 = new ListNode();
var curr1 = l1;
curr1.val = 3;
curr1.next = new ListNode();
curr1 = curr1.next;
curr1.val = 1;
var l2 = new ListNode();
var curr2 = l2;
curr2.val = 9;
console.log({ l1: l1 });
console.log({ l2: l2 });
var node = addTwoNumbers(l1, l2);
console.log({ node: node });
