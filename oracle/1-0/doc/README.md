##1. 更新服务器时间
```shell
yum install -y ntpdate
ntpdate time-nw.nist.gov
```
##2. 检查软硬件信息
```shell
#检查swap是否符合要求:
#Between 1 GB and 2 GB   
  1.5 times the size of the RAM 
#Between 2 GB and 16 GB
  Equal to the size of the RAM
#More than 16 GB       
  16 GB

#物理内存大小 
grep MemTotal /proc/meminfo

#Swap大小
grep SwapTotal /proc/meminfo

#tmpfile大小,至少1G
df -h /tmp

#OS bit
uname -m

#shm类型需要时tmpfs
df -h | grep shm

#磁盘空间
df -h
```
##3. RPM包安装
```shell
yum install oracle-rdbms-server-12cR1-preinstall
yum groupinstall "X Window System"
yum install binutils compat-libcap1 compat-libstdc++-33 gcc gcc-c++ glibc glibc-devel ksh libgcc libstdc++ libstdc++-devel libaio libaio-devel libXext libXtst libX11 libXau libxcb libXi make sysstat unixODBC pam up2date
```



##4. 用户和组
```shell
/usr/sbin/groupadd -g 54321 oinstall
/usr/sbin/groupadd -g 54322 dba
/usr/sbin/groupadd -g 54323 oper
/usr/sbin/groupadd -g 54324 backupdba
/usr/sbin/groupadd -g 54325 dgdba
/usr/sbin/groupadd -g 54326 kmdba
/usr/sbin/groupadd -g 54327 asmdba
/usr/sbin/groupadd -g 54328 asmoper
/usr/sbin/groupadd -g 54329 asmadmin
/usr/sbin/useradd -u 54321 -g oinstall -G dba,asmdba,backupdba,dgdba,kmdba,oper oracle
passwd oracle
```
##5. 目录结构
```shell
mkdir -p /u01/app/oracle
chown oracle:oinstall -R /u01
mkdir -p /u01/app/oracle/product/12.1.0/dbhome_1
chown -R oracle:oinstall /u01/app/oracle
chmod -R 775 /u01/app/oracle
```

##6. 环境变量
```shell
NLS_LANG
TMP=/mount_point/tmp
TMPDIR=/mount_point/tmp
export ORACLE_SID=test
export ORACLE_BASE=/u01/app
export ORACLE_HOME=$ORACLE_BASE/oracle/product/12.1.0/db_1
export PATH=$ORACLE_HOME/bin:$PATH
```

##7. Tcp/Udp参数
```shell
echo 9000 65500 > /proc/sys/net/ipv4/ip_local_port_range 
```
##8. 内核参数
```shell
/etc/security/limits.conf
$ ulimit –Sn 1024
$ ulimit –Hn 65536
$ ulimit –Su 2047
$ ulimit –Hu 16384
$ ulimit –Ss 10240
$ ulimit –Hs 32768


cat /proc/sys/kernel/sem
# 250 32000 100 128
cat /proc/sys/kernel/shmall
# 物理内存的40%
cat /proc/sys/kernel/shmmax
# 物理内存的50%
cat /proc/sys/kernel/shmmni
# 4096
cat /proc/sys/kernel/panic_on_oops
# 1
cat /proc/sys/fs/file-max
# 6815744
cat /proc/sys/fs/aio-max-nr
# 1048576
cat /proc/sys/net/ipv4/ip_local_port_range
# 9000 65500
cat /proc/sys/net/core/rmem_default
# 262144
cat /proc/sys/net/core/rmem_max
# 4194304
cat /proc/sys/net/core/wmem_default
# 262144
cat /proc/sys/net/core/wmem_max
# 1048576

#vim /etc/sysctl.conf
#semmsl semmns semopm semmni 
#shmall
#shmmax
#shmmni
#panic_on_oops
#file-max
#aio-max-nr
#ip_local_port_range
#rmem_default
#rmem_max
#wmem_default
#wmem_max
```

###在完成之后备份root.sh脚本
###使用CRON来定时更新Linux时间
