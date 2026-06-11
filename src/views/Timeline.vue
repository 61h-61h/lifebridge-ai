<template>
  <div class="p-4 md:p-8 max-w-3xl mx-auto space-y-4 md:space-y-6">
    <div class="border-b border-hairline pb-4 flex justify-between items-center">
      <div><h1 class="text-xl md:text-2xl text-champagne font-display font-semibold">⏳ 时光纪念馆</h1><p class="text-xs text-text-faint mt-1 font-mono">记录人生中每一个闪光的里程碑</p></div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-kinpaku/20 text-kinpaku text-sm rounded-xl hover:bg-kinpaku/30 transition border border-hairline-strong" :class="showForm ? 'btn-cancel' : 'btn-add'">{{ showForm ? '取消' : '+ 新增里程碑' }}</button>
    </div>
    <div v-if="showForm" class="card p-4 md:p-5 space-y-3">
      <input v-model="form.title" placeholder="里程碑标题" class="w-full p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none focus:border-hairline-strong placeholder:text-text-faint" />
      <input v-model="form.date" type="date" class="w-full p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none" />
      <textarea v-model="form.description" rows="3" placeholder="描述这个里程碑..." class="w-full p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none focus:border-hairline-strong resize-none placeholder:text-text-faint"></textarea>
      <select v-model="form.category" class="w-full p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none"><option value="career">💼 职业</option><option value="study">📚 学业</option><option value="life">🏠 生活</option><option value="relationship">❤️ 情感</option><option value="health">💪 健康</option></select>
      <div><label class="text-sm text-text-muted block mb-2">上传图片（可选）</label><input type="file" @change="handleImageUpload" accept="image/*" class="w-full text-sm text-text-faint" /></div>
      <div class="flex gap-2"><button @click="showForm = false" class="flex-1 px-4 py-2 bg-graphite text-text-muted text-sm rounded-xl hover:bg-graphite-2 transition btn-cancel">取消</button><button @click="addMilestone" class="flex-1 px-6 py-2 bg-kinpaku/20 text-kinpaku text-sm rounded-xl hover:bg-kinpaku/30 transition btn-save border border-hairline-strong">确认添加</button></div>
    </div>
    <div class="space-y-2 mb-6"><div v-for="reminder in activeReminders" :key="reminder.id" class="p-4 bg-kinpaku/10 border border-kinpaku/30 rounded-xl flex items-center gap-3"><span class="text-2xl">🎉</span><div><div class="text-kinpaku text-sm font-semibold">{{ reminder.title }}</div><div class="text-xs text-kinpaku/60">{{ reminder.message }}</div></div></div></div>
    <div class="relative pl-8 border-l-2 border-hairline space-y-6">
      <div v-for="m in milestonesList" :key="m.id" class="relative"><div class="absolute -left-[41px] top-1 w-4 h-4 rounded-full border-2 border-kinpaku bg-lacquer"></div><div class="card p-4 md:p-5 hover:border-hairline-strong transition"><div class="flex justify-between items-start"><div><span class="text-xs text-kinpaku font-mono">{{ categoryIcon(m.category) }} {{ formatDate(m.date) }}</span><h3 class="text-champagne mt-1 font-semibold">{{ m.title }}</h3></div><button @click="deleteMilestone(m.id)" class="text-vermilion/60 hover:text-vermilion text-xs btn-delete">删除</button></div><p class="text-xs text-text-faint mt-1">{{ getDaysMessage(m.date) }}</p><p v-if="m.description" class="text-sm text-text-warm mt-2">{{ m.description }}</p><img v-if="m.image" :src="m.image" class="mt-3 rounded-xl max-h-60 w-full object-cover" /></div></div>
      <div v-if="milestonesList.length === 0" class="text-center text-text-faint text-sm py-8">还没有里程碑，记录你的第一个闪光时刻 ✨</div></div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'; import { storage, KEYS } from '../services/storage';
const showForm = ref(false); const form = ref({ title:'',date:'',description:'',category:'life',image:'' }); const activeReminders = ref([]); const notifiedMilestones = ref(new Set());
const milestoneVersion = ref(0); const milestonesList = computed(() => { milestoneVersion.value; return storage.get(KEYS.MILESTONES); });
const refreshMilestones = () => { milestoneVersion.value++; };
const categoryIcon = (c) => ({career:'💼',study:'📚',life:'🏠',relationship:'❤️',health:'💪'})[c]||'🏠';
const formatDate = (d) => { const dt=new Date(d); return dt.getFullYear()+'年'+(dt.getMonth()+1)+'月'+dt.getDate()+'日'; };
const getDaysMessage = (d) => { const n=new Date(); n.setHours(0,0,0,0); const t=new Date(d); t.setHours(0,0,0,0); const diff=Math.floor((t-n)/(1000*60*60*24)); if(diff>0) return '距离还有 '+diff+' 天'; if(diff<0){ const a=Math.abs(diff); let m='已过去 '+a+' 天'; if(a>=365) m+=' ('+Math.floor(a/365)+' 年)'; return m; } return '就是今天！🎉'; };
const checkMilestones = () => { const n=new Date(); n.setHours(0,0,0,0); const reminders=[]; const ms=storage.get(KEYS.MILESTONES); ms.forEach(m=>{ const t=new Date(m.date); t.setHours(0,0,0,0); const diff=Math.floor((n-t)/(1000*60*60*24)); if(diff>=0){ const k=m.id+'-'+diff; if(!notifiedMilestones.value.has(k)){ if(diff===0){ reminders.push({id:m.id,title:m.title,message:'就是今天！🎉'}); notifiedMilestones.value.add(k); }else if(diff===100){ reminders.push({id:m.id,title:m.title,message:'已过去 100 天！💯'}); notifiedMilestones.value.add(k); }else if(diff===1000){ reminders.push({id:m.id,title:m.title,message:'已过去 1000 天！🏆'}); notifiedMilestones.value.add(k); }else if(diff===365){ reminders.push({id:m.id,title:m.title,message:'已过去整整一年！🎂'}); notifiedMilestones.value.add(k); }else if(diff>365&&diff%365===0){ reminders.push({id:m.id,title:m.title,message:'已过去 '+Math.floor(diff/365)+' 年！🎉'}); notifiedMilestones.value.add(k); } } } }); activeReminders.value=reminders; };
const addMilestone = () => { if(!form.value.title.trim()||!form.value.date) return alert('请填写标题和日期'); storage.add(KEYS.MILESTONES,{...form.value}); form.value={title:'',date:'',description:'',category:'life',image:''}; showForm.value=false; refreshMilestones(); checkMilestones(); };
const deleteMilestone = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.MILESTONES,id); refreshMilestones(); checkMilestones(); } };
const handleImageUpload = (e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=(ev)=>{form.value.image=ev.target.result}; r.readAsDataURL(f); } };
onMounted(() => { checkMilestones(); });
</script>