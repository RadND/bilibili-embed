<?php

/**
 * Plugin Name:       Bilibili Embed
 * Description:       Help user embed video iframe from www.bilibili.com.
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           1.1.0
 * Author:            radnd
 * Author URI:        https://mbd.pub/o/radnd
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       bilibili-embed
 *
 * @package           bilibili-embed
 */

/*
Bilibili Embed is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

Bilibili Embed is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Bilibili Embed. If not, see https://www.gnu.org/licenses/.
*/

require_once('bilibili-api.php');

function bilibili_embed_bilibili_video_block_init()
{
	register_block_type(__DIR__ . '/build');
}

add_action('init', 'bilibili_embed_bilibili_video_block_init');
add_action('rest_api_init', function () {
	$github_embed = new Bilibili_Embed_Video_Route();
	$github_embed->register_routes();
});
