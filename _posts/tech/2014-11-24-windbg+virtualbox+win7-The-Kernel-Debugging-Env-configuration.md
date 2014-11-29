---
layout: post
title: Windbg+VirtualBox+win7 内核调试环境配置
category: tech
---


{{ page.title }}
================
<p class="meta">24 November 2014 - Harbin</p>


看了网上很多的教程，一般都是`Windbg+Vmware+win7`和`Windbg+VirtualBox+xp`或者是`Windbg+Vmware+XP`的，没有找到`Windbg+VirtualBox+win7`的，于是只能根据一个VMware的自己配置一下，看看运气如何了。验证过后，发现，有效。下面分6个部分，简要叙述。    
###一. 虚拟机和windows 7系统安装
这部分就不详细说了，网上有很多很多的教程.
###二. 虚拟机配置
首先不要打开虚拟机里的系统。     
设置 -> 串口：（如下图）    
![VirtualBoxSettings]({{ site.rul }}/images/20141124/VirtualBoxSettings.jpg)    
启动：串口1    
端口模式：主机管道    
启用：创建通道    
端口/文件位置：\\\\.\pipe\COM_1
###三. windows 7系统配置
进入系统，以Administrator权限启动Command Line，键入命令：`bcdedit`，如下图。（因为我已经配置好了，所以会有3项）    
![DebuggedSystemSettings]({{ site.rul }}/images/20141124/DebuggedSystemSettings.png)    
配置的命令依次为：    
1 设置端口COM1，比特率115200  
{% highlight C %}  
bcdedit /dbgsettings 或 bcdedit /dbgsettings serial bandrate:115200 debugport:1    
{% endhighlight %}    
2 复制一个开机选项，计入OS的debug模式 (DebugEnty为显示的名字，可以修改)   
{% highlight C %}  
bcdedit /copy {current} /d DebugEnty    
{% endhighlight %}     
复制其中的ID号     
3 增加一个新的选项到引导菜单
{% highlight C %}  
bcdedit /displayorder {current} {ID} 
{% endhighlight %}     
4 激活Debug
{% highlight C %}  
bcdedit /debug {ID}
{% endhighlight %}     
5 然后打开msconfig（打开Run：输入msconfig），在Boot项中选中刚刚新建的启动项，再选Advanced options，选中Debug、Debug port、Baud rate（默认已经选上了，如下图）。    
![DebuggedSystemBootSettings]({{ site.rul }}/images/20141124/DebuggedSystemBootSettings.png)        

###四. Windbg配置
Windbg下载：[Here](http://www.windbg.org/)    
安装完成后在桌面创建一个快捷方式，然后右键->属性，在Target中的引号后面添加如下：    
{% highlight C %}
-b -k com:port=\\.\pipe\com_1,baud=115200,pipe
{% endhighlight %}
![WindbgSettings]({{ site.rul }}/images/20141124/WindbgSettings.png)    
###五. 完成
到目前，所有的配置工作基本就完成了。    
然后启动Windbg，会显示：    
`waiting to connect ...`    
然后启动系统，到系统进入引导时，会被中断，Windbg显示如下：    
![OK]({{ site.rul }}/images/20141124/OK.png)      
###六. 符号目录配置
如上图，我们可以看到有两个ERROR：`Symbol file could not be found.`    
下面是如何配置Symbol目录。    
Windbg访问符号需要两个文件：SYMSRV.DLL和SYMSTORE.EXE，这两个文件都在Windbg的安装目录中：    
`C:\Program Files\windows Kits\8.1\Debuggers\x86.`       
所以第一步是将这个目录加入到系统的环境变量path中。    
第二步：新建环境变量_NT_SYMBOL_PATH,值为：`C:\Symbols;SRV*C:\Symbol* http:/msdl.microsoft.com/downloa/ymbols `   
第三步：重启计算机。

参考：    
1. [VMware+Windgb+Win7内核驱动调试](http://yexin218.iteye.com/blog/545187)     
2. [安装和配置Windbg的Symbol](blog.csdn.net/whatday/article/details/7290164)