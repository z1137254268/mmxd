#!/usr/bin/env bash

#传参
Token=$1

#为输入Token则不安装
check_variable() {
  [[  -z "${Token}" ]] && echo"你的Token呢" && exit 0 
}

# 安装系统依赖
check_dependencies() {
  DEPS_CHECK=("wget" )
  DEPS_INSTALL=(" wget" )
  for ((i=0;i<${#DEPS_CHECK[@]};i++)); do [[ ! $(type -p ${DEPS_CHECK[i]}) ]] && DEPS+=${DEPS_INSTALL[i]}; done
  [ -n "$DEPS" ] && { apt-get update >/dev/null 2>&1; apt-get install -y $DEPS >/dev/null 2>&1; }
}

download_agent() {
wget https://github.com/cloudflare/cloudflared/releases/download/2023.1.0/cloudflared-linux-amd64
mv cloudflare-linux-amd64 cloudflare
}

run（）{
    ./cloudflare service install ${Token}
}

check_variable
check_dependencies
download_agent
run
