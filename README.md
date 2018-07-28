#websshd


### 安装Node 6.9

```
下载解压设置环境变量
```

### 安装g++

```
yum groupinstall "Development Tools" -y
```

### 安装依赖组件

```
npm install
```

### 下载kubectl

```
wget kubectl
```

### 构建镜像

```
docker build -t xxx . 
```
### 启动服务

```
docker run -tid --name websshd \
    xxx
```


# 部署
kubectl apply -f kube-webssh.yaml
# 使用
http://172.16.211.130:32490/exec/index.html?token=kube-system|kube-webssh-98cbc858d-mswcw|websshd|sh