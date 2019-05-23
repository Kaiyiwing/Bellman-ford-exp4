let canvas, ctx;
// 计数
let num = 0;
// 存储图的结构
let points = [];
let graph = [];
let graph2 = [];// 用于拷贝数组
// 画布属性
let c_width = 1200, c_height = 600;

let arrow_color = 'rgba(0,0,256,0.4)';
let arrow_color2 = 'rgba(0,256,0,0.8)';
let arrow_theta = 25;
let arrow_headlen = 20;

let draw_point = true;
let draw_line = false;
let do_draw_line = false;

let init_x, init_y, init_point;
// 点半径
let r = 20;
// 点颜色，第一个为正常颜色，第二个为用于标注的颜色
let point_color = ['red', 'green'];
let circle = []; // 用来存储边

let infinite = 100;
let has = [];
let interval;

class Point {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;

        // 前驱点
        this.pi = -1;
        // 距离
        this.d = infinite;
        this.draw_color = 0;
    }

    toString() {
        return '(' + this.id + ': ' + this.x + ', ' + this.y + ', ' + color[this.color] + ',' + this.pi + ')';
    }
}

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');

    // clickInit();

    // random_generate();

    interval = window.setInterval("find_negative()", 500);



    

    // console.log(bellman_fold(0));



    $(document).keydown(function (e) {
        if (e.which === 76) {
            draw_point = false; // l
            do_draw_line = true;
        }

        if (e.which === 68) {
            //d

        }
    });
};
function find_negative()
{
    num = 0;
    points = [];
    graph = [];
    graph2 = [];// 用于拷贝数组
    circle = []; // 用来存储边
    has = [];
    random_generate();
    draw(graph);
    if(!bellman_fold(0))
    {
        clearInterval(interval);
        find_negative_circle();
    }
}
function demo_generate()
{
    points.push(new Point(0, 300, 400));
    points.push(new Point(1, 600, 200));
    points.push(new Point(2, 900, 200));
    points.push(new Point(3, 900, 600));
    points.push(new Point(4, 600, 600));

    graph = [[undefined,6,undefined,undefined,7],
                [undefined,undefined,5,-4,8],
                [undefined,-2,undefined,undefined,-3],
                [2,undefined,-7,undefined,undefined],
                [undefined,undefined,undefined,9,undefined]];
}

function random_generate() {
    let point_num = 10;
    let edge_num = 20;
    let weight_max = 5;
    let weight_min = -5;
    let x, y, mid_x = c_width / 2, mid_y = c_height / 2;
    let random_range_x = c_width - 2 * r;
    let random_range_y = c_height - 2 * r;

    for (let i = 0; i < point_num; i++) {
        do {
            x = mid_x + random_range_x * (Math.random() - .5);
            y = mid_y + random_range_y * (Math.random() - .5);
        } while (!isOverlap(x, y));

        let point_temp = new Point(num, x, y);
        points.push(point_temp);
        graph[num] = [];
        drawCircle(ctx, x, y, num, point_color[point_temp.draw_color]);
        num++;
    }

    for (let i = 0; i < edge_num; i++) {
        let edgeCount1 = parseInt(Math.random() * point_num);
        let edgeCount2 = parseInt(Math.random() * point_num);
        const weight = weight_min + parseInt(Math.random() * (weight_max + Math.abs(weight_min)) + 1);

        while (!is_in_has(edgeCount1,edgeCount2,has))
        {
            edgeCount1 = parseInt(Math.random() * point_num);
            edgeCount2 = parseInt(Math.random() * point_num);
            if(!is_in_has(edgeCount1,edgeCount2,has))
            {
                has.push(new Node_x(edgeCount1, edgeCount2));

                graph[edgeCount1][edgeCount2] = weight;
            }
        }
    }

    draw(graph);
}

function bellman_fold(start)
{
    points[start].d = 0;

    // 初始化pi
    for(let i=0; i<graph.length; i++)
    {
        for(let j=0; j<graph[i].length; j++)
        {
            if(graph[i][j])
            {
                // 有i到j的边则，j的前驱是i
                points[j].pi = i;
            }
        }
    }


    for(let i=1; i<points.length-1; i++)
    {
        for(let i=0; i<graph.length; i++)
        {
            for(let j=0; j<graph[i].length; j++)
            {
                if(graph[i][j])
                {
                    relax(i,j);
                }
            }
        }
    }

    // 检测是否有负环
    return !can_relax(graph);

}

function relax(u, v)
{
    // 松弛u到v的边
    if(points[v].d > points[u].d + graph[u][v])
    {
        points[v].d = points[u].d + graph[u][v];
        v.pi = u;
        return true;
    }
    return false;
}

function can_relax(graph_x)
{
    let graph = graph_x;
    // 检测整个图是否可以继续relax
    for(let i=0; i<graph.length; i++)
    {
        for(let j=0; j<graph[i].length; j++)
        {
            if(graph[i][j] && points[j].d > points[i].d + graph[i][j])
            {
                return true;
            }
        }
    }
    return false;
}

function find_negative_circle()
{

    for(let i=0; i<graph.length; i++)
    {
        graph2[i] = [];
        for(let j=0; j<graph[i].length; j++)
        {
            graph2[i][j] = graph[i][j];
        }
    }

    let go_on = true;

    for(let i=0; i<graph2.length && go_on; i++)
    {
        for(let j=0; j<graph2[i].length && go_on; j++)
        {
            if(graph2[i][j])
            {
                graph2[i][j] = undefined;// 删除边
                if(!can_relax(graph2))
                {
                    // 如果删除边之后就不能继续relax了，则这个边就是负环上的边
                    let t = i;
                    circle.push(t);
                    while(circle.indexOf(points[t].pi) === -1)
                    {

                        circle.push(points[t].pi);
                        t = points[t].pi;
                        if(t === -1)
                        {
                            break;
                        }
                    }
                    if(t !== -1)
                    {
                        circle = circle.reverse();
                        go_on = false;
                        break;
                    }
                    else{
                        interval = window.setInterval("find_negative()", 500);
                    }

                }
            }
        }
    }

    draw(graph);
    emphasize_circle();
}

