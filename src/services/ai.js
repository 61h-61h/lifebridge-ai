const PROVIDERS = {
  deepseek: { name: 'DeepSeek', url: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat' },
  qwen: { name: '通义千问', url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-plus' },
  doubao: { name: '豆包', url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions', model: '' },
  yuanbao: { name: '腾讯元宝', url: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions', model: 'hunyuan-lite' },
  zhipu: { name: '智谱AI', url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4-flash' }
};

export async function askAI({ systemPrompt, userMessage, provider = null }) {
  const { storage } = await import('./storage');
  const config = storage.getAIConfig();
  const activeProvider = provider || config.active;
  const prov = PROVIDERS[activeProvider];
  if (!prov) throw new Error('未知的 AI 供应商');

  const apiKey = config.keys[activeProvider];
  if (!apiKey) throw new Error(`请先在「AI 脑核中心」配置 ${prov.name} 的 API Key`);

  let model = prov.model;
  if (activeProvider === 'doubao') {
    model = config.keys['doubao_model'] || '';
    if (!model) throw new Error('豆包模型需要填写 Endpoint ID');
  }

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 2048
  };

  const res = await fetch(prov.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI 请求失败 (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'AI 未返回有效内容';
}
