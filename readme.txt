=== Video Embed for Bilibili ===
Contributors:      The WordPress Contributors
Tags:              block,bilibili
Tested up to:      6.2
Stable tag:        1.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Add a block to help user insert bilibili.com video (an iframe HTML element) to their article.

== Description ==

Add a block to help user insert bilibili.com video (an iframe HTML element) to their article.

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/video-embed-for-bilibili` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


== Frequently Asked Questions ==

= 除了截图里的这些参数，是否还有其他可以设置的参数？ =

我找到和试出来的有用的参数就是这么多，av号因为在嵌入视频这个场景下没有优势，因此没有支持，如果想知道是否还有更多可以设置的参数，应该要分析 player.bilibili.com 的 js 文件。
而且我想大家都没见过的参数恐怕是因为几乎没人用才没人知道，如果真的有用户需要设置额外的平常用不到的参数这种功能，额，那他肯定是个程序员了，反正代码都给了，自己加嘛。

= 自动播放没有效果 =

浏览器的自动播放的优先级是最高的，浏览器自动播放没有开的话，只会重复播放当前弹幕，像是卡死了一样。

= 我想要插入其他视频网站的视频，这个区块能办得到吗？ =

不能

= 为什么？ =

这个区块是专门为了 player.bilibili.com 的播放器设计的，只有它能接收上面这些参数。
如果你在寻找一个普适的又不需要自己拼接代码就能嵌入 iframe 视频的办法，[wordpress.org](https://cn.wordpress.org) 的插件目录里有能做这种事情的插件，可以自己去搜一下，这里不放链接了。

特别地，对于一些著名的外国视频网站，比如油管，它们不需要装插件也可以在文章里嵌入视频的原因是它们<del>商量好了</del>支持一个叫做 [oembed 协议](https://oembed.com) 的东西。
如果为b站编写一个 oembed 的中间层，理论上不需要再装插件，而且除显示视频以外还能显示动态页和用户页，但我从没见过有人有这种需求。

= 如果我不想再用这个插件，把它卸载了，会发生什么事？ =

你的网站看起来不会有问题。
在这个插件没有加载的情况下，编辑文章的时候没有办法编辑这个区块，只可以单向转换成自定义 html 区块，具体内容则是程序拼好的 iframe，在预览/发布的时候则会显示最后一次正常加载的样子（也就是自定义 html 区块的样子）。
其实所有的静态区块应该都是这样。

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 1.1.0 =
* Release

== Arbitrary section ==

打包后的插件并不包含对应古腾堡区块的源代码，你可以在 [Github 上的仓库](https://github.com/radnd/bilibili-embed) 中获取它们

你可以在[面包多](https://mbd.pub/o/radnd) 通过购买我的作品等方式支持我——那里是我发布插件的地方，对于不能够或不愿意访问 Github 的人，也可以在这里获取插件稳定版本的源代码。
