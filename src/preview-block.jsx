import {useEffect, useState} from '@wordpress/element';
import {Spinner} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const mapErrorCodeToFriendlyString = (code) => {
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
		response = await apiFetch({ path: `/bilibili-embed/v1/video/${id}`});
	} catch (e) {
		console.error(e);
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
	const videoId = props.attributes.bvid;
	const [videoInfo, setVideoInfo] = useState(null);
	const [loadFailed, setLoadFailed] = useState(false);
	const [busy, setBusy] = useState(true);

	useEffect(() => {
		setBusy(true);
		setLoadFailed(false);
		fetchVideoInfo(videoId).then(data => {
			setVideoInfo(data);
		}).catch(e => {
			console.error(e);
			setLoadFailed(true);
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
		if (loadFailed) {
			content = (<>
				<div>
					<span>获取视频信息失败，请检查视频 AV/BV 号是否正确</span>
				</div>
			</>);
		} else {
			content = (<>
				<div>
					<img alt={'视频封面'}
						 src={`${videoInfo.cover}@336w_190h_!web-video-rcmd-cover`}
						 referrerPolicy={'no-referrer'}/>
				</div>
				<div style={{display: "flex", flexFlow: "column"}}>
					<span style={{fontSize: '1.5rem'}}>{videoInfo.title}</span>
					<span>{`UP 主：${videoInfo.uploader}`}</span>
					<span style={{maxHeight: '7rem'}}>{videoInfo.description}</span>
				</div>
			</>);
		}
	}

	return (<>
		<div style={{display: "flex", flexFlow: 'row', padding: '2rem', borderRadius: '1rem', backgroundColor: '#f8f8f8', alignItems: 'center', gap: '1rem'}}>
			{content}
		</div>
	</>);
}
