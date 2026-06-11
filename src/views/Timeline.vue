<template>
  <div class="max-w-2xl mx-auto space-y-10">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-slate-800 font-heading">时光纪念馆</h1>
      <p class="text-sm text-slate-400 mt-2">记录人生中每一个闪光的里程碑</p>
    </div>

    <div class="flex justify-center">
      <button @click="showForm = !showForm"
        class="px-6 py-3 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 hover:scale-[1.02] transition font-body min-h-[44px]">
        {{ showForm ? '取消' : '+ 新增里程碑' }}
      </button>
    </div>

    <div v-if="showForm" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
      <input v-model="form.title" placeholder="里程碑标题"
        class="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-300" />
      <input v-model="form.date" type="date"
        class="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none text-slate-700" />
      <textarea v-model="form.description" rows="3" placeholder="描述这个里程碑..."
        class="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-200 resize-none placeholder:text-slate-300"></textarea>
      <select v-model="form.category"
        class="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none text-slate-700">
        <option value="career">职业</option><option value="study">学业</option><option value="life">生活</option><option value="relationship">情感</option><option value="health">健康</option>
      </select>
      <div>
        <label class="text-sm text-slate-500 block mb-2">上传图片</label>
        <input type="file" @change="handleImageUpload" accept="image/*" class="w-full text-sm text-slate-400" />
      </div>
      <div class="flex gap-3 pt-2">
        <button @click="showForm = false"
          class="flex-1 px-4 py-3 bg-slate-100 text-slate-600 text-sm rounded-2xl hover:bg-slate-200 transition font-body">取消</button>
        <button @click="addMilestone"
          class="flex-1 px-6 py-3 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 hover:scale-[1.02] transition font-body">确认添加</button>
      </div>
    </div>

    <div v-if="activeReminders.length > 0" class="space-y-3">
      <div v-for="reminder in activeReminders" :key="reminder.id"
        class="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
        <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg">🎉</div>
        <div>
          <div class="font-bold text-amber-700 text-sm">{{ reminder.title }}</div>
          <div class="text-xs text-amber-600 mt-0.5">{{ reminder.message }}</div>
        </div>
      </div>
    </div>

    <div class="relative pl-10 border-l-2 border-slate-100 space-y-10">
      <div v-for="m in milestonesList" :key="m.id" class="relative">
        <div class="absolute -left-[45px] top-2 w-5 h-5 rounded-full border-2 border-slate-300 bg-[#FDFCF8]"></div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div class="flex justify-between items-start gap-4">
            <div>
              <span class="text-xs font-semibold text-slate-500">{{ formatDate(m.date) }}</span>
              <h3 class="font-bold text-slate-800 mt-1 font-heading text-lg">{{ m.title }}</h3>
            </div>
            <button @click="deleteMilestone(m.id)"
              class="text-slate-300 hover:text-rose-400 text-sm btn-delete min-w-[44px] min-h-[44px] flex items-center justify-center transition">删除</button>
          </div>
          <p class="text-sm text-slate-400 mt-2">{{ getDaysMessage(m.date) }}</p>
          <p v-if="m.description" class="text-sm text-slate-600 mt-4 leading-relaxed">{{ m.description }}</p>
          <img v-if="m.image" :src="m.image" class="mt-4 rounded-2xl max-h-60 w-full object-cover" />
        </div>
      </div>
      <div v-if="milestonesList.length === 0" class="text-center text-slate-400 text-sm py-16">
        还没有里程碑，记录你的第一个闪光时刻
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'; import { storage, KEYS } from '../services/storage';
const showForm = ref(false); const form = ref({title:'',date:'',description:'',category:'life',image:''});
const activeReminders = ref([]); const notifiedMilestones = ref(new Set());
const milestoneVersion = ref(0); const milestonesList = computed(() => { milestoneVersion.value; return storage.get(KEYS.MILESTONES); });
const refreshMilestones = () => { milestoneVersion.value++; };
const formatDate = (d) => { const dt=new Date(d); return dt.getFullYear()+'年'+(dt.getMonth()+1)+'月'+dt.getDate()+'日'; };
const getDaysMessage = (d) => { const n=new Date(); n.setHours(0,0,0,0); const t=new Date(d); t.setHours(0,0,0,0); const diff=Math.floor((t-n)/(1000*60*60*24)); if(diff>0) return '距离还有 '+diff+' 天'; if(diff<0){ const a=Math.abs(diff); let m='已过去 '+a+' 天'; if(a>=365) m+=' ('+Math.floor(a/365)+' 年)'; return m; } return '就是今天！'; };
const checkMilestones = () => { const n=new Date(); n.setHours(0,0,0,0); const reminders=[]; const ms=storage.get(KEYS.MILESTONES); ms.forEach(m=>{ const t=new Date(m.date); t.setHours(0,0,0,0); const diff=Math.floor((n-t)/(1000*60*60*24)); if(diff>=0){ const k=m.id+'-'+diff; if(!notifiedMilestones.value.has(k)){ if(diff===0){reminders.push({id:m.id,title:m.title,message:'就是今天！'});notifiedMilestones.value.add(k)}else if(diff===100){reminders.push({id:m.id,title:m.title,message:'已过去100天！'});notifiedMilestones.value.add(k)}else if(diff===1000){reminders.push({id:m.id,title:m.title,message:'已过去1000天！'});notifiedMilestones.value.add(k)}else if(diff===365){reminders.push({id:m.id,title:m.title,message:'已过去整整一年！'});notifiedMilestones.value.add(k)}else if(diff>365&&diff%365===0){reminders.push({id:m.id,title:m.title,message:'已过去'+Math.floor(diff/365)+'年！'});notifiedMilestones.value.add(k)} } } }); activeReminders.value=reminders; };
const addMilestone = () => { if(!form.value.title.trim()||!form.value.date) return alert('请填写标题和日期'); storage.add(KEYS.MILESTONES,{...form.value}); form.value={title:'',date:'',description:'',category:'life',image:''}; showForm.value=false; refreshMilestones(); checkMilestones(); };
const deleteMilestone = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.MILESTONES,id); refreshMilestones(); checkMilestones(); } };
const handleImageUpload = (e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=(ev)=>{form.value.image=ev.target.result}; r.readAsDataURL(f); } };
onMounted(() => { checkMilestones(); });
</script>
