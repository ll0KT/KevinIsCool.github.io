---
layout: post
title: Windows系统架构之关键的系统组件
category: tech
---


{{ page.title }}
================
<p class="meta">03 December 2014 - Harbin</p>

##关键的系统组件
###环境子系统和子系统DLL
环境子系统：将基本的Windows执行体系统服务的**某个子集**暴露给应用程序。每个子系统具有对Windows原生服务一个不同子集的访问能力。这就是说建立在某个子系统之上的应用程序可以做到的事情，不一定在另一个子系统上能够做到。 
   
每个可执行映像（.exe）都被绑定到**唯一的**子系统上。映像文件运行时，都会先根据头部的子系统类型代码，通知对应的子系统有新的进程创建。`在Microsoft Visual C++中，link命令的/SUBSYSTEM修饰符可以指定该类型代码。`应用程序不直接调用Windows的系统服务，而是通过通过一个或多个子系统DLL来间接调用系统服务。Windows子系统DLL：Kernel32.dll、advapi32.dll、User32.dll、Gdi32.dll实现了Windows API函数；SUA（Windows下的UNIX子系统）子系统DLL：Psxdll.dll实现了SUA API函数。 
   
当应用程序调用子系统DLL中的某个函数时，会发生下述三件事之一： 
   
* 该函数完全是在该子系统DLL中实现的（也就是说该程序并没有给环境子系统进程发送消息，也没有调用Windows执行体系统服务），则在用户模式下运行：如`GetCurrentProcess`、`GetCurrentProcessId`函数；    
* 该函数要求调用Windows执行体一次或多次：如Windows的`ReadFile`和`WriteFile`函数分别要求调用底层内部的Windows I/O系统服务NtReadFile和RtWriteFile；
* 该函数要求在子系统进程中完成某些工作（环境子系统进程运行在用户模式下，负责维护那些在其控制下运行的客户应用程序状态）。在这种情况下，该函数通过消息的形式向环境子系统发送请求，子系统执行某个操作，然后子系统DLL等待应答，收到应答之后再返回给调用者。   
 
*有的函数是以上2和3的组合，如Windows的**`CreateProcess`**和**`CreateThread`**函数*    

####子系统启动
子系统由会话管理器(Session Manager)(Smss.exe)进程来启动。启动信息保存于注册表的以下键值中：HKLM\SYSTEM\CurrentControlSet\ Session Manager\Subsystem.    
![RegSessionManager]({{site.url}}/images/20141203/RegSessionManager.png)    

- Required: 系统引导时加载的子系统。该值是两个字符串(Windows和Debug)。
- Windows：包含了Windows子系统的文件规范，Csrss.exe(Client/Server Run-Time Subsystem:客户机/服务器运行时子系统)。
- Debug：用于内部测试。
- Optional： 表明SUA子系统将按需启动。
- Kmode：Windows子系统内核部分的文件名称。

####Windows子系统
Windows子系统是基础子系统，用于处理窗口和显示I/O。其他子系统可以调用Windows子系统完成显示I/O。所以，Windows子系统进程被标记为关键进程，即使对于没有交互的应用程序也是一个必要的组件。（意味着该进程一旦因为什么原因退出，系统就会崩溃）    
**Windows子系统有以下组件构成：**    

* 对于每一个会话，环境子系统进程（Csrss.exe）有一个实例加载三个DLL（Basesrv.dll、Winsrv.dll、Csrsrv.dll）它们包含下列支持：
	- 创建和删除进程和线程
	- 对16位DOS虚拟机（VDM）进程的部分支持
	- SxS（Side-by-Side） /Fusion 和清单文件（manifest）支持
	- 其他一些函数：如`GetTempFile`、`DefineDosDevice`、`ExitWindowsEx`以及几个自然语言支持函数
* 内核模式驱动程序（Win32K.sys）包含下列支持：
	- 窗口管理器（window manager）：控制窗口显示，管理屏幕输出，采集来自键盘、鼠标和其他设备的输入，同时负责将用户消息传递给应用程序。
	- 图形设备接口（GDI, Graphics Device Interface）:针对图形图形输出设备的函数库，其中包括线段、文本、图形的绘制函数，以及图形控制函数。
	- DirectX功能的包装函数，window对DirectX的支持在另外一个内核驱动程序（Dxgkrnl.sys）中实现。
* 控制台宿主进程（Conhost.exe）：提供对控制台应用程序的支持。
* 子系统DLL（如Kernel32.dll、Advapi32.dll、User32.dll、Gdi32.dll）：将已文档化的Windows API函数转化成Ntoskrnl.exe和Win32k.sys中恰当的且绝大多数未文档化的内核模式系统服务调用。
* 图形设备驱动程序：与硬件相关的图形显示器驱动程序、打印机驱动程序和视频微端口驱动程序。

由于子系统的大部分（尤其是显示I/O的功能部分）运行与内核模式下，所以只有少数一部分Windows函数要向Windows子系统发送消息：进程和线程的创建和终止，网络驱动器号，以及临时文件的创建。一般而言，一个正在运行的应用程序不会引起太多至Windows子系统进程的环境切换。