<template>
  <div class="p-4 md:p-8 max-w-4xl mx-auto space-y-4 md:space-y-6">
    <div class="border-b border-hairline pb-4"><h1 class="text-xl md:text-2xl text-champagne font-display font-semibold">AI 大脑神经中心</h1><p class="text-xs text-text-faint mt-1 font-mono">配置国内大模型密钥，数据纯前端存储在你的个人浏览器中，绝对安全。</p></div>
    <div class="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-hairline-strong bg-kinpaku/5">
      <span class="text-sm text-kinpaku font-semibold whitespace-nowrap">🧠 设定当前全站默认思维大脑：</span>
      <select v-model="active" @change="save" class="p-2 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none w-full sm:w-auto"><option value="zhipu">智谱 GLM-4-Flash (最推荐·免费)</option><option value="deepseek">DeepSeek-Chat</option><option value="qwen">阿里通义千问-Plus</option><option value="doubao">字节跳动豆包 (Ark)</option><option value="yuanbao">腾讯元宝 (Hunyuan)</option></select>
    </div>
    <div class="space-y-4">
      <div v-for="(name, key) in providerNames" :key="key" class="card p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-center"><span class="text-champagne text-sm font-semibold">{{ name }} API Key</span><input v-model="keys[key]" type="password" placeholder="请输入官方申请的 sk-..." class="md:col-span-2 p-2.5 bg-lacquer border border-hairline rounded-xl text-xs font-mono text-text-warm outline-none focus:border-hairline-strong placeholder:text-text-faint" /></div>
      <div class="card p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-center"><span class="text-patina text-sm font-semibold">豆包专属 Endpoint ID</span><input v-model="keys['doubao_model']" type="text" placeholder="ep-..." class="md:col-span-2 p-2.5 bg-lacquer border border-hairline rounded-xl text-xs font-mono text-text-warm outline-none placeholder:text-text-faint" /></div>
    </div>
    <button @click="save" class="w-full py-3.5 bg-kinpaku/20 text-kinpaku rounded-xl text-sm font-medium hover:bg-kinpaku/30 transition border border-hairline-strong">保存全套配置</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'; import { storage } from '../services/storage';
const keys = ref({}); const active = ref('zhipu');
const providerNames = { zhipu:'智谱清言',deepseek:'DeepSeek',qwen:'通义千问',doubao:'字节豆包',yuanbao:'腾讯元宝' };
onMounted(() => { const c=storage.getAIConfig(); keys.value=c.keys; active.value=c.active; if(!keys.value.zhipu){ keys.value.zhipu='8fcff9314cc0435d9887abacad4d3d81.QwAwgrEnWTnttD4y'; storage.saveAIConfig(keys.value,active.value); } });
const save = () => { storage.saveAIConfig(keys.value,active.value); alert('✨ AI 配置已安全固化至本地！'); };
</script>