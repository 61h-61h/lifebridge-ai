<template>
  <div class="moments-root space-y-10 max-w-2xl mx-auto">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-slate-800 font-heading">朋友圈</h1>
      <p class="text-sm text-slate-400 mt-2">记录你的生活瞬间</p>
    </div>

    <div class="flex justify-center gap-2">
      <button @click="filter='all'" :class="filter==='all'?'bg-slate-800 text-white':'bg-white text-slate-500 border border-slate-200'"
        class="px-5 py-2.5 rounded-full text-sm transition hover:scale-[1.02] min-h-[40px]">全部</button>
      <button @click="filter='public'" :class="filter==='public'?'bg-slate-800 text-white':'bg-white text-slate-500 border border-slate-200'"
        class="px-5 py-2.5 rounded-full text-sm transition hover:scale-[1.02] min-h-[40px]">公共</button>
      <button @click="filter='private'" :class="filter==='private'?'bg-slate-800 text-white':'bg-white text-slate-500 border border-slate-200'"
        class="px-5 py-2.5 rounded-full text-sm transition hover:scale-[1.02] min-h-[40px]">隐私</button>
    </div>

    <div v-if="!showForm" class="flex justify-center">
      <button @click="showForm = !showForm"
        class="px-6 py-3 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 hover:scale-[1.02] transition font-body min-h-[44px]">
        + 发布动态
      </button>
    </div>

    <div v-if="showForm" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
      <textarea v-model="form.content" rows="4" placeholder="此刻的想法..."
        class="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-200 resize-none placeholder:text-slate-300"></textarea>
      <div class="flex gap-2">
        <button v-for="m in quickMoods" :key="m" @click="form.mood = form.mood === m ? '' : m"
          class="text-xl px-3 py-2 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center"
          :class="form.mood === m ? 'bg-slate-100' : 'hover:bg-slate-50 text-slate-400'">{{ m }}</button>
      </div>
      <div class="flex items-center gap-4">
        <label class="text-sm text-slate-500">可见范围</label>
        <select v-model="form.isPrivate" class="p-3 bg-slate-50 rounded-xl text-sm outline-none text-slate-700">
          <option :value="false">公共</option><option :value="true">隐私</option>
        </select>
      </div>
      <div>
        <label class="text-sm text-slate-500 block mb-2">上传图片</label>
        <input type="file" @change="handleImageUpload" accept="image/*" class="w-full text-sm text-slate-400" />
      </div>
      <div class="flex gap-3 pt-2">
        <button @click="showForm = false"
          class="flex-1 px-4 py-3 bg-slate-100 text-slate-600 text-sm rounded-2xl hover:bg-slate-200 transition font-body">取消</button>
        <button @click="addMoment"
          class="flex-1 px-5 py-3 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 hover:scale-[1.02] transition font-body">发布</button>
      </div>
    </div>

    <div class="space-y-6">
      <div v-for="m in filteredMoments" :key="m.id"
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
        <div class="flex justify-between items-start gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full flex items-center justify-center text-white text-sm font-body">我</div>
            <div>
              <span class="text-sm text-slate-400 handwritten">{{ m.createdAt }}</span>
              <span v-if="m.mood" class="text-lg ml-2">{{ m.mood }}</span>
            </div>
          </div>
          <button @click="deleteMoment(m.id)"
            class="text-slate-300 hover:text-rose-400 text-sm btn-delete min-w-[44px] min-h-[44px] flex items-center justify-center transition">删除</button>
        </div>
        <div v-if="m.isPrivate && !isUnlocked && filter !== 'private'">
          <p class="mt-4 text-sm text-slate-400">隐私内容，点击查看</p>
        </div>
        <div v-else-if="m.isPrivate && !isUnlocked && filter === 'private'">
          <p class="mt-4 text-sm text-slate-400">需要密码查看</p>
        </div>
        <div v-else>
          <p class="mt-4 text-sm text-slate-600 leading-relaxed">{{ m.content }}</p>
          <img v-if="m.image" :src="m.image" class="mt-4 rounded-2xl max-h-80 w-full object-cover" />
          <div class="mt-4 pt-3 border-t border-slate-50">
            <button @click="aiComment(m)" :disabled="m.aiLoading"
              class="text-sm text-slate-400 hover:text-slate-600 transition min-h-[36px]">
              {{ m.aiLoading ? 'AI 思考中...' : 'AI 评论' }}
            </button>
          </div>
          <div v-if="m.aiComment" class="mt-3 p-4 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100">
            {{ m.aiComment }}
          </div>
        </div>
      </div>
      <div v-if="filteredMoments.length === 0" class="text-center text-slate-400 text-sm py-16">
        还没有动态，记录你的生活瞬间吧
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai'; import { Plus, Trash2, Sparkles, User } from 'lucide-vue-next';
const PRIVACY_PASSWORD_KEY = 'lb_privacy_password';
const quickMoods = ['😉','😹','😩','😌','😫','😀'];
const form = ref({content:'',mood:'',isPrivate:false,image:''}); const filter = ref('all');
const showForm = ref(false); const isUnlocked = ref(false);
const privacyPassword = ref(localStorage.getItem(PRIVACY_PASSWORD_KEY)||'');
const momentVersion = ref(0); const moments = computed(() => { momentVersion.value; return storage.get(KEYS.MOMENTS); });
const filteredMoments = computed(() => { let r=moments.value; if(filter.value==='public') r=r.filter(m=>!m.isPrivate); if(filter.value==='private') r=r.filter(m=>m.isPrivate); return r; });
const refreshMoments = () => { momentVersion.value++; };
const addMoment = () => { if(!form.value.content.trim()) return alert('请写点什么'); if(form.value.isPrivate&&!privacyPassword.value){ const p=prompt('首次设置隐私密码：'); if(!p) return; privacyPassword.value=p; localStorage.setItem(PRIVACY_PASSWORD_KEY,p); } storage.add(KEYS.MOMENTS,{...form.value,aiComment:'',aiLoading:false}); form.value={content:'',mood:'',isPrivate:false,image:''}; showForm.value=false; refreshMoments(); };
const deleteMoment = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.MOMENTS,id); refreshMoments(); } };
const aiComment = async (m) => { storage.update(KEYS.MOMENTS,m.id,{aiLoading:true}); refreshMoments(); try{ const r=await askAI({systemPrompt:'你是一个风趣幽默的朋友，用轻松的语气回应对方的动态。',userMessage:m.content}); storage.update(KEYS.MOMENTS,m.id,{aiComment:r,aiLoading:false}); }catch(e){storage.update(KEYS.MOMENTS,m.id,{aiComment:'⚠️ '+e.message,aiLoading:false});} refreshMoments(); };
const handleImageUpload = (e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=(ev)=>{form.value.image=ev.target.result}; r.readAsDataURL(f); } };
</script>
