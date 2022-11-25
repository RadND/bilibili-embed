import { Spinner } from '@wordpress/components';

import apiFetch from '@wordpress/api-fetch';
// acquire?retrieve?
const obtainVideoInfo = (bvid) => {
	// , { referrer: "https://bilibili.com/", referrerPolicy: "origin-when-cross-origin", mode: "cors" }
	return apiFetch({ path: `/bilibili-embed/v1/video/${bvid}` }).then(
		(response) => {
			// return response.json()
			return response
		}
	).then(
		(json) => {
			if (json.data) {
				return json.data;
			}
		},
		(err) => { console.error(err); }
	)

};

import { select } from '@wordpress/data';
// import { select } from '@wordpress/core-data';
const convertOwnerFaceURL = (faceURLStr) => {
	// const faceURL = new URL(faceURLStr)
	const searchParams = new URLSearchParams()
	searchParams.append("image_url", encodeURIComponent(`${faceURLStr}@96w_96h_1c_1s.webp`))
	const wpurl = new URL(`${select('core').getSite().url}/wp-json/bilibili-embed/v1/image/face.jpg?${searchParams}`)
	return wpurl.toString()


}


export default class Bipreview extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			videoInfo: null,
			lastBvid: null
		};

	}
	componentDidUpdate() {
		const bvid = this.props.attributes.bvid;
		const lastBvid = this.state.lastBvid;
		if (bvid !== lastBvid) {
			// 在props.attributes.bvid发生改变时重新fetch获取videoinfo
			obtainVideoInfo(bvid).then((videoInfo) => this.setState({ videoInfo }))
			this.setState({ lastBvid: bvid, videoInfo: null })
		}
	}
	render() {
		const props = this.props;
		const { attributes } = props;
		const videoInfo = this.state.videoInfo;
		// let vpic;
		// if (videoInfo) {
		// 	vpic = new URL(videoInfo.pic)
		// 	vpic = `https://${vpic.hostname}${vpic.pathname}@336w_190h_!web-video-rcmd-cover`
		// https://i1.hdslb.com/bfs/archive/a4b78cae04f43cc31972de1b97d844ccb64978a2.jpg@336w_190h_!web-video-rcmd-cover
		// }

		return (
			<div style={{ position: "relative", paddingBottom: `${100 * attributes.height_wt / attributes.width_wt}%`, width: "100%", height: "0" }}>
				{
					videoInfo ? <div style={{ position: "absolute", width: "100%", height: "100%", overflowY: 'auto' }}>
						<div className="desc-video">
							<div className="desc-video-title">{videoInfo.title}</div>
							<figure className="desc-video-cover">
								<img src={`${videoInfo.pic}@336w_190h_!web-video-rcmd-cover`} width="60%" referrerPolicy="no-referrer" />
								<figcaption>视频封面</figcaption>
							</figure>
							<hr />
							<div className="desc-video-info">
								{videoInfo.desc_v2[0].raw_text}
							</div>
						</div>
						<figure className="desc-owner-face">
							<img alt={videoInfo.owner.name} src={`${videoInfo.owner.face}@96w_96h_1c_1s.webp`} referrerPolicy="no-referrer" />
							<figcaption>UP主 {videoInfo.owner.name} 的头像</figcaption>
						</figure>
					</div> :
						<div>
							<Spinner />
							{"预览数据加载中"}
						</div>
				}

			</div>
		)
	}

}