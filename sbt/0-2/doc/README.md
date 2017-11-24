###1.编写一个仓库配置文件
```shell
# cat /tmp/reop.abc 
[repositories] 
  local 
  my-proxy: http://120.24.162.243:8081/nexus/content/groups/public
```

###2.在你构建项目的时候增加使用仓库的参数
```shell
sbt package -Dsbt.repository.config=/tmp/reop.abc
```