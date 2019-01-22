$(document).ready(function () {

    var base_url = "http://localhost:8080/netdisk/";
    var NetDisk_url = "http://localhost:8080/NetDisk/";

    var crtpath = "/";
    var fileData = null;

    update(crtpath);

    $("#sureDirname").click(function () {
        mkdir();
    });

    $("#sureUpload").click(function () {
        uploadFile();
    });

    $("#chooseFile").click(function () {
        $("#file").click();
    });

    $("#file").change(function () {
        $("#filename").text(document.getElementById("file").files[0].name);
    });

    function update(path) {
        axios
            .post(
                base_url + "files",
                { path: path },
                { headers: { "Content-Type": "application/json;charset=utf-8" } }
            )
            .then(function (res) {
                //成功请求后返回数据的处理
                if (res.data.status == 200) {
                    crtpath = path;
                    fileData = res.data.data;
                    updateIndex();
                    updateTableView(fileData);
                } else if (res.data.status == 400) {
                    alert("error:" + res.data.msg);
                }
            })
            .catch(function (error) {
                alert("error" + error);
            });
    }

    function updateTableView(fileData) {
        $("#tbody").html("");
        var tbody = $("#tbody");
        for (i in fileData) {
            tbody.append(rowDataHtml(fileData[i], i));
        }
    }

    function updateIndex() {
        $("#index").html("");
        var index = $("#index");
        var paths = getpaths();
        index.append(breadcrumbItem("/", ""));
        for (i in paths) {
            index.append(breadcrumbItem(paths[i], "", i));
        }
    }


    function rowDataHtml(rowData, index) {
        var tr = $("<tr></tr>");
        var tdName = $("<td></td>");
        var a = $("<a href=\"javascript:void(0)\">" + rowData.name + "</a>");
        a.click(function () {
            if (rowData.isFile == true) {
                window.open(
                    NetDisk_url + crtpath + rowData.name
                  );
            } else {
                update(crtpath + fileData[index].name + "/");
            }
        });
        tdName.append(a);


        var d = $("<i class=\"fa fa-trash-o fa-lg float-right\"></i>");
        d.click(function(){
            del(index);
        });
        var tdSize = $("<td>" + rowData.size + "</td>");
        tdSize.append(d);


        tr.append(tdName, tdSize);
        return tr;
    }

    function breadcrumbItem(text, active, index) {
        var x = $("<li class=\"breadcrumb-item " + active + "\"><a href=\"javascript:void(0)\">" + text + "</a></li>");
        x.click(function() {
            cdTo(index);
        });
        return x;
    }

    function cdTo(index) {
        var paths = getpaths();
        var p = "";
        //拼接路径path
        for (var i = 0; i <= index; i++) {
          p = p + "/" + paths[i];
        }
        update(p + "/");
    }

    function getpaths() {
        var strs = crtpath.split("/");
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
    }

    function uploadFile() {
        var file = document.getElementById("file").files[0];
        if (file == null) {
            alert("文件选择为空");
        } else {
            var form = new FormData();
            form.append("path", crtpath);
            form.append("file", file);
            axios.post(base_url + "uploadfile", form, { headers: { "Content-Type": "multipart/form-data" } }).
                then(function (res) {
                    if (res.data.status == 200) {
                        update(crtpath);
                        alert("成功上传[" + file.name + "]");
                        $("#file").val("");
                        $("#uploadFileModal").modal('hide');
                    } else if (res.data.status == 400) {
                        alert("上传失败");
                    }
                }).catch(function (error) {
                    alert(error);
                });
        }
    }

    function mkdir() {
        var dirname = $("#dirname").val();
        var reg = /^\s+$/;
        if (reg.test(dirname) || dirname == "") {
            alert("文件夹名不能为空");
        } else {
            axios
                .post(base_url + "mkdir", {
                    path: crtpath,
                    dirname: dirname
                })
                .then(function (res) {
                    //成功请求后返回数据的处理
                    if (res.data.status == 200) {
                        fileData = res.data.data;
                        update(crtpath);
                        $("#newDirModal").modal('hide');
                    } else if (res.data.status == 400) {
                        alert("error:" + res.data.msg);
                    }
                    $("#dirname").val("");
                })
                .catch(function (error) {
                    alert("error" + error);
                });
        }
    }

    function del(index) {
        var f = fileData[index];
        axios
          .post(base_url + "deldir", {
            path: crtpath,
            name: f.name
          })
          .then(function (res) {
            //成功请求后返回数据的处理
            if (res.data.status == 200) {
              update(crtpath);
            } else if (res.data.status == 400) {
              alert("error:" + res.data.msg);
            }
          })
          .catch(function (error) {
            alert("error" + error);
          });
    }



});