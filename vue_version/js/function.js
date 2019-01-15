window.onload = function () {
    var navHeader = new Vue({
        el: '#nav-header',
        data: {
            title: "MX网盘"
        }
    });
    
    var leftBar = new Vue({
        el: '#left-bar',
        data: {
            height: window.innerHeight - 70 + "px",
            item1: "我的文件",
            item2: "我的信息",
            item3: "退出网盘",
            active: 0
        },
        methods: {
            changeItem: function(val) {
                var items = document.getElementsByClassName("bar-item");
                items[this.active].classList.remove("itemActive");
                items[val].classList.add("itemActive");
                this.active = val;
                pane.updateTable("/Git");
            }
        },
        computed: {
            height: {
                get: function() {
                    return this.height;
                },
                set: function(val) {
                    this.height = val;
                }
            }
        }
    });
    
    var pane = new Vue({
        el: '#pane',
        data: {
            btn1_text: "上传文件",
            btn2_text: "新建文件夹",
            paneWidth: window.innerWidth - 250 + "px",
            paneHeight: window.innerHeight -70 + "px",
            tableHeight: window.innerHeight - 70 - 80 - 58 - 20 + "px",
            tableData: [],
            crtPath: "/",
        },
        methods: {
            //请求并更新表格数据
            update: function(path) {
                var that = this;
                axios.post("http://localhost:8080/netdisk/files", {path:path}, {headers:{"Content-Type": "application/json;charset=utf-8"}})
                .then(function(res){
                    //成功请求后返回数据的处理
                    if (res.data.status == 200) {
                        that.tableData = res.data.data;
                        that.crtPath = path; //更新当前路径
                    } else if (res.data.status == 400) {
                        alert("error:" + res.data.msg);
                    }
                }).catch(function(error) {
                    alert("error" + error);
                });
            },
            //双击表格行
            trDBClick: function(index) {
                var fp = this.tableData[index];
                if (fp.isFile == false) {
                    this.update(this.crtPath + fp.name + "/");
                }
            },
            //下载文件
            download: function(index) {
                var fp = this.tableData[index];
                if (fp.isFile == true) {
                    window.open("http://localhost:8080/NetDisk/" + this.crtPath + fp.name);
                }
            },
            //获取路径
            getPaths: function() {
                var strs = this.crtPath.split("/");
                var reg = /^\/+|\s+$/;
                var paths = [];
                var j = 0;
                for (i in strs) {
                    if (!reg.test(strs[i]) && strs[i] != "") {
                        paths[j] = strs[i];
                        j++;
                    }
                }
                return paths;
            },
            //跳转目录
            cdTo: function(index) {
                var paths = this.getPaths();
                var p = "";
                //拼接路径path
                for (var i = 0; i <= index; i++) {
                    console.log(paths[i]);
                    p = p + "/" + paths[i];
                } 
                this.update(p + "/");

            },
            mkdir: function(crtpath, dirname) {
                var that = this;
                axios.post("http://localhost:8080/netdisk/mkdir", {path: crtpath, dirname: dirname})
                .then(function(res){
                    //成功请求后返回数据的处理
                    if (res.data.status == 200) {
                        that.update(that.crtPath);
                    } else if (res.data.status == 400) {
                        alert("error:" + res.data.msg);
                    }
                }).catch(function(error) {
                    alert("error" + error);
                });
            }


        },
        //初始化
        created() {
            this.update("/");
        },
        computed: {
            width:{
                get: function() {
                    return this.paneWidth;
                },
                set: function(val) {
                    this.paneWidth = val;
                }
            },
            height: {
                get: function() {
                    return this. paneHeight;
                },
                set: function(val) {
                    this.paneHeight = val;
                }
            },
            tableHeight: {
                get: function() {
                    return this.tableHeight;
                },
                set: function(val) {
                    this.tableHeight = val;
                    alert(this.tableHeight);
                }
            }
        }
    });

    var addDirPane = new Vue({
        el: '#addDirPane',
        data: {
            height: window.innerHeight + "px",
            display: "none"
        },
        computed: {
            height: {
                get: function() {
                    return this.height;
                },
                set: function(height) {
                    this.height = height;
                }
            }
        }

    });

    //窗口resize事件
    window.onresize = function() {
        leftBar.height = window.innerHeight - 70 + "px";
        pane.width = window.innerWidth - 250 + "px";
        pane.height = window.innerHeight - 70 + "px";
        pane.tableHeight = window.innerHeight - 70 - 80 - 58 - 20 + "px";
        addDirPane.height = window.innerHeight + "px";
    }
}