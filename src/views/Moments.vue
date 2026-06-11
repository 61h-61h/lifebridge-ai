<template>
  <div class="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-6">
    <div class="border-b border-warmer-200 pb-4 flex justify-between items-center">
      <div><h1 class="text-2xl font-bold text-navy-500 font-heading">?? ???</h1><p class="text-sm text-muted mt-1">????????</p></div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-navy-500 text-white text-sm rounded-2xl hover:bg-navy-600 hover:scale-105 transition font-body" :class="showForm ? 'btn-cancel' : 'btn-add'">{{ showForm ? '??' : '+ ????' }}</button>
    </div>

    <div v-if="showForm" class="bg-white p-5 rounded-3xl border border-warmer-200 shadow-card space-y-3">
      <textarea v-model="form.content" rows="3" placeholder="?????..." class="w-full p-3 bg-warmer-100 rounded-2xl text-sm text-body outline-none focus:ring-2 focus:ring-sage-400/30 resize-none placeholder:text-subtle"></textarea>
      <div class="flex gap-1"><button v-for="m in quickMoods" :key="m" @click="form.mood = form.mood === m ? '' : m" class="text-lg px-1.5 py-0.5 rounded-2xl transition" :class="form.mood === m ? 'bg-warmer-100' : 'hover:bg-warmer-100 text-subtle'">{{ m }}</button></div>
      <div class="flex items-center gap-4"><label class="text-sm text-body">?????</label><select v-model="form.isPrivate" class="p-2 bg-warmer-100 rounded-xl text-sm outline-none text-body"><option :value="false">??</option><option :value="true">??</option></select></div>
      <div><label class="text-sm text-body block mb-2">????</label><input type="file" @change="handleImageUpload" accept="image/*" class="w-full text-sm text-muted" /></div>
      <div class="flex gap-2"><button @click="showForm = false" class="flex-1 px-4 py-2 bg-warmer-200 text-body text-sm rounded-2xl hover:bg-warmer-300 transition btn-cancel font-body">??</button><button @click="addMoment" class="flex-1 px-5 py-2 bg-navy-500 text-white text-sm rounded-2xl hover:bg-navy-600 hover:scale-105 transition btn-publish font-body">??</button></div>
    </div>

    <div class="flex gap-2">
      <button @click="filter='all'" :class="filter==='all'?'bg-warmer-200 text-navy-500':'bg-white text-muted border border-warmer-200'" class="px-4 py-2 rounded-full text-sm transition hover:scale-105">??</button>
      <button @click="filter='public'" :class="filter==='public'?'bg-warmer-200 text-navy-500':'bg-white text-muted border border-warmer-200'" class="px-4 py-2 rounded-full text-sm transition hover:scale-105">??</button>
      <button @click="filter='private'" :class="filter==='private'?'bg-warmer-200 text-navy-500':'bg-white text-muted border border-warmer-200'" class="px-4 py-2 rounded-full text-sm transition hover:scale-105">?? ??</button>
    </div>

    <div class="space-y-4">
      <div v-for="m in filteredMoments" :key="m.id" class="bg-white p-5 rounded-3xl border border-warmer-200 shadow-card">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 bg-gradient-to-br from-coral-400 to-sage-400 rounded-full flex items-center justify-center text-white text-sm font-body">?</div>
            <span class="text-sm text-muted handwritten">{{ m.createdAt }}</span>
            <span v-if="m.mood" class="text-lg">{{ m.mood }}</span>
            <span v-if="m.isPrivate" class="text-xs">??</span>
          </div>
          <button @click="deleteMoment(m.id)" class="text-coral-400 hover:text-coral-500 text-sm btn-delete">??</button>
        </div>
        <div v-if="m.isPrivate && !isUnlocked && filter !== 'private'">
          <p class="mt-3 text-sm text-muted">?? ?????????</p>
        </div>
        <div v-else-if="m.isPrivate && !isUnlocked && filter === 'private'">
          <div class="mt-3 text-sm text-muted">?? ??????</div>
        </div>
        <div v-else>
          <p class="mt-3 text-sm text-body leading-relaxed">{{ m.content }}</p>
          <img v-if="m.image" :src="m.image" class="mt-3 rounded-2xl max-h-96 w-full object-cover" />
          <div class="mt-3 flex gap-4 text-sm text-muted">
            <button @click="aiComment(m)" :disabled="m.aiLoading" class="hover:text-sage-400 transition">{{ m.aiLoading ? '?? ???...' : '?? AI ??' }}</button>
          </div>
          <div v-if="m.aiComment" class="mt-2 p-3 bg-sage-400/5 rounded-2xl text-sm text-body border border-sage-400/10">?? {{ m.aiComment }}</div>
        </div>
      </div>
      <div v-if="filteredMoments.length === 0" class="text-center text-muted text-sm py-10">??????????????? ??</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai';
const PRIVACY_PASSWORD_KEY = 'lb_privacy_password'; const quickMoods = ['??','??','??','??','??','??'];
const form = ref({content:'',mood:'',isPrivate:false,image:''}); const filter = ref('all'); const showForm = ref(false); const isUnlocked = ref(false); const privacyPassword = ref(localStorage.getItem(PRIVACY_PASSWORD_KEY)||'');
const momentVersion = ref(0); const moments = computed(() => { momentVersion.value; return storage.get(KEYS.MOMENTS); });
const filteredMoments = computed(() => { let r=moments.value; if(filter.value==='public') r=r.filter(m=>!m.isPrivate); if(filter.value==='private') r=r.filter(m=>m.isPrivate); return r; });
const refreshMoments = () => { momentVersion.value++; };
const addMoment = () => { if(!form.value.content.trim()) return alert('?????'); if(form.value.isPrivate&&!privacyPassword.value){ const p=prompt('?????????'); if(!p) return; privacyPassword.value=p; localStorage.setItem(PRIVACY_PASSWORD_KEY,p); } storage.add(KEYS.MOMENTS,{...form.value,aiComment:'',aiLoading:false}); form.value={content:'',mood:'',isPrivate:false,image:''}; showForm.value=false; refreshMoments(); };
const deleteMoment = (id) => { if(confirm('?????')){ storage.delete(KEYS.MOMENTS,id); refreshMoments(); } };
const aiComment = async (m) => { storage.update(KEYS.MOMENTS,m.id,{aiLoading:true}); refreshMoments(); try{ const r=await askAI({systemPrompt:'??????????????????????????',userMessage:m.content}); storage.update(KEYS.MOMENTS,m.id,{aiComment:r,aiLoading:false}); }catch(e){storage.update(KEYS.MOMENTS,m.id,{aiComment:'?? '+e.message,aiLoading:false});} refreshMoments(); };
const handleImageUpload = (e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=(ev)=>{form.value.image=ev.target.result}; r.readAsDataURL(f); } };
</script>