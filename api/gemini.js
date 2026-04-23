// 強制 Vercel 更新環境變數 2026-04-23
export default async function handler(req, res) {
    // 確保只接受 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 從 Vercel 的環境變數中讀取金鑰 (外界看不到這裡)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing in server environment' });
    }

    // Google Gemini 的真實 API 網址
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        // 將前端傳來的資料 (req.body)，原封不動轉發給 Google
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        // 將 Google 的回應傳回給前端網頁
        res.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
