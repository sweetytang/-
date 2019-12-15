
function swap(arr,i,j) {
    var temp=arr[i];
    arr[i]=arr[j];
    arr[j]=temp;
}

/* 插入排序 */
function insertSort(arr) {
    for (var outer=1;outer<arr.length;outer++) {
        var temp=arr[outer];                    //保存外层需要插入的元素
        for (var inner=outer;(inner>0)&&(arr[inner-1]>temp);inner--) {
            arr[inner]=arr[inner-1]             //插入的方法比较特殊，通过相邻的两元素来移动
        }
        arr[inner]=temp;                        //最后将temp元素插入到正确的位置
    }
}
/* 希尔排序：插入排序升级版
            有间隔的插入排序 */
//第一种方案：硬间隔排序，即通过提前定义好的间隔数组g再进行排序
function shellSort1(arr) {
    var gap=[5,3,1];
    for (var index=0;index<gap.length;index++) {                //最外层循环采用间隔
        for (var outer=gap[index];outer<arr.length;outer++) {   //外层还是按照1的步伐来选取后面的无序数组插入到前面的有序数组中
            var temp=arr[outer];
            for (var inner=outer;(inner>0)&&(arr[inner-gap[index]]>temp);inner-=gap[index]) {
                arr[inner]=arr[inner-gap[index]]                //前面的有序数组是按照gap[index]的步伐进行后移的，减少了比较的次数，从而提高了速度
            }
            arr[inner]=temp;
        }
    }
}
//第二种方案：动态间隔排序，即根据数组情况自动生成间隔再进行排序
function shellSort2(arr) {
    var gap=1;
    while (gap<arr.length/3) {
        gap=3*gap+1
    }
    while (gap>=1) {
        for (var outer=gap;outer<arr.length;outer++) {
            var temp=arr[outer];
            for (var inner=outer;(inner>0)&&(arr[inner-gap]>temp);inner-=gap) {
                arr[inner]=arr[inner-gap]
            }
            arr[inner]=temp;
        }
        gap=(gap-1)/3;
    }
}


/* 选择排序:通过选择元素（如最小元素）放到相应位置 */
function selectSort(arr) {
    for (var outer=0;outer<arr.length;outer++) {
        var min=outer;
        for (var inner=outer+1;inner<arr.length;inner++) {
            if (arr[inner]<arr[min]) min=inner;
        }
        if (min!=outer) swap(arr,outer,min)
    }
}
/* 归并排序：选择排序升级版
    通过将两个有序数组合并 */
//第一种方案：（递归)自顶向下的归并排序
function merge1(arr1,arr2) {
    var p1=0,p2=0,arr=[];
    while (p1<arr1.length && p2<arr2.length) {
        if (arr1[p1]<arr2[p2]) arr.push(arr1[p1++]);
        else arr.push(arr2[p2++])
    }
    return arr.concat(arr1.slice(p1),arr2.slice(p2))
}
function mergeSort1(arr) {
    if (arr.length<=1) return arr;
    var index=Math.floor(arr.length/2);
    var arrLeft=arr.slice(0,index),
        arrRight=arr.slice(index);
    return merge1(mergeSort1(arrLeft),mergeSort1(arrRight))
}
//第二种方案：（迭代）自底向上的归并排序
function merge2(arr,leftStart,leftStop,rightStart,rightStop) {
    var arrLeft=arr.slice(leftStart,leftStop),
        arrRight=arr.slice(rightStart,rightStop);
    var p1=0,p2=0,k=leftStart;
    while (p1<arrLeft.length || p2<arrRight.length) {
        if (p1<arrLeft.length && p2<arrRight.length) {
            if (arrLeft[p1]<arrRight[p2]) arr[k++]=arrLeft[p1++];
            else arr[k++]=arrRight[p2++];
        } else if (p1>=arrLeft.length) {
            arr[k++]=arrRight[p2++];
        } else {
            arr[k++]=arrLeft[p1++];
        }
    }
}
function mergeSort2(arr) {
    var step=1,left,right;
    while (step<arr.length) {
        left=0;
        right=step;
        while (right+step<=arr.length) {
            merge2(arr,left,left+step,right,right+step);
            left=right+step;
            right=left+step;
        }
        if (right<arr.length) merge2(arr,left,left+step,right,arr.length)
        step*=2
    }
}


