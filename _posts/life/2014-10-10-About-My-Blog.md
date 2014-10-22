---
layout: post
title: 第一个故事 Jekyll+Github Page博客搭建
category: life
---

{{ page.title }}
================
<p class="meta">10 October 2014 - Harbin</p>

刚找完工作，才有时间空下来整理一下一直想弄的博客。

看到阿里云的`ECS`主机可以免费用半年，就申请了一个（Ubuntu 14.04 LTS），打算试试，但是之后才发现这个是没有外网`IP`的,于是乎又买了一个月的1M的带宽准备体验一下，安装了Wordpress，一切到目前都还正常，后来发现阿里云主机只有`root`账户，不能使用FTP登陆，折腾了网上很多方法，终于找到了解决方法了，改了改主题，配置了一下，博客似乎已经搭建起来了。

买了一个域名，配置了一下，好像能用，然后就又进入了另外一个漩涡：备案！

不得不说，备案过程真是有点麻烦啊：填资料、上传证件照片、打印扫描上传核验单……。过了一两天吧，收到电话通知说已经提交到省通信管理局审核了，说在这个过程中，不能访问网站。结果我理解的意思是不要访问网站就好了，结果原来配置的网站都没有动（通过域名也能访问），结果，管局来了句-未开通先使用，很多就白折腾了。第二次提交，得把核验单寄过去，过了5天寄到了（拖了2天才寄），现在又继续等省管局的消息了，所以结论就是，现在备案还没有下来，也不知道何时能下来，据说是20个工作日（不觉得有点长么，效率这么低？还是的处理很多事情？）。

后来，看到了一个博客：[hack0nair](https://hack0nair.me/archive/)--哇，好简约哈，正合我意呀，so，下一波折腾又开始了。

下面简单的说一下Jekyll + Github Pages搭建博客的吧，不想特别详细的说了，因为网上类似的文章已经很多了，参考一下不是很难（但是是对于一个有相关知识的同学，对于没有相关概念的，那就得先学习一下了）。
参考的博客如下：

1. [Jekyll 简单的静态博客网站](http://jekyllcn.com/)
2. [使用Github Pages建独立博客](http://beiyuu.com/github-pages/)
3. [搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)
4. [使用 GitHub, Jekyll 打造自己的免费独立博客](http://blog.csdn.net/on_1y/article/details/19259435)


关于网站的模板。我用的是：[Tom Preston-Werner](http://tom.preston-werner.com/)源代码：[github.com](https://github.com/mojombo/mojombo.github.io)。做了很多改动，就成我做的样子了。

搞定博客，接下来就是写写文章了。







