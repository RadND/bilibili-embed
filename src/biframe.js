const calcIframeSrc = (attributes) => {
	const searchParams = new URLSearchParams()
	// searchParams.append("aid", attributes.avid)
	searchParams.append("bvid", attributes.bvid)
	searchParams.append("high_quality", attributes.high_quality ? 1 : 0)
	searchParams.append("page", attributes.page)
	searchParams.append("danmaku", attributes.danmakuEnable ? 1 : 0)
	// https://www.bilibili.com/read/cv7923601/ cid 是弹幕文件或者说某个具体分p的id，好像不一定需要 对于示例的rickroll文件， &cid=805766551
	searchParams.append("t", attributes.t)
	searchParams.append("autoplay", attributes.autoplay ? 1 : 0)
	searchParams.append("as_wide", attributes.as_wide ? 1 : 0)
	// searchParams.append("b", 0) //不知道为什么控制台里播放器一直因为没提供这个参数报错，随便给一个

	let iurl = new URL(`${window.location.protocol}//player.bilibili.com/player.html?${searchParams}`)
	//必须要加 tostring 不知道为啥，可能是序列化的时候不知道怎么处理 URL 类型了。不加的时候生成的前端iframe直接没有src这个属性，估计是被不知道哪一步（webpack？）给忽略了，但是我没有看到报错
	return iurl.toString()
}

export default function Biframe(props) {
	return (
		<div style={{ position: "relative", paddingBottom: `${100 * props.attributes.height_wt / props.attributes.width_wt}%` }} width="100%" height="0">
			<iframe src={calcIframeSrc(props.attributes)} style={{ position: "absolute", left: 0, top: 0 }} scrolling="no" border="0" frameBorder="no" framespacing="0" allowFullScreen={true} width="100%" height="100%" ></iframe>
		</div>
		// sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"

	)
}