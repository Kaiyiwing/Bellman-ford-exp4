Minimum Spanning Tree（Algorithm exp 3）
===========
[![GitHub license](https://img.shields.io/github/license/aimerforreimu/AUXPI.svg)](https://github.com/aimerforreimu/AUXPI)   

## 操作说明 
* 刷新自动开始， 反复生成各种图，直至生成的图有负环
* 由于生成图的算法不智能，导致过程会很慢（看人品）
* 也有时候，最后停止的时候也没有负环。。。(不过通过滑稽的力量给解决了)
## 算法说明  
首先通过Bellman-ford算法判断图内是否存在负环，如果有则开始寻找负环(实现方式就是正常的Bellman-ford)  
寻找负环为，依次删除边之后，判断是否可以relax  
如果删除一个边之后，不能relax，则该边一定在负环中（没证明）  
找到该边之后，则依次遍历该边的前序点，则可找到整个环
## 注意事项  
如果您需要应付实验，因为本代码做了良好的可视化，所以很酷，很容易得到不低的分数  
但是，如果您要以此代码作为参考，希望您查阅其他资料，或者询问身边的同学以避免受我的误导
<br>
<br>  
已发现bug：
* 随机生成图算法，并不能保证每个点都有入度，所以，可能出现某个点的d依旧为无穷大的现象
* 某些时候，Bellman-ford算法，返回值为false，但是依旧找不到负环，因时间有限，不想debug(安逸)  

如果您使用了我的代码，或者参考了我的代码，希望star一下，感激不尽
## LICENSE

GNU General Public License v3.0
