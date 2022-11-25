<?php
class Bilibili_Embed_Video_Route extends WP_REST_Controller
{
	public function register_routes()
	{
		$version = '1';
		$namespace = 'bilibili-embed/v' . $version;
		$base = 'video';

		// register_rest_route($namespace, '/' . $base, array(
		// 	array(
		// 		'methods'             => WP_REST_Server::READABLE,
		// 		'callback'            => array($this, 'get_items'),
		// 		'permission_callback' => array($this, 'get_items_permissions_check'),
		// 		'args'                => array(),
		// 	),
		// 	array(
		// 		'methods'             => WP_REST_Server::CREATABLE,
		// 		'callback'            => array($this, 'create_item'),
		// 		'permission_callback' => array($this, 'create_item_permissions_check'),
		// 		'args'                => $this->get_endpoint_args_for_item_schema(true),
		// 	),
		// ));
		// bv号是一种特殊的base58
		register_rest_route($namespace, '/' . $base . '/(?P<bvid>BV[A-HJ-NP-Za-km-z1-9]{10})', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array($this, 'my_awesome_func'),
				'permission_callback' => '__return_true',
				'args'                => array(
					'bvid' => array(
						'validate_callback' => function ($param, $request, $key) {
							// return is_numeric($param);
							//路由已经做了校验,不符合会直接返回404
							return true;
						}
					),
				),
			)
		));
		// register_rest_route($namespace, '/' . $base . '/(?P<id>[\d]+)', array(
		// 	array(
		// 		'methods'             => WP_REST_Server::READABLE,
		// 		'callback'            => array($this, 'get_item'),
		// 		'permission_callback' => array($this, 'get_item_permissions_check'),
		// 		'args'                => array(
		// 			'context' => array(
		// 				'default' => 'view',
		// 			),
		// 		),
		// 	),
		// 	array(
		// 		'methods'             => WP_REST_Server::EDITABLE,
		// 		'callback'            => array($this, 'update_item'),
		// 		'permission_callback' => array($this, 'update_item_permissions_check'),
		// 		'args'                => $this->get_endpoint_args_for_item_schema(false),
		// 	),
		// 	array(
		// 		'methods'             => WP_REST_Server::DELETABLE,
		// 		'callback'            => array($this, 'delete_item'),
		// 		'permission_callback' => array($this, 'delete_item_permissions_check'),
		// 		'args'                => array(
		// 			'force' => array(
		// 				'default' => false,
		// 			),
		// 		),
		// 	),
		// ));
		// register_rest_route($namespace, '/' . $base . '/schema', array(
		// 	'methods'  => WP_REST_Server::READABLE,
		// 	'callback' => array($this, 'get_public_item_schema'),
		// ));

		//可以新开一个controller，但是我懒

		register_rest_route($namespace, '/' . 'image' . '/(?P<image_name>.+\..+)', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array($this, 'get_image'),
				'permission_callback' => '__return_true',
				'args'                => array(
					'image_url' => array(
						'validate_callback' => function ($param, $request, $key) {
							//传过来的url被js调用过encodeURIComponent()，懒得找正则表达式了，写在验证函数里
							$image_url = rawurldecode($param);
							if (!preg_match("/\b(?:(?:https?):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i", $image_url)) {
								$websiteErr = "非法的 URL 的地址";
								return false;
							}
							if (false) {
								//理论上还应该检查图片链接是不是属于 *.hdslb.com，但是我懒
								return false;
							}
							return true;
						},
						'required' => true
					),
					'image_name' => array('required' => false)
				),
			)
		));
	}

	/**
	 * 使用bilibili的api获取视频信息
	 *
	 * @param array $data Options for the function.
	 * @return string|null Post title for the latest, or null if none.
	 */
	function my_awesome_func($data)
	{
		// $posts = get_posts(array(
		// 	'author' => $data['id'],
		// ));

		// if (empty($posts)) {
		// 	return new WP_Error('no_author', 'Invalid author', array('status' => 404));
		// }

		$bilibili_response = wp_remote_get(
			'https://api.bilibili.com/x/web-interface/view',
			array(
				'timeout' => 10.0,
				'headers' => array('bvid' => $data['bvid']),
			)
		);
		$bilibili_body =  wp_remote_retrieve_body($bilibili_response);
		$video_info = json_decode($bilibili_body);

		return $video_info;
	}

	/**
	 * 从 bilibili 的图片 CDN 获取各种图片
	 *
	 * @param array $data Options for the function.
	 * @return string|null Post title for the latest, or null if none.
	 */
	function get_image($data)
	{
		return "";
		$image_url = rawurldecode($data['image_url']);


		$bilibili_response = wp_remote_get(
			$image_url,
			array(
				'timeout' => 15.0,
				'headers' => array('Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'),
			)
		);
		// return $bilibili_response;
		$bilibili_code    =  wp_remote_retrieve_response_code($bilibili_response);
		$bilibili_message =  wp_remote_retrieve_response_message($bilibili_response);
		$bilibili_headers =  wp_remote_retrieve_headers($bilibili_response);
		$bilibili_body    =  wp_remote_retrieve_body($bilibili_response);

		// header('Content-type:' . $bilibili_headers["content-type"]);
		// echo $bilibili_body;
		// return;
		$response = new WP_REST_Response(
			array(
				'status' => $bilibili_code,
				'response' => $bilibili_message,
				'body_response' => $bilibili_body,
			)
		);
		// $response->header("content-type", $bilibili_headers["content-type"]);
		// $response->header("content-length", $bilibili_headers["content-length"]);
		// $response->header("o-height", $bilibili_headers["o-height"]);
		// $response->header("o-width", $bilibili_headers["o-width"]);
		// $response->header("content-md5", $bilibili_headers["content-md5"]);
		// $response->set_data($bilibili_body);
		// return $bilibili_headers["content-type"];
		return $response;
	}
}
