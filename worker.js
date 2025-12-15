export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 处理 POST 请求
    if (request.method === "POST") {
      return handleRequest(request);
    }

    // 处理 GET 请求
    return handleHtml(request);
  }
};

async function handleRequest(request) {
  try {
    const { token, chatId, text } = await request.json();

    if (!token || !chatId) {
      return new Response(JSON.stringify({ ok: false, description: "Missing Token or Chat ID" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const tgApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(tgApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text || "Hello world",
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ ok: false, description: e.message }), {
        headers: { "Content-Type": "application/json" }
    });
  }
}

function handleHtml(request) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Telegram Chat ID Tool</title>
  <style>
    :root { --primary: #2481cc; --bg: #f5f5f5; --card: #ffffff; --text: #333; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); display: flex; justify-content: center; padding-top: 40px; margin: 0; }
    .container { background: var(--card); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); width: 90%; max-width: 450px; position: relative; }
    
    /* 语言选择器 */
    .lang-switch { position: absolute; top: 15px; right: 15px; }
    select { padding: 5px; border-radius: 4px; border: 1px solid #ddd; font-size: 0.85rem; cursor: pointer; background: #fff; }

    h2 { margin-top: 0; text-align: center; color: var(--primary); margin-bottom: 25px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.9rem; color: #555; }
    input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 1rem; transition: border 0.2s; }
    input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 2px rgba(36, 129, 204, 0.1); }
    
    button.submit { width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; font-weight: bold; margin-top: 10px; transition: opacity 0.2s; }
    button.submit:hover { opacity: 0.9; }
    button.submit:disabled { background: #ccc; cursor: not-allowed; }

    /* 结果显示区域 */
    #result-area { margin-top: 25px; border-top: 1px dashed #ddd; padding-top: 20px; display: none; animation: fadeIn 0.3s ease; }
    .result-item { background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #eee; }
    .result-label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
    .result-value { font-family: 'Monaco', 'Consolas', monospace; font-size: 1.1rem; font-weight: bold; color: #222; }
    
    .copy-btn { background: white; border: 1px solid #ddd; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; color: var(--primary); font-weight: 600; transition: all 0.2s; }
    .copy-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }

    .meta-info { font-size: 0.85rem; color: #666; margin-top: 10px; text-align: center; }
    .error-msg { color: #d32f2f; background: #ffebee; padding: 12px; border-radius: 8px; display: none; font-size: 0.9rem; margin-top: 15px; border: 1px solid #ffcdd2; line-height: 1.4; }
    
    .raw-json-toggle { text-align: center; margin-top: 15px; font-size: 0.8rem; color: #999; cursor: pointer; text-decoration: underline; }
    pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; display: none; margin-top: 10px; text-align: left; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="lang-switch">
      <select id="language" onchange="changeLanguage(this.value)">
        <option value="zh-CN">简体中文</option>
        <option value="zh-TW">繁體中文</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </div>

    <h2 data-i18n="title">TG Chat ID 获取器</h2>
    
    <div class="form-group">
      <label data-i18n="label_token">Bot Token</label>
      <input type="text" id="token" data-placeholder="ph_token">
    </div>

    <div class="form-group">
      <label data-i18n="label_chatid">Chat ID 或 Username</label>
      <input type="text" id="chatId" data-placeholder="ph_chatid">
    </div>

    <div class="form-group">
      <label data-i18n="label_text">发送测试文本 (可选)</label>
      <input type="text" id="text" value="Hello world">
    </div>

    <button class="submit" onclick="fetchId()" id="btn" data-i18n="btn_submit">发送并获取 ID</button>
    
    <div id="error" class="error-msg"></div>

    <div id="result-area">
      <div class="result-item">
        <div>
          <span class="result-label" data-i18n="res_id_label">Chat ID (数字)</span>
          <span class="result-value" id="res-id"></span>
        </div>
        <button class="copy-btn" onclick="copyText('res-id')" data-i18n="btn_copy">复制</button>
      </div>

      <div class="result-item" id="user-box" style="display:none;">
        <div>
          <span class="result-label" data-i18n="res_user_label">Username</span>
          <span class="result-value" id="res-user"></span>
        </div>
        <button class="copy-btn" onclick="copyText('res-user')" data-i18n="btn_copy">复制</button>
      </div>
      
      <div class="meta-info">
        <span data-i18n="res_type">类型</span>: <strong id="res-type-val"></strong> 
        | 
        <span data-i18n="res_title">标题</span>: <strong id="res-title-val"></strong>
      </div>

      <div class="raw-json-toggle" onclick="toggleJson()" data-i18n="link_json">查看原始 JSON</div>
      <pre id="json-box"></pre>
    </div>
  </div>

  <script>
    // --- 多语言配置字典 ---
    const i18n = {
      "zh-CN": {
        title: "TG Chat ID 获取工具",
        label_token: "Bot Token",
        ph_token: "例如 123456:ABC-DEF...",
        label_chatid: "Chat ID 或 @用户名",
        ph_chatid: "例如 @channel_name 或 -100xxxx",
        label_text: "发送测试文本 (可选)",
        btn_submit: "发送并获取 ID",
        btn_loading: "请求中...",
        res_id_label: "Chat ID (纯数字)",
        res_user_label: "Username",
        btn_copy: "复制",
        res_type: "类型",
        res_title: "标题/名称",
        link_json: "查看原始 JSON 响应",
        err_input: "请填写 Token 和 Chat ID",
        alert_copied: "已复制: ",
        err_chat_not_found: "未找到该目标，请核对 Chat ID / 用户名是否正确（或 Bot 未加入该频道）。",
        err_token_invalid: "Bot Token 无效，请检查是否输入正确。"
      },
      "zh-TW": {
        title: "TG Chat ID 查詢工具",
        label_token: "機器人 Token",
        ph_token: "例如 123456:ABC-DEF...",
        label_chatid: "Chat ID 或 @用戶名",
        ph_chatid: "例如 @channel_name 或 -100xxxx",
        label_text: "測試訊息 (可選)",
        btn_submit: "發送並獲取 ID",
        btn_loading: "請求中...",
        res_id_label: "Chat ID (純數字)",
        res_user_label: "Username",
        btn_copy: "複製",
        res_type: "類型",
        res_title: "標題/名稱",
        link_json: "查看原始 JSON",
        err_input: "請填寫 Token 和 Chat ID",
        alert_copied: "已複製: ",
        err_chat_not_found: "未找到該目標，請核對 Chat ID / 用戶名是否正確（或 Bot 未加入該頻道）。",
        err_token_invalid: "Bot Token 無效，請檢查是否輸入正確。"
      },
      "en": {
        title: "Get Telegram Chat ID",
        label_token: "Bot Token",
        ph_token: "e.g., 123456:ABC-DEF...",
        label_chatid: "Chat ID or @Username",
        ph_chatid: "e.g., @channel_name or -100xxxx",
        label_text: "Message Text (Optional)",
        btn_submit: "Send & Get ID",
        btn_loading: "Sending...",
        res_id_label: "Numeric Chat ID",
        res_user_label: "Username",
        btn_copy: "Copy",
        res_type: "Type",
        res_title: "Title/Name",
        link_json: "View Raw JSON",
        err_input: "Please enter Token and Chat ID",
        alert_copied: "Copied: ",
        err_chat_not_found: "Chat not found. Please check the Chat ID / Username (or ensure Bot has joined).",
        err_token_invalid: "Invalid Bot Token. Please check your input."
      },
      "ja": {
        title: "Telegram Chat ID 取得ツール",
        label_token: "ボットトークン (Bot Token)",
        ph_token: "例: 123456:ABC-DEF...",
        label_chatid: "チャットID または @ユーザー名",
        ph_chatid: "例: @channel_name または -100xxxx",
        label_text: "送信テキスト (任意)",
        btn_submit: "送信してIDを取得",
        btn_loading: "送信中...",
        res_id_label: "チャットID (数字)",
        res_user_label: "ユーザー名",
        btn_copy: "コピー",
        res_type: "タイプ",
        res_title: "タイトル/名前",
        link_json: "生のJSONを表示",
        err_input: "TokenとChat IDを入力してください",
        alert_copied: "コピーしました: ",
        err_chat_not_found: "チャットが見つかりません。Chat ID / ユーザー名を確認してください。",
        err_token_invalid: "Bot Tokenが無効です。入力を確認してください。"
      }
    };

    let currentLang = "zh-CN";

    window.onload = function() {
      const savedLang = localStorage.getItem('tg_tool_lang');
      if (savedLang && i18n[savedLang]) {
        currentLang = savedLang;
      }
      document.getElementById('language').value = currentLang;
      updateUIText();
    };

    function changeLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('tg_tool_lang', lang);
      updateUIText();
    }

    function updateUIText() {
      const t = i18n[currentLang];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
      });
      document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        if (t[key]) el.setAttribute('placeholder', t[key]);
      });
      const btn = document.getElementById('btn');
      if (!btn.disabled) btn.innerText = t['btn_submit'];
    }

    async function fetchId() {
      const t = i18n[currentLang];
      const btn = document.getElementById('btn');
      const errorBox = document.getElementById('error');
      const resultArea = document.getElementById('result-area');
      const token = document.getElementById('token').value.trim();
      const chatId = document.getElementById('chatId').value.trim();
      const text = document.getElementById('text').value;

      if (!token || !chatId) {
        errorBox.innerText = t['err_input'];
        errorBox.style.display = 'block';
        return;
      }
      
      errorBox.style.display = 'none';
      resultArea.style.display = 'none';
      btn.innerText = t['btn_loading'];
      btn.disabled = true;

      try {
        const req = await fetch(window.location.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, chatId, text })
        });
        
        const data = await req.json();

        if (data.ok) {
          const chat = data.result.chat;
          
          document.getElementById('res-id').innerText = chat.id;
          
          if(chat.username) {
             document.getElementById('res-user').innerText = '@' + chat.username;
             document.getElementById('user-box').style.display = 'flex';
          } else {
             document.getElementById('user-box').style.display = 'none';
          }

          document.getElementById('res-type-val').innerText = chat.type;
          document.getElementById('res-title-val').innerText = chat.title || chat.first_name || 'N/A';
          document.getElementById('json-box').innerText = JSON.stringify(data, null, 2);
          
          resultArea.style.display = 'block';
        } else {
          // --- 错误处理增强逻辑 ---
          let errorDescription = data.description || 'Unknown error';
          
          // 检查是否为 "chat not found" 错误
          if (errorDescription.includes('chat not found')) {
             errorDescription = t['err_chat_not_found'];
          } 
          // 检查是否为 Token 错误 (Unauthorized)
          else if (errorDescription.includes('Unauthorized')) {
             errorDescription = t['err_token_invalid'];
          }

          errorBox.innerText = errorDescription;
          errorBox.style.display = 'block';
        }

      } catch (err) {
        errorBox.innerText = 'Network Error: ' + err.message;
        errorBox.style.display = 'block';
      } finally {
        btn.innerText = t['btn_submit'];
        btn.disabled = false;
      }
    }

    function copyText(elementId) {
      const text = document.getElementById(elementId).innerText;
      const t = i18n[currentLang];
      navigator.clipboard.writeText(text).then(() => {
        alert(t['alert_copied'] + text);
      }).catch(err => {
        console.error('Copy failed', err);
      });
    }

    function toggleJson() {
        const box = document.getElementById('json-box');
        box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
    }
  </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
