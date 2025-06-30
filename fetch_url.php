<?php
if (!isset($_POST['url'])) { http_response_code(400); exit('No URL provided.'); }
$url = $_POST['url'];
$content = @file_get_contents($url);
if ($content === false) { http_response_code(500); exit('Failed to fetch content.'); }
// Optionally, parse or summarize content here
// For now, just return the first 1000 chars as a preview
$preview = mb_substr(strip_tags($content), 0, 1000);
echo nl2br(htmlspecialchars($preview)); 