<?php if ($is_logged_in): ?>
<div class="mb-12 p-6 bg-gradient-to-r from-blue-100 to-green-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg">
    <h2 class="text-2xl font-bold mb-4 flex items-center"><i class="fas fa-cloud-download-alt mr-2 text-blue-500"></i> Fetch Content from URL</h2>
    <form id="fetch-url-form" class="flex flex-col md:flex-row gap-4 items-center">
        <input type="url" id="fetch-url-input" name="url" class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none" placeholder="Enter content URL..." required>
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">Fetch</button>
    </form>
    <div id="fetch-url-result" class="mt-4 text-sm"></div>
</div>
<script>
document.getElementById('fetch-url-form').onsubmit = async function(e) {
    e.preventDefault();
    const url = document.getElementById('fetch-url-input').value;
    document.getElementById('fetch-url-result').innerHTML = 'Fetching...';
    const res = await fetch('fetch_url.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'url=' + encodeURIComponent(url) });
    const data = await res.text();
    document.getElementById('fetch-url-result').innerHTML = data;
};
</script>
<!-- ... inside Content Management area ... -->
<!-- Example question/answer list -->
<div class="mt-8">
    <h3 class="text-xl font-bold mb-4">Questions</h3>
    <div class="space-y-4">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div class="font-semibold mb-2">Q: What is photosynthesis?</div>
            <div class="mb-2">A: Photosynthesis is the process by which green plants convert sunlight into energy.</div>
            <button class="enhance-ai-btn bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded-lg font-semibold" data-answer="Photosynthesis is the process by which green plants convert sunlight into energy.">Enhance with AI</button>
            <div class="ai-enhanced-answer mt-2 text-green-700 dark:text-green-300"></div>
        </div>
        <!-- Repeat for more questions -->
    </div>
</div>
<script>
document.querySelectorAll('.enhance-ai-btn').forEach(btn => {
    btn.onclick = async function() {
        const answer = btn.getAttribute('data-answer');
        const resultDiv = btn.nextElementSibling;
        resultDiv.innerHTML = 'Enhancing...';
        const res = await fetch('ai_enhance.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'text=' + encodeURIComponent(answer) });
        const data = await res.text();
        resultDiv.innerHTML = data;
    };
});
</script>
<?php endif; ?> 