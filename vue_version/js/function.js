window.onload = function() {
  var navHeader = new Vue({
    el: "#nav-header",
    data: {
      title: "MX网盘"
    }
  });

  var leftBar = new Vue({
    el: "#left-bar",
    data: {
      style: {
        height: window.innerHeight - 70 + "px"
      },
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
      }
    }
  });

  var pane = new Vue({
    el: "#pane",
    data: {
      btn1_text: "上传文件",
      btn2_text: "新建文件夹",
      paneStyle: {
        width: window.innerWidth - 260 + "px",
        height: window.innerHeight - 70 + "px"
      },
      tableStyle: {
        height: window.innerHeight - 70 - 80 - 58 - 20 + "px"
      },
      tableData: [],
      crtPath: "/"
    },
    methods: {
      //请求并更新表格数据
      update: function(path) {
        var that = this;
        axios
          .post(
            "http://localhost:8080/netdisk/files",
            { path: path },
            { headers: { "Content-Type": "application/json;charset=utf-8" } }
          )
          .then(function(res) {
            //成功请求后返回数据的处理
            if (res.data.status == 200) {
              that.tableData = res.data.data;
              that.crtPath = path; //更新当前路径
            } else if (res.data.status == 400) {
              alert("error:" + res.data.msg);
            }
          })
          .catch(function(error) {
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
          window.open(
            "http://localhost:8080/NetDisk/" + this.crtPath + fp.name
          );
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
      showDNPane: function() {
        darkpane1.$data.dkp1Style.display = "";
      }
    },
    //初始化
    created() {
      this.update("/");
    }
  });

  var darkpane1 = new Vue({
    el: "#darkpane1",
    data: {
      dkp1Style: {
        height: window.innerHeight + "px",
        display: "none"
      },
      adpStyle: {
        left: (window.innerWidth - 350) / 2 + "px",
        top: (window.innerHeight - 240) / 2 + "px"
      },
      dirname: ""
    },
    methods: {
      mkdir: function() {
        var that = this;
        var reg = /^\s+$/;
        if (reg.test(this.dirname) || this.dirname == "") {
          alert("文件名不能为空");
        } else {
          axios
            .post("http://localhost:8080/netdisk/mkdir", {
              path: pane.$data.crtPath,
              dirname: that.dirname
            })
            .then(function(res) {
              //成功请求后返回数据的处理
              if (res.data.status == 200) {
                pane.update(pane.$data.crtPath);
                that.close();
              } else if (res.data.status == 400) {
                alert("error:" + res.data.msg);
              }
            })
            .catch(function(error) {
              alert("error" + error);
            });
        }
      },
      close: function() {
        this.dirname = "";
        this.dkp1Style.display = "none";
      }
    }
  });

  //窗口resize事件
  window.onresize = function() {
    leftBar.$data.style.height = window.innerHeight - 70 + "px";
    pane.$data.paneStyle.width = window.innerWidth - 260 + "px";
    pane.$data.paneStyle.height = window.innerHeight - 70 + "px";
    pane.$data.tableStyle.height =
      window.innerHeight - 70 - 80 - 58 - 20 + "px";
    darkpane1.$data.dkp1Style.height = window.innerHeight + "px";
    darkpane1.$data.adpStyle = {
      left: (window.innerWidth - 350) / 2 + "px",
      top: (window.innerHeight - 240) / 2 + "px"
    };
  };
};
