<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <div class="border-b pb-4">
      <h1 class="text-2xl font-black text-slate-800">AI 大脑神经中心</h1>
      <p class="text-xs text-slate-400 mt-1">配置国内大模型密钥，数据纯前端存储在你的个人浏览器中，绝对安全。</p>
    </div>

    <div class="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
      <span class="text-sm font-semibold text-indigo-900">🧠 设定当前全站默认思维大脑：</span>
      <select v-model="active" @change="save" class="p-2 border rounded-xl bg-white outline-none text-sm font-medium">
        <option value="zhipu">智谱 GLM-4-Flash (最推荐・免费)</option>
        <option value="deepseek">DeepSeek-Chat</option>
        <option value="qwen">阿里通义千问-Plus</option>
        <option value="doubao">字节跳动豆包 (Ark)</option>
        <option value="yuanbao">腾讯元宝 (Hunyuan)</option>
      </select>
    </div>

    <div class="space-y-4">
      <div v-for="(name, key) in providerNames" :key="key" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <span class="font-bold text-slate-700 text-sm">{{ name }} API Key</span>
        <input v-model="keys[key]" type="password" placeholder="请输入官方申请的 sk-..." class="md:col-span-2 p-2.5 border rounded-xl text-xs font-mono outline-none focus:ring-1 focus:ring-slate-300" />
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <span class="font-bold text-green-600 text-sm">豆包专属 Endpoint ID</span>
        <input v-model="keys['doubao_model']" type="text" placeholder="ep-..." class="md:col-span-2 p-2.5 border rounded-xl text-xs font-mono outline-none" />
      </div>
    </div>

    <button @click="save" class="w-full py-3.5 bg-slate-900 text-white rounded-xl text-sm font-medium shadow-lg hover:bg-slate-800 transition">保存全套配置</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storage } from '../services/storage';

const keys = ref({});
const active = ref('zhipu');

const providerNames = {
  zhipu: '智谱清言',
  deepseek: 'DeepSeek',
  qwen: '通义千问',
  doubao: '字节豆包',
  yuanbao: '腾讯元宝'
};

onMounted(() => {
  const config = storage.getAIConfig();
  keys.value = config.keys;
  active.value = config.active;
  if (!keys.value.zhipu) {
    keys.value.zhipu = '8fcff9314cc0435d9887abacad4d3d81.QwAwgrEnWTnttD4y';
    storage.saveAIConfig(keys.value, active.value);
  }
});

const save = () => {
  storage.saveAIConfig(keys.value, active.value);
  alert('✨ AI 配置与激活核心已安全固化至本地！');
};
</script>
