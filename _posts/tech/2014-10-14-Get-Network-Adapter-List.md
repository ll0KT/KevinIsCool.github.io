---
layout: post
title: Winpcap系列--获取网络适配器列表
category: tech
---

{{ page.title }}
================
<p class="meta">14 October 2014 - Harbin</p>

文章主要介绍WinPcap的编程以及相关的源码分析，程序的编写用的是纯`C`语言，并且希望读者拥有良好的网络及网络协议的知识。我们已经在第一篇文章中介绍了`VS`下的开发环境配置。前面的几节，首先我们运用`WinPcap`提供的几个`API`，进行一些简单的编程，实现几个基本的、简单的功能。
<br />
##这一节，介绍获取网络适配器列表      
###1. 相关函数描述：
{% highlight C linenos %}
//返回所找到的适配器列表
pacp_findalldevs_ex(char *source,  struct pcap_rmtauth *auth,  pacp_if_t **alldevs,  char *errorbuf) 
//释放设备列表所占用的空间
pacp_freealldevs(pacp_if_t **alldevs)  
{% endhighlight %}

###2. 相关结构体描述：

#####>>>2.1 pcap_if_t
{% highlight C linenos %}
typedef struct pcap_if pcap_if_t;
struct pcap_if {
	struct pcap_if *next;
	/*如果不为NULL，则指向列表的下一个元素。如果为NULL，则为列表的末尾*/
	char *name;
	/*描述设备名称的字符串指针*/
	char *description;
	/*如果不为NULL，则指向描述设备的一个可读字符串*/
	struct pcap_addr *addresses;
	/*一个指向接口地址列表第一个元素的指针*/
	bpf_u_int32 flags;
	/*回环标记*/
};
{% endhighlight %}

#####>>>2.2 pcap_addr_t结构体
{% highlight C linenos %}
typedef pcap_addr pcap_addr_t;
struct pcap_addr {
	struct pcap_addr *next; 	//指向下一个元素的指针
	struct sockaddr *addr; 		//IP地址
	struct sockaddr *netmask; 	//子网掩码
	struct sockaddr *broadaddr; //广播地址
	struct sockaddr *dstaddr; 	//P2P目标地址
};
{% endhighlight %}

###3. 代码：
{% highlight C linenos %}
#define WIN32
#define HAVE_REMOTE

#include <stdio.h>
#include "pcap.h"

main()
{
    pcap_if_t *alldevs;
    pcap_if_t *d;
    int i=0;
    char errbuf[PCAP_ERRBUF_SIZE];
    
    /* 获取本地机器设备列表 */
    if (pcap_findalldevs_ex(PCAP_SRC_IF_STRING, NULL /* auth is not needed */, &alldevs, errbuf) == -1)
    {
        fprintf(stderr,"Error in pcap_findalldevs_ex: %s\n", errbuf);
        exit(1);
    }
	
    /* 打印设备列表 */
    for(d= alldevs; d != NULL; d= d->next)
    {
        printf("%d. %s", ++i, d->name);
        if (d->description)
            printf(" (%s)\n", d->description);
        else
            printf(" (No description available)\n");
    }
    
    /* 如果没有找到设备接口，确认WinPcap已安装，退出 */
    if (i == 0)
    {
        printf("\nNo interfaces found! Make sure WinPcap is installed.\n");
        return;
    }

    /* 不再需要设备列表了，释放它 */
    pcap_freealldevs(alldevs);
}
{% endhighlight %}

###4. 注意：

1.	`pcap_findalldevs_ex`函数和其他函数一样，一旦发生错误，`errbuf`参数将写入错误信息。
2.	不是所有的操作系统都支持`WinPcap`提供的网络接口。因此，如果想编写一个可以移植的应用程序，就必须考虑什么情况下`description`为`NULL`。
3.	当设备使用结束后，需要调用`pcap_freealldevs`函数释放设备列表所占用的资源。
<br />
###5. 以下是获取已安装设备的高级信息：
{% highlight C linenos %}
#define WIN32
#define HAVE_REMOTE