function Node_x(from, to) {
    this.from = from;
    this.to = to;
}

function is_in_has(from, to, has) {
    // 判断has中是否已经有了from-to的边
    if(from === to)
    {
        return true;
    }

    for (let i = 0; i < has.length; i++) {
        if ((has[i].from === from && has[i].to === to) || (has[i].from === to && has[i].to === from)) {
            return true;
        }
    }
    return false;
}

function isOverlap(x, y) {
    for (let i = 0; i < points.length; i++) {
        if (cal_distance(x, y, points[i].x, points[i].y) < 4 * r) {
            return false;
        }
    }

    return true;
}

function cal_distance(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2));
}

function clear() {
    ctx.clearRect(0, 0, c_width, c_height);
    num = 0;
    points = [];
    graph = [];
    do_draw_line = false;
}



function clickInit() {
    const c = document.getElementById("canvas");
    c.onmousedown = onClick;
    c.onmousemove = onMove;
    c.onmouseup = onUp;
}

function onClick(e) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;

    if (e.shiftKey && draw_point) {

        let point_temp = new Point(num, x, y);
        points.push(point_temp);
        graph[num] = [];

        drawCircle(ctx, x, y, num, 'red');

        num++;
    }

    if (do_draw_line) {

        init_x = x;
        init_y = y;
        for (let i = 0; i < points.length; i++) {
            if (cal_distance(x, y, points[i].x, points[i].y) < r) {
                init_point = i;
            }
        }
        // console.log(init_point);
        draw_line = true;
    }

}

function onMove(e) {

}

function onUp(e) {
    if (draw_line) {
        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;

        const weight = parseInt(Math.random() * 20 + 1);




        drawArrow(ctx, init_x, init_y, x, y, arrow_theta, arrow_headlen, 3, arrow_color, weight);
        let f_point;

        for (let i = 0; i < points.length; i++) {
            if (cal_distance(x, y, points[i].x, points[i].y) < r) {
                f_point = i;
            }

        }
        // console.log(f_point);

        if(f_point > -1)
        {
            graph[init_point][f_point] = weight;
        }


        draw_line = false;
    }

}



function draw(graph_x) {
    let graph = graph_x;
    ctx.clearRect(0, 0, c_width, c_height);

    for (let i = 0; i < points.length; i++) {
        let distance = points[i].d === infinite ? '♾' : points[i].d;
        drawCircle(ctx, points[i].x, points[i].y, points[i].id, point_color[points[i].draw_color], distance);
    }

    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            if(graph[i][j] && !is_in_circle(i,j))
            {
                drawArrow(ctx, points[i].x, points[i].y, points[j].x, points[j].y, arrow_theta, arrow_headlen, 3, arrow_color, graph[i][j]);
            }
        }
    }

}
function is_in_circle(u, v)
{
    for(let i=0; i<circle.length; i++)
    {
        let from = circle[i];
        let to = circle[(i+1) % circle.length];

        if(u === from && v === to)
        {
            return true;
        }
    }
    return false;
}
function emphasize_circle()
{
    for(let i=0; i<circle.length; i++)
    {
        let from = circle[i];
        let to = circle[(i+1) % circle.length];

        drawArrow(ctx, points[from].x, points[from].y, points[to].x, points[to].y, arrow_theta, arrow_headlen, 5, arrow_color2, graph[from][to]);

    }
}

function Node(element, weight = null) {
    this.element = element;
    this.next = null;
    this.weight = weight;
}

function LList() {
    this.head = new Node('head');
    this.find = find;
    this.insert = insert;
    //this.remove = remove;
    this.display = display;
}

function find(item) {
    let currNode = this.head;
    while (currNode.element != item) {
        currNode = currNode.next;
    }
    return currNode;
}

//插入一个元素
function insert(newElement, item) {
    let newNode = new Node(newElement);
    let current = this.find(item);
    newNode.next = current.next;
    current.next = newNode;
}

function display() {
    let currNode = this.head;
    while (!(currNode.next == null)) {
        document.write(currNode.next.element + '&nbsp;');
        currNode = currNode.next;
    }
}

function drawCircle(ctx, x, y, num, color, distance = null) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 360, false);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.fill();//画实心圆
    ctx.closePath();

    ctx.font = "18px bold 黑体";
    ctx.fillStyle = "#ff0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(num, x, y);

    ctx.fillStyle = 'red';
    ctx.fillText(distance, x, y - 1.5*r );
}

function drawArrow(ctx, fromX, fromY, toX, toY, theta, headlen, width, color, weight = null) {


    theta = typeof(theta) != 'undefined' ? theta : 30;
    headlen = typeof(theta) != 'undefined' ? headlen : 10;
    width = typeof(width) != 'undefined' ? width : 1;
    color = typeof(color) != 'color' ? color : '#000';

    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);

    ctx.save();
    ctx.beginPath();

    let arrowX = fromX - topX,
        arrowY = fromY - topY;

    ctx.moveTo(arrowX, arrowY);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();

    if (weight) {
        ctx.font = "18px bold 黑体";
        // ctx.fillStyle = "black";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let ran = Math.random() * 30;
        ctx.fillText(weight, ((toX + fromX) / 2) + ran, ((toY + fromY) / 2) + ran);
    }
}


