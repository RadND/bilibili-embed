/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, ColorPalette, InspectorControls } from '@wordpress/block-editor';
// 该元素最终会和 textcontrol 合并，所以这么起名 https://developer.wordpress.org/block-editor/reference-guides/components/input-control/#ispressentertochange
import { __experimentalInputControl as TextControl } from '@wordpress/components'
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { ToggleControl } from '@wordpress/components'
import { Panel, PanelBody, PanelRow } from '@wordpress/components';
// import { more } from '@wordpress/icons';
import BilibiliVideoPreviewBlock from "./preview-block";


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';


const onChangeBGColor = (hexColor) => {
	setAttributes({ bg_color: hexColor });
};

const onChangeTextColor = (hexColor) => {
	setAttributes({ text_color: hexColor });
};


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {

	const { attributes, setAttributes } = props
	const onChangeAvid = (avid) => {

	}
	const onChangeBvid = (bvid) => {
		setAttributes({ bvid });
	}

	return (
		<div {...useBlockProps()}>
			<InspectorControls key="setting">
				<PanelBody title={__('iframe 基础参数', 'video-embed-for-bilibili')} initialOpen={true}>
					<PanelRow>
						<TextControl
							label="bv号"
							value={attributes.bvid}
							onChange={onChangeBvid}
							isPressEnterToChange={true}
						/>
					</PanelRow>
					{/* <PanelRow>
							 <TextControl
								 label="av号"
								 value={attributes.avid}
								 onChange={onChangeAvid}
							 />
						 </PanelRow> */}
					<PanelRow>
						<ToggleControl
							label="清晰度"
							help={
								attributes.high_quality
									? '尽量高'
									: '尽量低'
							}
							checked={attributes.high_quality}
							onChange={(high_quality) => {
								setAttributes({ high_quality });
							}}
						/>
					</PanelRow>
					<PanelRow>
						<NumberControl
							label="指定分p"
							value={attributes.page}
							min={1}
							onChange={(page, extra) => {
								if (extra.event.target?.validity.valid) {
									setAttributes({ page });
								}
							}}
						/>
					</PanelRow>
					<PanelRow>
						<fieldset style={{ display: "flex", justifyContent: "space-between" }}>
							<legend
								// className="blocks-base-control__label"
							>
								{__('播放器宽高比', 'video-embed-for-bilibili')}
							</legend>
							<NumberControl
								className="video-embed-for-bilibili-iframe-size-control__width"
								label="宽度权重"
								value={attributes.width_wt}
								onChange={(width_wt) => {
									setAttributes({ width_wt });
								}}
								isPressEnterToChange={true}
							/>
							<NumberControl
								className="video-embed-for-bilibili-iframe-size-control__height"
								label="高度权重"
								value={attributes.height_wt}
								onChange={(height_wt) => {
									setAttributes({ height_wt });
								}}
								isPressEnterToChange={true}
							/>
						</fieldset>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="弹幕"
							help={
								attributes.danmakuEnable
									? '初始为开启'
									: '初始为关闭'
							}
							checked={attributes.danmakuEnable}
							onChange={(danmakuEnable) => {
								setAttributes({ danmakuEnable });
							}}
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label="空降"
							help={
								"会导致强制自动播放"
							}
							checked={attributes.t > 0}
							onChange={(checked) => {
								setAttributes({ t: checked ? 1 : 0 });
							}}
						/>
					</PanelRow>
					{attributes.t > 0 && <PanelRow>
						<TextControl
							label="空降坐标（秒）"
							value={attributes.t}
							onChange={(t) => {
								setAttributes({ t: parseInt(t) });
							}}
							isPressEnterToChange={true}
						/>
					</PanelRow>}
					{attributes.t === 0 && <PanelRow>
						<ToggleControl
							label="自动播放"
							checked={attributes.autoplay}
							onChange={(autoplay) => {
								setAttributes({ autoplay });
							}}
						/>
					</PanelRow>}
					<PanelRow>
						<ToggleControl
							label="宽屏"
							checked={attributes.as_wide}
							onChange={(as_wide) => {
								setAttributes({ as_wide });
							}}
						/>
					</PanelRow>
				</PanelBody>

			</InspectorControls>

			<BilibiliVideoPreviewBlock bvid={attributes.bvid} />
		</div>
	);


}
