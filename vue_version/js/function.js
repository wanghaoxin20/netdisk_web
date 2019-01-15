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
            updateTable: function(path) {
                var that = this;
                let form = new FormData();
                form.append("path", path);
                axios.post("http://localhost:8080/netdisk/files", form, {headers:{"Content-Type": "multipart/form-data"}})
                .then(function(res){
                    that.tableData = res.data;
                }).catch(function(error) {
                    alert("error" + error);
                });
            },
            trDBClick: function(e) {
                var fp = this.tableData[e.currentTarget.getAttribute("index")];
                if (fp.isFile == false) {
                    this.updateTable("/" + fp.name);
                }
            }
        },
        created() {
            this.updateTable("/");
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

    //窗口resize事件
    window.onresize = function() {
        leftBar.height = window.innerHeight - 70 + "px";
        pane.width = window.innerWidth - 250 + "px";
        pane.height = window.innerHeight - 70 + "px";
        pane.tableHeight = window.innerHeight - 70 - 80 - 58 - 20 + "px";
    }
}