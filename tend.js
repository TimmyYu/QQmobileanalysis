function diagrams() {};
diagrams.prototype = {
    leftboard_title: 'com.tencent.mov',
    url: '',
    liclick:null,
    /**<p>格式化数字
     * <p>数字978671,处理返回的数据为978,671
     * @param str 源数据
     * @return 返回处理过后的数据
     * */
    formatNum: function(str) {
	var length = str.length,
	    a = (length - 1) / 3,
	    m = length % 3,
	    i, s, result;
	m = m == 0 ? 3 : m
	s = str.substr(0, m);
	for (i = 1; i < a; i++) {
	    s = s.concat(',');
	    s = s.concat(str.substr(m + 3 * (i - 1), 3));
	}
	return s;
    },

    /**显示TEND侧边栏的数据
     *@param  data 数据格式{pv:1000,uv:1000,dtime:00:00:20}
     *@return 返回生成好的侧边栏HTML代码
     */
    leftboard: function(data) {
	var leftboard = $("<div class=\"start\"></div>");
	leftboard.append("<h5 title  = \"" + data.PageName + "\">" + data.FullName.substring(0, 14) + "</h5>");
	leftboard.append("<ul><li>访问次数</li>" +
			 "<li>" + this.formatNum(data.Pv) + "</li>" +
			 "<li>访问人数</li>" +
			 "<li>" + this.formatNum(data.Uv) + "</li>" +
			 "<li>人均停留时长</li>" +
			 "<li>" + data.OnlineTime + "</li>" +
			 "</ul>");
	return leftboard;
    },
    /**顶端的工具项
     * */
    topbar: function() {
	var html = $("<div class=\"ui_filter\"></div>");
	html.append("<div class=\"ui_filter_bar\"></div>");
    },

    /**修正路径的名称长度过长的问题
     *@param str  传入的字符串
     *@return 返回处理后的字符串
     */
    fixTagLengh: function(str) {
	if (str.length <= 15)
	    return str;
	else
	    return str.substring(0, 15) + "..."
    },

    /** 得到鼠标的位置
     * @param null
     * @return 返回MAP类型，X为LEFT的值，Y为TOP的值
     */
    getMousePosition: function() {
	var e = event || window.event,
	    point = {
		x: e.clientX,
		y: e.clientY
	    };
	return point;
    },
    /** 修正可能存在的数据总数大小<10的情况,则标签置为空
     *@param data 传入的数据对象
     *@return 处理好且有“”值的DATA对象
     */
    fixColumnData: function(data) {
	if (data.length < 10) {
	    var temparr = new Array(),
		arr_end = data[data.length - 1],
		nullarr = {
		    NextPage: "",
		    Pv: "",
		    selected: 0,
		    FullName: "",
		    percent: ""
		};
	    temparr[9] = arr_end;
	    for (var i = 0; i < 9; i++) {
		if (!data[i]) {
		    temparr[i] = nullarr;
		} else {
		    temparr[i] = data[i];
		}
	    }
	    temparr[data.length - 1] = nullarr;
	    return temparr;
	}
	return data;

    },
    /**生成列数据
     * @param data              每一列的数据
     * @param position        当前属于哪一列
     * @param before_first   前一列是否否是首行即选
     * */
    create_column: function(data, position, before_first) {

	var html = $("<div class=\"column column_" + position + "\"></div>"),
	    ul = $("<ul></ul>");
	ul.append("<li class=\"description\">第" + position + "次跳转用户分布(%)</li>");
	for (var i = 0; i < data.length; i++) {
	    /*首和末的数据不同，分开处理*/
	    if (data[i].selected == 1 && i == 0) {
		var singleli = $("<li class = \"current first\"></li>")
			.append("<div class=\"bg_left\"><div>")
			.append("<div class=\"box\"><h6>" +
				data[i].percent + "</h6><p id = \"" + data[i].FullName + "\">" + this.fixTagLengh(data[i].NextPage) + "</p></div>")
			.append("<div class=\"bg_right\"><i class=\"bg_b\"></i></div>");
		ul.append(singleli);
	    } else if (data[i].selected == 1) {
		var singleli = $("<li class = \"current\"></li>")
			.append("<div class=\"bg_left\"><div>")
			.append("<div class=\"box\"><h6>" + data[i].percent +
				"</h6><p id = \"" + data[i].FullName + "\">" + this.fixTagLengh(data[i].NextPage) + "</p></div>")
			.append("<div class=\"bg_right\"><i class=\"bg_a\"></i><i class=\"bg_b\"></i></div>");
		ul.append(singleli);
	    } else if (i == 0) {
		/*是否是第一行且上一列选择是否是第一行*/
		if (before_first == 1)
		    var singleli = $("<li ></li>");
		else
		    var singleli = $("<li class = \"first\"></li>");
		singleli.append("<div class=\"bg_left\"><div>")
		    .append("<div class=\"box\"><h6>" + data[i].percent + 
			    "</h6><p id = \"" + data[i].FullName + "\">" + this.fixTagLengh(data[i].NextPage) + "</p></div>")
		    .append("<div class=\"bg_right\"></div>");
		ul.append(singleli);
	    } else if (i == (data.length - 1)) {
		/*倒数第一行的样式*/
		var singleli = $("<li class = \"last\" ></li>")
			.append("<div class=\"bg_left\"><div>")
			.append("<div class=\"box exit\"><h6>" + data[i].percent + 
				"</h6><p id = \"" + data[i].FullName + "\">" + this.fixTagLengh(data[i].NextPage) + "</p></div>")
			.append("<div class=\"bg_right\"></div>");
		ul.append(singleli);
		/*倒数第二行的样式*/
	    } else if (i == (data.length - 2)) {
		var singleli = $("<li class = \"other\"></li>")
			.append("<div class=\"bg_left\"><div>")
			.append("<div class=\"box\"><h6>" + data[i].percent +
				"</h6><p id = \"" + data[i].FullName + "\">" + this.fixTagLengh(data[i].NextPage) + "</p></div>")
			.append("<div class=\"bg_right\"></div>");
		ul.append(singleli);
	    } else {
		/*默认的样式*/
		var singleli = $("<li class></li>")
			.append("<div class=\"bg_left\"><div>")
			.append("<div class=\"box\"><h6>" + data[i].percent + "</h6><p id = \"" +
				data[i].FullName + "\">" + this.fixTagLengh(data[i].NextPage) + "</p></div>")
			.append("<div class=\"bg_right\"></div>");
		ul.append(singleli);
	    }
	}
	ul.children("li").click(this.liclick);
	html.append(ul);
	return html;
    },
    /**重新绘制
     * 重载数据标签	
     **/
    refresh: function() {

    },
    /**弹出菜单
    *@return 弹出菜单的HTML
    */
    CreatePopupmemnu: function() {
	var pMenu = $("<div class=\"mod_pathTips\"></div>");
	return pMenu;

    },
    /**显示标签菜单栏
     *@param x 鼠标X轴
     *@param y 鼠标Y轴 
     *@param data 标签读取的数据源
     * */
    showPopupmemnu: function(x,y,data) {
	var html  = "<div class=\"content\">"+
	    "<h4>"+data.Page+"</h4>"+
	    "<dl>"+
	    "<dt>访问次数</dt>"+
	    "<dd>"+data.Pv+"</dd>"+
	    "<dt>访问人数</dt>"+
	    "<dd>"+data.Uv+"</dd>"+
	    "<dt>人均停留时长</dt>"+
	    "<dd>"+data.OnlineTime+"</dd>"+
	    "</dl></div>";
	$(".mod_pathTips").html(html).css({'left':x,'top':y}).show();
    },
    /**绑定LI的CLICK的事件
     * @param obj 事件的来源
     * */
    bind:function(obj){
	this.liclick =obj.liclick || function(){};
	console.log(this.liclick);
    },
    /**<p>初始化数据并把HTML对象绘制到TEND对象中
     * @param divname 绘制到DIVNAME这个对象
     * @param data 绘制的数据
     * */
    init: function(divname, data) {
	var main = $("<div class=\"main\"></div>"),
	    before_first = 0;
	main.append(this.leftboard(data[0]));
	/*第0位是ROOT数据的展示位*/
	for (var i = 1; i < data.length; i++) {
	    if (i > 1) {
		if (data[i - 1][0].selected == 1) {
		    before_first = 1;
		}
	    }
	    main.append(this.create_column(this.fixColumnData(data[i]), i, before_first));
	    before_first = 0;
	}
	$("#" + divname).html(main);
	$("#"+ divname).append(this.CreatePopupmemnu());
	$("#" + divname + " .column li").click(function() {
	});
	var getMousePosition = this.getMousePosition,showMenu = this.showPopupmemnu;
	$("#" + divname + " .column li").hover(function() {
	    var point = getMousePosition()
	    $.get("tip.json",function(data){
		showMenu(point.x,point.y,data);
	    });
	}, function() {
	    $(".mod_pathTips").hide();
	});
    }
};
