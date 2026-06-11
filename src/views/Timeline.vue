<template>
  <div class="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-6">
    <div class="border-b border-warmer-200 pb-4 flex justify-between items-center">
      <div><h1 class="text-2xl font-bold text-navy-500 font-heading">🕯️ 时光纪念馆</h1><p class="text-sm text-muted mt-1">记录人生中每一个闪光的里程碑</p></div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-navy-500 text-white text-sm rounded-2xl hover:bg-navy-600 hover:scale-105 transition font-body" :class="showForm ? 'btn-cancel' : 'btn-add'">{{ showForm ? '取消' : '+ 新增里程碑' }}</button>
    </div>
    <div v-if="showForm" class="bg-white p-5 rounded-3xl border border-warmer-200 shadow-card space-y-3">
      <input v-model="form.title" placeholder="里程碑标题" class="w-full p-3 bg-warmer-100 rounded-2xl text-sm text-body outline-none focus:ring-2 focus:ring-sage-400/30 placeholder:text-subtle" />
      <input v-model="form.date" type="date" class="w-full p-3 bg-warmer-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-sage-400/30 text-body" />
      <textarea v-model="form.description" rows="3" placeholder="描述这个里程碑..." class="w-full p-3 bg-warmer-100 rounded-2xl text-sm text-body outline-none focus:ring-2 focus:ring-sage-400/30 resize-none placeholder:text-subtle"></textarea>
      <select v-model="form.category" class="w-full p-3 bg-warmer-100 rounded-2xl text-sm outline-none text-body"><option value="career">💼 职业</option><option value="study">📎 学业</option><option value="life">🏠 生活</option><option value="relationship">❤️ 情感</option><option value="health">🩭 健康</option></select>
      <div><label class="text-sm text-body block mb-2">上传图片</label><input type="file" @change="handleImageUpload" accept="image/*" class="w-full text-sm text-muted" /></div>
      <div class="flex gap-2"><button @click="showForm = false" class="flex-1 px-4 py-2 bg-warmer-200 text-body text-sm rounded-2xl hover:bg-warmer-300 transition btn-cancel font-body">取消</button><button @click="addMilestone" class="flex-1 px-6 py-2 bg-navy-500 text-white text-sm rounded-2xl hover:bg-navy-600 hover:scale-105 transition btn-save font-body">确认添加</button></div>
    </div>
    <div class="space-y-2" v-if="activeReminders.length > 0">
      <div v-for="reminder in activeReminders" :key="reminder.id" class="p-4 bg-sage-400/10 border border-sage-400/20 rounded-2xl flex items-center gap-3">
        <span class="text-2xl">🎉</span><div><div class="font-bold text-sage-500 text-sm">{{ reminder.title }}</div><div class="text-xs text-sage-400">{{ reminder.message }}</div></div>
      </div>
    </div>
    <div class="relative pl-8 border-l-2 border-warmer-300 space-y-6">
      <div v-for="m in milestonesList" :key="m.id" class="relative">
        <div class="absolute -left-[41px] top-1 w-4 h-4 rounded-full border-2 border-sage-400 bg-warmer-50"></div>
        <div class="bg-white p-5 rounded-3xl border border-warmer-200 shadow-card hover:shadow-soft transition">
          <div class="flex justify-between items-start">
            <div><span class="text-xs font-semibold text-sage-400 handwritten">{{ categoryIcon(m.category) }} {{ formatDate(m.date) }}</span><h3 class="font-bold text-navy-500 mt-1 font-heading">{{ m.title }}</h3></div>
            <button @click="deleteMilestone(m.id)" class="text-coral-400 hover:text-coral-500 text-xs btn-delete">删除</button>
          </div>
          <p class="text-xs text-muted mt-1">{{ getDaysMessage(m.date) }}</p>
          <p v-if="m.description" class="text-sm text-body mt-2">{{ m.description }}</p>
          <img v-if="m.image" :src="m.image" class="mt-3 rounded-2xl max-h-60 w-full object-cover" />
        </div>
      </div>
      <div v-if="milestonesList.length === 0" class="text-center text-muted text-sm py-10">还没有里程碑，记录你的第一个闪光时刻 ✨</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'; import { storage, KEYS } from '../services/storage';
const showForm = ref(false); const form = ref({title:'',date:'',description:'',category:'life',image:''}); const activeReminders = ref([]); const notifiedMilestones = ref(new Set());
const milestoneVersion = ref(0); const milestonesList = computed(() => { milestoneVersion.value; return storage.get(KEYS.MILESTONES); });
const refreshMilestones = () => { milestoneVersion.value++; };
const categoryIcon = (c) => ({career:'💼',study:'📎',life:'🏠',relationship:'❤️',health:'🩭'})[c]||'🏠';
const formatDate = (d) => { const dt=new Date(d); return dt.getFullYear()+'年'+(dt.getMonth()+1)+'月'+dt.getDate()+'日'; };
const getDaysMessage = (d) => { const n=new Date(); n.setHours(0,0,0,0); const t=new Date(d); t.setHours(0,0,0,0); const diff=Math.floor((t-n)/(1000*60*60*24)); if(diff>0) return '距离还有 '+diff+' 天'; if(diff<0){ const a=Math.abs(diff); let m='已过去 '+a+' 天'; if(a>=365) m+=' ('+Math.floor(a/365)+' 年)'; return m; } return '就是今天！🎉'; };
const checkMilestones = () => { const n=new Date(); n.setHours(0,0,0,0); const reminders=[]; const ms=storage.get(KEYS.MILESTONES); ms.forEach(m=>{ const t=new Date(m.date); t.setHours(0,0,0,0); const diff=Math.floor((n-t)/(1000*60*60*24)); if(diff>=0){ const k=m.id+'-'+diff; if(!notifiedMilestones.value.has(k)){ if(diff===0){reminders.push({id:m.id,title:m.title,message:'就是今天！🎉'});notifiedMilestones.value.add(k)}else if(diff===100){reminders.push({id:m.id,title:m.title,message:'已过去100天！💴'});notifiedMilestones.value.add(k)}else if(diff===1000){reminders.push({id:m.id,title:m.title,message:'已过去1000天！🎳'});notifiedMilestones.value.add(k)}else if(diff===365){reminders.push({id:m.id,title:m.title,message:'已过去整整一年！🪆'});notifiedMilestones.value.add(k)}else if(diff>365&&diff%365===0){reminders.push({id:m.id,title:m.title,message:'已过去'+Math.floor(diff/365)+'年！🎉'});notifiedMilestones.value.add(k)} } } }); activeReminders.value=reminders; };
const addMilestone = () => { if(!form.value.title.trim()||!form.value.date) return alert('请填写标题和日期'); storage.add(KEYS.MILESTONES,{...form.value}); form.value={title:'',date:'',description:'',category:'life',image:''}; showForm.value=false; refreshMilestones(); checkMilestones(); };
const deleteMilestone = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.MILESTONES,id); refreshMilestones(); checkMilestones(); } };
const handleImageUpload = (e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=(ev)=>{form.value.image=ev.target.result}; r.readAsDataURL(f); } };
onMounted(() => { checkMilestones(); });
</script>