#include <stdio.h>
#include "pcap.h"
#include <winsock.h>
#include <windows.h>

/* 打印给定接口的所有有效信息*/
void ifprint(pcap_if_t *d);
/*把一个数字IP地址转换为一个字符串*/
char *iptos(u_long in);

int main()
{
	pcap_if_t *alldevs;
	pcap_if_t *d;
	char errbuf[PCAP_ERRBUF_SIZE + 1];
	char source[PCAP_ERRBUF_SIZE + 1];

	/*选择要获取设备列表的源*/
	printf("Enter the device you want to list:\n"
		"rpcap://                 ==> lists interfaces in the local machine\n"
		"rpcap://hostname:port ==> lists interfaces in a remote machine\n"
		"                          (rpcapd daemon must be up and running\n"
		"                          and it must accept 'null' authentication)\n"
		"file://foldername     ==> lists all pcap files in the give folder\n\n"
		"Enter your choice: ");

	fgets(source, PCAP_ERRBUF_SIZE, stdin);
	source[PCAP_ERRBUF_SIZE] = '\0';

	/*获取接口列表*/
	if (pcap_findalldevs_ex(source, NULL, &alldevs, errbuf) == -1)
	{
		fprintf(stderr, "Error in pcap_findalldevs: %s\n", errbuf);
		exit(1);
	}

	/*遍历列表，打印出每个条目的信息*/
	for (d = alldevs; d; d = d->next)
	{
		ifprint(d);
	}

	/*释放接口列表*/
	pcap_freealldevs(alldevs);

	system("pause");
	return 1;
}

void ifprint(pcap_if_t *d)
{
	pcap_addr_t *a;
	char ip6str[128];

	/*打印名称(Name)*/
	printf("\tName:%s\n", d->name);

	/*打印描述(Description)*/
	if (d->description)
		printf("\tDescription: %s\n", d->description);

	/*打印环回地址(Loopback Address)*/
	printf("\tLoopback: %s\n",
		(d->flags & PCAP_IF_LOOPBACK) ? "yes" : "no");

	/*打印IP地址(IP addresses)*/
	for (a = d->addresses; a; a = a->next)
	{
		printf("\tAddress Family: #%d\n", a->addr->sa_family);
		if (a->addr->sa_family == AF_INET)
		{
			printf("\tAddress Family Name: AF_INET\n");
			if (a->addr)
				printf("\tAddress: %s\n",
				iptos(((struct sockaddr_in *)a->addr)->sin_addr.s_addr));
			if (a->netmask)
				printf("\tNetmask: %s\n",
				iptos(((struct sockaddr_in *)a->netmask)->sin_addr.s_addr));
			if (a->broadaddr)
				printf("\tBroadcast Address: %s\n",
				iptos(((struct sockaddr_in*)a->broadaddr)->sin_addr.s_addr));
			if (a->dstaddr)
				printf("\tDestination Address: %s\n",
				iptos(((struct sockaddr_in *)a->dstaddr)->sin_addr.s_addr));
		}
		else
		{
			printf("\tAddress Family Name: Unknown\n");
		}
	}
	printf("\n");
}

#define IPTOSBUFFERS	12
char *iptos(u_long in)
{
	static char output[IPTOSBUFFERS][3 * 4 + 3 + 1];
	static short which;
	u_char *p;
	p = (u_char *)&in;
	which = (which + 1 == IPTOSBUFFERS ? 0 : which + 1);
	_snprintf_s(output[which], sizeof(output[which]),
		sizeof(output[which]), "%d.%d.%d.%d",
		p[0], p[1], p[2], p[3]);
	return output[which];
}
{% endhighlight %}
<br />
函数 `pcap_findalldevs_ex()` 除了获取本地适配器信息外，还能返回远程适配器信息和一个位于所给的本地文件夹的`pcap`文件列表。



