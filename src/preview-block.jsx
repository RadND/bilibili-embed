import { useEffect, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const mapErrorCodeToFriendlyString = (code) => {
	//from https://github.com/SocialSisterYi/bilibili-API-collect
	switch (code) {
		default:
			return `未知错误码：${code}`;
		case 0:
			return '成功';
		case -400:
			return '请求格式错误';
		case -403:
			return '权限不足';
		case -404:
			return '该视频不存在';
		case 62002:
			return '该视频为私享视频';
		case 62004:
			return '视频仍在审核';
	}
}

const fetchVideoInfo = async (id) => {
	let response;
	try {
		response = await apiFetch({ path: `/bilibili-embed/v1/video/${id}` });
	} catch (e) {
		// 可能是输入的bv号不是10位base58或者后续的网络问题
		// 相比于能用编辑器却连不上博客后端，更有可能是博客后端连不上b站
		throw e
	}

	if (response.data) {
		return {
			title: response.data.title,
			publishDate: new Date(response.data.pubdate * 1000),
			uploader: response.data.owner.name,
			description: response.data.desc_v2[0].raw_text,
			cover: response.data.pic
		};
	} else {
		return {
			title: mapErrorCodeToFriendlyString(response.code),
			publishDate: new Date(0),
			uploader: '',
			description: '',
			cover: ''
		};
	}
};

// TODO: move all inline styles to stylesheets

export default function BilibiliVideoPreviewBlock(props) {
	const videoId = props.bvid;
	const [videoInfo, setVideoInfo] = useState(null);
	const [loadFailedMsg, setloadFailedMsg] = useState(null);
	const [busy, setBusy] = useState(true);

	useEffect(() => {
		setBusy(true);
		setloadFailedMsg(null);
		fetchVideoInfo(videoId).then(data => {
			setVideoInfo(data);
		}).catch(e => {
			// console.error(e);
			setloadFailedMsg(`${e.message}`);
		}).finally(() => {
			setBusy(false);
		});
	}, [videoId])

	let content;
	if (busy) {
		content = (
			<div>
				<Spinner />
				<span>
					{'正在获取视频数据...'}
				</span>
			</div>
		);
	} else {
		if (loadFailedMsg) {
			content = (<>
				<div>
					<span>{loadFailedMsg}</span>
				</div>
			</>);
		} else {
			content = (<>
				<div style={{ width: "36%", display: 'flex', flexFlow: 'column', justifyContent: "space-between" }}>
					<img alt={'视频封面'}
						src={`${videoInfo.cover}@336w_190h_!web-video-rcmd-cover`}
						referrerPolicy={'no-referrer'}
					/>
					{/* <img
						src={`${videoInfo.face}@96w_96h_1c_1s.webp`}
						referrerPolicy={'no-referrer'}
					></img> */}
					<span className='desc-owner'>{`UP 主：${videoInfo.uploader}`}</span>
				</div>
				<div style={{ width: "0%", flexGrow: 1, display: "flex", flexFlow: "column" }}>
					<span className="desc-video-title">{videoInfo.title}</span>
					<span className="desc-video-info" >{videoInfo.description}</span>
				</div>
			</>);
		}
	}

	return (<>
		<div className='preview-block'  >
			{content}
		</div>
	</>);
}
