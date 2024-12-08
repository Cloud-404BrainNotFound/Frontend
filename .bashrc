# 加载 git-prompt.sh，显示当前 Git 分支
if [ -f /usr/share/git-core/contrib/completion/git-prompt.sh ]; then
    source /usr/share/git-core/contrib/completion/git-prompt.sh
fi

# 自定义 PS1 提示符，显示 Git 分支
export PS1='\u@\h \w$(__git_ps1 " (%s)")\$ '

