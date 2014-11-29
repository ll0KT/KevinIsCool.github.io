---
layout: post
title: Intel Pin 的配置以及一个简单的例子
category: tech
---

{{ page.title }}
================
<p class="meta">20 November 2014 - Harbin</p>

关于Pin框架就不再组织语言来描述一下了，具体的可以到如下的网站上学习：
[Pin 2.14 User Guide](https://software.intel.com/sites/landingpage/pintool/docs/67254/Pin/html/)

###下面具体说说Pin工具的配置

下载地址：[Pin - A Dynamic Binary Instrumentation Tool](https://software.intel.com/en-us/articles/pin-a-dynamic-binary-instrumentation-tool "Pin - A Dynamic Binary Instrumentation Tool")

1.	之前的Pin版本中，支持通过MicrosoftVisual Studio 2010的命令行运行nmake之类的批处理命令，从Pin 2.12版本开始（我用的是Pin 2.14），需要基于cygwin make来进行编译。

2.	Cygwin安装的时候，默认不安装make工具，所以在安装Cygwin时要选择安装make工具（search make）。

3.	安装好Cygwin之后，将其安装目录下的bin目录，如“D:\cygwin\bin”加入到环境变量path中（最好加在其他所有变量之前，这样保证可以先用Cygwin进行解析），之后就可以直接在cmd中使用Cygwin的命令。例如：tar, ls, grep，make等。

4.	下载的Pin是个压缩包，解压即可。将Pin解压后的文件夹的位置（pin.exe上面一层文件夹）加入到path中，即可在命令行中使用Pin命令。

5.	进入到source/tools/ManualExamples中（使用VS命令行），用make命令（同linux）可以编译所有例子。编译好后进入对应的32位或64位平台的文件夹（obj-ia32）中可以看到生成文件，windows下大多数生成的都是dll文件。然后使用pin命令pin -t itrace.dll --"test.exe"即可运行itrace这个例子对test.exe(是自己编的一个exe放到相同目录下了，如果在其他地方要用完整的路径)进行分析，这个例子的输出在itrace.out中。运行完后可以查看该文件。




参考：

1.	[安装和使用 Intel Pin](http://www.xuebuyuan.com/2005064.html)    
2.	[pin 的使用简介 ——环境设置 基本工具的使用 相关知识](http://blog.csdn.net/familyvirtue/article/details/7768921)