/* 冒泡排序:通过相邻两两交换，最值会慢慢移到应在的位置 */
function bubbleSort(arr) {
    for (var outer=arr.length-1;outer>0;outer--) {
        for (var inner=0;inner<outer;inner++) {
            if (arr[inner]>arr[inner+1]) swap(arr,inner,inner+1);
        }
    }
}
/* 快速排序:冒泡排序升级版
选定一个基准数，将小于基准的数放到左边，大于基准的数放到右边，有两种partion途径：
    1、通过两个空数组，遍历原数组再分别插入，如partion1所示。
    2、通过冒泡交换的方法，节省空间，也有两种思路：
        1）双指针同向移动法，如partion2所示；
        2）双指针反向移动法，如partion3所示。

实现最终的排序，也有两种途径：
    1、不改变原数组，如quickSort1、quickSort1_1、quickSort2_1和quickSort3_1所示,
       其实quickSort2_1和quickSort3_1已经在partion部分改变了一次原数组
    2、改变原数组，如quickSort2和quickSort3所示
    
总结：改变原数组，就是为了节省空间；不改变原数组，就得增加使用空间*/
//第一种方案：（递归）自顶向下的填充型快速排序，空间复杂度高
function partion1(arr) {
    var arrLeft=[],arrRight=[];
    var std=arr[arr.length-1];
    for (var i=0;i<arr.length-1;i++) {
        if (arr[i]<std) arrLeft.push(arr[i]);
        else arrRight.push(arr[i])
    }
    return [arrLeft,std,arrRight]
}
function quickSort1_1(arr) {
    if (arr.length<=1) return arr;
    var [arrLeft,std,arrRight]=partion1(arr);
    return quickSort1_1(arrLeft).concat(std,quickSort1_1(arrRight))
}
//一般不改变原数组的写法都写成这样的一个函数
function quickSort1(arr) {
    if (arr.length<=1) return arr;
    var temp=arr.splice(arr.length-1,1),
        arrLeft=[],
        arrRight=[];
    for (var i=0;i<arr.length;i++) {                    //将数组以temp为界限分成两组
        if (arr[i]<=temp) arrLeft.push(arr[i]);
        else arrRight.push(arr[i])
    }
    return quickSort1(arrLeft).concat(temp,quickSort1(arrRight))
}
//第二种方案：（递归）自顶向下的双指针同向冒泡交换型
function partion2(arr,start,end) {
    var temp=arr[end-1];
    var step=start-1;
    for (var i=start;i<end;i++) {
        if (arr[i]<temp) {
            step++;
            if (i!=step) swap(arr,i,step);
        }
    }
    swap(arr,++step,end-1);
    return step;
}
function quickSort2(arr,left,right) {
    if (left==right) return ;
    var index=partion2(arr,left,right);
    if (index>left) {
        quickSort2(arr,left,index);
    }
    if (index<right) {
        quickSort2(arr,index+1,right);
    }
}
function quickSort2_1(arr) {
    if (arr.length<=1) return arr;
    var index=partion2(arr,0,arr.length);
    return quickSort4(arr.slice(0,index)).concat(arr[index],quickSort4(arr.slice(index+1)))
}
//第三种方案：（递归）自顶向下的双指针反向冒泡交换型
function partion3(arr,start,end) {
    var temp=arr[end-1];
    var begin=start;
    var stop=end-1;
    while (begin<stop) {
        while (arr[begin]<temp && begin<stop) {     //必须添加begin<stop判断条件，否则有序的数列会出问题
            begin++
        }
        while (arr[stop]>=temp && begin<stop) {
           stop--
        }
        if (begin<stop) swap(arr,begin,stop)
    }
    if (stop!=end-1) swap(arr,stop,end-1);          //不能用begin进行交换，因为右边的数应该比基准大
    return stop;
}
function quickSort3(arr,left,right) {
    if (left==right) return ;
    var index=partion3(arr,left,right);
    if (index>left) quickSort3(arr,left,index);
    if (index<right) quickSort3(arr,index+1,right);
}
function quickSort3_1(arr) {
    if (arr.length<=1) return arr;
    var index=partion3(arr,0,arr.length);
    return quickSort3_1(arr.slice(0,index)).concat(arr[index],quickSort3_1(arr.slice(index+1)))
}



var arr=[];
for (var i=0;i<20;i++) {
    arr[i]=Math.floor(Math.random()*101)
}
var a=[1,3,7,2,4,9];
console.log("排序前arr:"+arr);
shellSort2(arr);
console.log("排序后arr:"+arr);